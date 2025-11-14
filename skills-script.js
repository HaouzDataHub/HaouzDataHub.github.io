// Enhanced Skills Page Script with GitHub Data Loading, Admin Authentication, and Cross-Browser Sync
// Author: HaouzDataHub
// Purpose: Load skills data from GitHub with centralized storage and multi-browser synchronization

const SKILLS_DATA_URL = 'https://raw.githubusercontent.com/HaouzDataHub/HaouzDataHub.github.io/main/skills-data.json';
const ADMIN_PASSWORD = 'admin123';
const SYNC_INTERVAL = 5000; // Check for updates every 5 seconds
const STORAGE_KEY = 'skillsData';
const ADMIN_KEY = 'skillsAdminAuth';
const LAST_SYNC_KEY = 'lastDataSync';

let skillsData = [];
let isAdmin = false;
let lastDataHash = null;
let syncCheckInterval = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Skills page initializing...');
  await loadSkillsData();
  renderSkills();
  checkAdminStatus();
  setupSyncListener();
  // Check for updates periodically
  startAutoSync();
});

// Auto-sync: Check GitHub for updates periodically
function startAutoSync() {
  syncCheckInterval = setInterval(async () => {
    console.log('Checking for data updates from GitHub...');
    await checkAndUpdateData();
  }, SYNC_INTERVAL);
}

// Stop auto-sync (optional, for cleanup)
function stopAutoSync() {
  if (syncCheckInterval) {
    clearInterval(syncCheckInterval);
  }
}

// Check GitHub for updates and sync if needed
async function checkAndUpdateData() {
  try {
    const response = await fetch(SKILLS_DATA_URL);
    if (response.ok) {
      const remoteData = await response.json();
      const remoteHash = JSON.stringify(remoteData);
      
      // Only update if data has changed
      if (remoteHash !== lastDataHash) {
        console.log('Data updated on GitHub, syncing...');
        skillsData = remoteData.skills || remoteData;
        lastDataHash = remoteHash;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(skillsData));
        localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
        renderSkills();
        
        // Broadcast update to other tabs
        broadcastDataUpdate();
      }
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

// Broadcast data updates across tabs using storage events
function broadcastDataUpdate() {
  // Use a flag to notify other tabs
  const timestamp = Date.now();
  localStorage.setItem('skillsDataUpdated', timestamp.toString());
}

// Listen for storage changes from other tabs
function setupSyncListener() {
  window.addEventListener('storage', (e) => {
    if (e.key === 'skillsDataUpdated') {
      console.log('Data updated in another tab, syncing...');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        skillsData = JSON.parse(stored);
        renderSkills();
      }
    }
    if (e.key === ADMIN_KEY) {
      checkAdminStatus();
    }
  });
}

// Load skills data from GitHub or fallback to localStorage
async function loadSkillsData() {
  try {
    const response = await fetch(SKILLS_DATA_URL);
    if (response.ok) {
      const data = await response.json();
      // Handle both direct array and {skills: [...]} format
      skillsData = data.skills || data || [];
      lastDataHash = JSON.stringify(data);
      console.log('Skills loaded from GitHub:', skillsData);
      // Save to localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skillsData));
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      return;
    }
  } catch (error) {
    console.error('Error loading from GitHub:', error);
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      skillsData = JSON.parse(stored);
      console.log('Skills loaded from localStorage');
    } catch (e) {
      console.error('Error parsing localStorage:', e);
      skillsData = [];
    }
  } else {
    skillsData = [];
    console.log('No skills data found, starting with empty array');
  }
}

// Check if user is admin by looking at sessionStorage
function checkAdminStatus() {
  isAdmin = sessionStorage.getItem(ADMIN_KEY) === 'true';
  updateAdminUI();
}

// Update UI based on admin status
function updateAdminUI() {
  const addBtn = document.querySelector('.add-skill-btn') || document.getElementById('addSkillBtn');
  const editBtns = document.querySelectorAll('.edit-skill-btn');
  const deleteBtns = document.querySelectorAll('.delete-skill-btn');
  const adminToggle = document.querySelector('.admin-toggle-btn');
  
  if (isAdmin) {
    if (addBtn) addBtn.style.display = 'inline-block';
    editBtns.forEach(btn => btn.style.display = 'inline-block');
    deleteBtns.forEach(btn => btn.style.display = 'inline-block');
    if (adminToggle) adminToggle.textContent = 'Logout Admin';
  } else {
    if (addBtn) addBtn.style.display = 'none';
    editBtns.forEach(btn => btn.style.display = 'none');
    deleteBtns.forEach(btn => btn.style.display = 'none');
    if (adminToggle) adminToggle.textContent = 'Admin Login';
  }
}

// Prompt for admin password
function promptAdminPassword() {
  const password = prompt('Enter admin password:');
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_KEY, 'true');
    isAdmin = true;
    updateAdminUI();
    alert('Admin access granted!');
  } else if (password !== null) {
    alert('Incorrect password');
  }
}

// Logout admin
function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_KEY);
  isAdmin = false;
  updateAdminUI();
  alert('Admin access revoked');
}

// Render skills cards
function renderSkills() {
  // Try multiple possible container IDs
  const container = document.getElementById('postsGrid') || 
                   document.getElementById('skills-container') ||
                   document.querySelector('.posts-grid') ||
                   document.querySelector('[data-container="skills"]');
  
  if (!container) {
    console.warn('Skills container not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (skillsData.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">No skills data available. Admin can add new skills.</p>';
    return;
  }
  
  skillsData.forEach((skill, index) => {
    const card = createSkillCard(skill, index);
    container.appendChild(card);
  });
}

// Create individual skill card
function createSkillCard(skill, index) {
  const card = document.createElement('div');
  card.className = 'skill-card animate-fade-in';
  card.id = `skill-${index}`;
  
  let adminButtons = '';
  if (isAdmin) {
    adminButtons = `
      <div class="admin-buttons">
        <button class="edit-skill-btn" onclick="editSkill(${index})">Edit</button>
        <button class="delete-skill-btn" onclick="deleteSkill(${index})">Delete</button>
      </div>
    `;
  }
  
  const codeBlock = skill.code ? `
    <pre><code>${escapeHtml(skill.code)}</code></pre>
    <button class="copy-btn" onclick="copyCode(${index})">Copy Code</button>
  ` : '';
  
  card.innerHTML = `
    <h3>${escapeHtml(skill.title || '')}</h3>
    ${skill.description ? `<p>${escapeHtml(skill.description)}</p>` : ''}
    ${skill.image ? `<img src="${skill.image}" alt="${skill.title}">` : ''}
    ${codeBlock}
    ${adminButtons}
  `;
  
  return card;
}

// Copy code to clipboard
function copyCode(index) {
  const code = skillsData[index]?.code;
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy code');
    });
  }
}

// Escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Add new skill
function addSkill() {
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  const title = prompt('Enter skill title:');
  if (!title) return;
  
  const description = prompt('Enter skill description:');
  const code = prompt('Enter code (optional):');
  const image = prompt('Enter image URL (optional):');
  
  const newSkill = {
    id: Date.now(), // Use timestamp as simple ID
    title,
    description: description || '',
    code: code || '',
    image: image || ''
  };
  
  skillsData.push(newSkill);
  saveSkillsData();
  renderSkills();
  alert('Skill added! Note: This is stored locally. For GitHub sync, you need to commit via GitHub interface.');
}

// Edit skill
function editSkill(index) {
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  const skill = skillsData[index];
  
  const title = prompt('Edit skill title:', skill.title);
  if (title === null) return;
  
  const description = prompt('Edit description:', skill.description);
  const code = prompt('Edit code:', skill.code);
  const image = prompt('Edit image URL:', skill.image);
  
  skillsData[index] = {
    ...skill,
    title: title || skill.title,
    description: description || '',
    code: code || '',
    image: image || ''
  };
  
  saveSkillsData();
  renderSkills();
  alert('Skill edited! Note: This is stored locally. For GitHub sync, you need to commit via GitHub interface.');
}

// Delete skill
function deleteSkill(index) {
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  if (confirm('Are you sure you want to delete this skill?')) {
    skillsData.splice(index, 1);
    saveSkillsData();
    renderSkills();
    alert('Skill deleted! Note: This is stored locally. For GitHub sync, you need to commit via GitHub interface.');
  }
}

// Save skills data to localStorage and notify other tabs
function saveSkillsData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skillsData));
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  console.log('Skills data saved to localStorage');
  broadcastDataUpdate();
}

// Admin keyboard shortcut: Ctrl+Shift+A to toggle admin mode
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    if (isAdmin) {
      logoutAdmin();
    } else {
      promptAdminPassword();
    }
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopAutoSync();
});

console.log('Enhanced Skills script loaded. Press Ctrl+Shift+A to toggle admin mode.');

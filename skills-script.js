// Simple Skills Display Script
// Loads data from skills-data.json and displays skill cards

let skillsData = [];
let isAdmin = false;

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Loading skills data...');
  await loadSkillsData();
  renderSkills();
  checkAdminStatus();
});

// Load skills data from skills-data.json
async function loadSkillsData() {
  try {
    const response = await fetch('skills-data.json');
    if (response.ok) {
      const data = await response.json();
      skillsData = data.skills || data || [];
      console.log('Loaded ' + skillsData.length + ' skills');
      // Save to localStorage as backup
      localStorage.setItem('skillsData', JSON.stringify(skillsData));
      return;
    }
  } catch (error) {
    console.error('Error loading from skills-data.json:', error);
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem('skillsData');
  if (stored) {
    skillsData = JSON.parse(stored);
    console.log('Loaded from localStorage: ' + skillsData.length + ' skills');
  } else {
    console.log('No skills data found');
    skillsData = [];
  }
}

// Check admin status
function checkAdminStatus() {
  isAdmin = sessionStorage.getItem('skillsAdminAuth') === 'true';
  updateUI();
}

// Prompt for admin password
function promptAdminPassword() {
  const password = prompt('Enter admin password:');
  if (password === 'admin123') {
    sessionStorage.setItem('skillsAdminAuth', 'true');
    isAdmin = true;
    updateUI();
    alert('Admin access granted!');
    location.reload();
  } else if (password !== null) {
    alert('Incorrect password');
  }
}

// Logout admin
function logoutAdmin() {
  sessionStorage.removeItem('skillsAdminAuth');
  isAdmin = false;
  updateUI();
  alert('Admin access revoked');
  location.reload();
}

// Update UI based on admin status
function updateUI() {
  const addBtn = document.getElementById('addSkillBtn');
  if (addBtn) {
    addBtn.style.display = isAdmin ? 'block' : 'none';
  }
}

// Render all skills
function renderSkills() {
  const container = document.getElementById('postsGrid');
  if (!container) {
    console.warn('Container postsGrid not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (skillsData.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">No skills available</p>';
    return;
  }
  
  skillsData.forEach((skill, index) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <h3>${skill.title || ''}</h3>
      ${skill.description ? `<p>${skill.description}</p>` : ''}
      ${skill.code ? `<pre><code>${skill.code}</code></pre><button onclick="copyCode('${index}')">Copy Code</button>` : ''}
      ${isAdmin ? `<button onclick="deleteSkill('${index}')">Delete</button>` : ''}
    `;
    container.appendChild(card);
  });
}

// Copy code to clipboard
function copyCode(index) {
  const code = skillsData[index]?.code;
  if (code) {
    navigator.clipboard.writeText(code);
    alert('Code copied!');
  }
}

// Delete skill (admin only)
function deleteSkill(index) {
  if (!isAdmin) return;
  if (confirm('Delete this skill?')) {
    skillsData.splice(index, 1);
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    renderSkills();
  }
}

// Admin keyboard shortcut: Ctrl+Shift+A
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    if (isAdmin) {
      logoutAdmin();
    } else {
      promptAdminPassword();
    }
  }
});

console.log('Skills script ready. Press Ctrl+Shift+A for admin mode.');

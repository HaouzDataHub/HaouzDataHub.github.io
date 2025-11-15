// Improved Skills Display Script
// Uses both skills-data.js (local) and skills-data.json (GitHub)

// skillsData will be populated from skills-data.js
let isAdmin = false;

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Loading skills data...');
  await loadSkillsData();
  renderSkills();
  checkAdminStatus();
  setupFilterButtons();
});

// Load skills data - Priority: GitHub JSON > Local skills-data.js > localStorage
async function loadSkillsData() {
  // First, try to load from skills-data.json (GitHub)
  try {
    const response = await fetch('skills-data.json');
    if (response.ok) {
      const data = await response.json();
      skillsData = data.skills || data || [];
      console.log('Loaded ' + skillsData.length + ' skills from JSON');
      localStorage.setItem('skillsData', JSON.stringify(skillsData));
      return;
    }
  } catch (error) {
    console.warn('Could not load from skills-data.json:', error);
  }

  // Fallback to skills-data.js variable (if loaded)
  if (typeof skillsData !== 'undefined' && Array.isArray(skillsData) && skillsData.length > 0) {
    console.log('Using data from skills-data.js: ' + skillsData.length + ' skills');
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    return;
  }

  // Last resort: Load from localStorage
  const stored = localStorage.getItem('skillsData');
  if (stored) {
    skillsData = JSON.parse(stored);
    console.log('Loaded from localStorage: ' + skillsData.length + ' skills');
  } else {
    console.log('No skills data found, using empty array');
    skillsData = [];
  }
}

// Setup filter buttons
function setupFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');
      filterSkills(filter);
    });
  });
}

// Filter skills by category
function filterSkills(category) {
  if (category === 'all') {
    renderSkills();
  } else {
    const filtered = skillsData.filter(s => s.category === category);
    renderFilteredSkills(filtered);
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
    container.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">No skills available</p>';
    return;
  }

  skillsData.forEach((skill, index) => {
    const card = createSkillCard(skill, index);
    container.appendChild(card);
  });
}

// Render filtered skills
function renderFilteredSkills(filtered) {
  const container = document.getElementById('postsGrid');
  if (!container) return;

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">No skills in this category</p>';
    return;
  }

  filtered.forEach((skill, index) => {
    const card = createSkillCard(skill, index);
    container.appendChild(card);
  });
}

// Create skill card element
function createSkillCard(skill, index) {
  const card = document.createElement('div');
  card.className = 'skill-card';
  card.innerHTML = `
    <h3>${skill.title || ''}</h3>
    ${skill.description ? `<p>${skill.description}</p>` : ''}
    ${skill.code ? `<pre><code>${escapeHtml(skill.code)}</code></pre>` : ''}
    <div class="card-actions">
      ${skill.code ? `<button class="btn-copy" onclick="copyCode(${index})">Copy Code</button>` : ''}
      ${isAdmin ? `<button class="btn-delete" onclick="deleteSkill(${index})">Delete</button>` : ''}
    </div>
  `;
  return card;
}

// Escape HTML to prevent XSS
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

console.log('Skills script loaded. Press Ctrl+Shift+A for admin mode.');

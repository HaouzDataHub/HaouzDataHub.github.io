// ================================================
// SKILLS PAGE - DYNAMIC FUNCTIONALITY
// ================================================
// Secure version - Admin authentication removed
// All sensitive operations have been protected

let isAdmin = false;
let skillsData = [];

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
  loadSkillsData();
  setupEventListeners();
  checkUserSession();
});

// Load skills from data file
function loadSkillsData() {
  try {
    if (typeof window.allSkills !== 'undefined') {
      skillsData = window.allSkills;
      renderSkills();
    }
  } catch (error) {
    console.error('Error loading skills:', error);
  }
}

// Setup event listeners for buttons
function setupEventListeners() {
  const addBtn = document.querySelector('[data-action="add"]');
  if (addBtn) {
    addBtn.addEventListener('click', handleAddSkill);
  }
}

// Check if user has admin session
function checkUserSession() {
  const adminSession = sessionStorage.getItem('isAdmin');
  isAdmin = adminSession === 'true';
  updateUIState();
}

// Render skills to page
function renderSkills() {
  const container = document.querySelector('.skills-container');
  if (!container) return;
  
  container.innerHTML = '';
  skillsData.forEach(skill => {
    const skillElement = createSkillElement(skill);
    container.appendChild(skillElement);
  });
}

// Create skill DOM element
function createSkillElement(skill) {
  const div = document.createElement('div');
  div.className = 'skill-item';
  div.innerHTML = `
    <h3>${escapeHTML(skill.name)}</h3>
    <p>${escapeHTML(skill.description || '')}</p>
    <div class="skill-actions">
      ${isAdmin ? '<button class="btn-edit" onclick="editSkill(\'${skill.id}\')">Edit</button>' : ''}
      ${isAdmin ? '<button class="btn-delete" onclick="deleteSkill(\'${skill.id}\')">Delete</button>' : ''}
    </div>
  `;
  return div;
}

// Handle adding new skill (Admin only)
function handleAddSkill() {
  if (!isAdmin) {
    console.warn('Unauthorized action attempted');
    return;
  }
  console.log('Add skill functionality available for authenticated users');
}

// Edit skill (Admin only)
function editSkill(skillId) {
  if (!isAdmin) {
    console.warn('Unauthorized action attempted');
    return;
  }
  console.log('Editing skill:', skillId);
}

// Delete skill (Admin only)
function deleteSkill(skillId) {
  if (!isAdmin) {
    console.warn('Unauthorized action attempted');
    return;
  }
  console.log('Deleting skill:', skillId);
}

// Update UI based on admin status
function updateUIState() {
  const editButtons = document.querySelectorAll('.btn-edit, .btn-delete');
  editButtons.forEach(btn => {
    btn.style.display = isAdmin ? 'inline-block' : 'none';
  });
}

// Escape HTML to prevent XSS
function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Logout function
function logout() {
  isAdmin = false;
  sessionStorage.removeItem('isAdmin');
  updateUIState();
  console.log('Logged out successfully');
}

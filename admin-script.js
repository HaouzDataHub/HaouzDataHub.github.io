// ============================================================
// ADMIN PANEL JAVASCRIPT - Enhanced Admin Control System
// ============================================================
// Secure password-based admin authentication with modal functionality
// Manages skills CRUD operations with proper data persistence

const CORRECT_PASSWORD = 'admin2024';
let isAdminLoggedIn = false;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const passwordInput = document.getElementById('adminPassword');
const skillsList = document.getElementById('skillsList');
const addNewSkillBtn = document.getElementById('addNewSkillBtn');

// Keyboard shortcut support for admin access
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      passwordInput.focus();
      passwordInput.placeholder = '🔓 Shortcut detected! Enter password...';
    }
  }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedSession = sessionStorage.getItem('adminLoggedIn');
  if (savedSession === 'true') {
    isAdminLoggedIn = true;
    showAdminPanel();
  }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const password = passwordInput.value.trim();
  
  if (password === CORRECT_PASSWORD) {
    isAdminLoggedIn = true;
    sessionStorage.setItem('adminLoggedIn', 'true');
    passwordInput.value = '';
    showAdminPanel();
    alert('✅ Successfully logged in!');
  } else {
    alert('❌ Incorrect password!');
    passwordInput.value = '';
    passwordInput.focus();
  }
});

// Show admin panel and hide login
function showAdminPanel() {
  loginSection.style.display = 'none';
  adminPanel.style.display = 'block';
  loadSkillsList();
}

// Show login and hide admin panel
function hideAdminPanel() {
  loginSection.style.display = 'block';
  adminPanel.style.display = 'none';
}

// Handle logout
logoutBtn.addEventListener('click', () => {
  isAdminLoggedIn = false;
  sessionStorage.removeItem('adminLoggedIn');
  hideAdminPanel();
  alert('✅ Logged out successfully!');
});

// Load and display skills list
function loadSkillsList() {
  const skills = JSON.parse(localStorage.getItem('skillsPosts')) || getDefaultSkills();
  
  skillsList.innerHTML = skills.map(skill => `
    <div class="skill-item">
      <h4>${skill.title || 'Untitled'}</h4>
      <p class="category-badge">${skill.category || 'Unknown'}</p>
      <p>${skill.description || 'No description'}</p>
      <button class="btn-edit" onclick="editSkill(${skill.id})">✏️ Edit</button>
      <button class="btn-delete" onclick="deleteSkill(${skill.id})">🗑️ Delete</button>
    </div>
  `).join('');
}

// Get default skills
function getDefaultSkills() {
  return [
    {
      id: 1,
      title: 'SQL JOIN - Basic Syntax',
      category: 'sql',
      description: 'Learn how to perform INNER JOINs',
      code: ''
    },
    {
      id: 2,
      title: 'Python Data Cleaning',
      category: 'python',
      description: 'Master data cleaning techniques',
      code: ''
    },
    {
      id: 3,
      title: 'R Data Visualization',
      category: 'r',
      description: 'Create beautiful visualizations',
      code: ''
    }
  ];
}

// Edit skill - Navigate to skills page with ID in URL
function editSkill(skillId) {
  const skills = JSON.parse(localStorage.getItem('skillsPosts')) || getDefaultSkills();
  const skill = skills.find(s => s.id === skillId);
  
  if (skill) {
    // Store the skill to edit in sessionStorage
    sessionStorage.setItem('editingSkill', JSON.stringify(skill));
    // Redirect to skills page
    window.location.href = 'skills.html?action=edit&id=' + skillId;
  }
}

// Delete skill
function deleteSkill(skillId) {
  if (confirm('❌ Are you sure you want to delete this skill?')) {
    let skills = JSON.parse(localStorage.getItem('skillsPosts')) || getDefaultSkills();
    skills = skills.filter(s => s.id !== skillId);
    localStorage.setItem('skillsPosts', JSON.stringify(skills));
    loadSkillsList();
    alert('✅ Skill deleted successfully!');
  }
}

// Add new skill button handler
addNewSkillBtn.addEventListener('click', () => {
  // Clear any previous edit data
  sessionStorage.removeItem('editingSkill');
  // Redirect to skills page for adding new skill
  window.location.href = 'skills.html?action=add';
});

// Admin Panel JavaScript - Password-protected admin control panel

const CORRECT_PASSWORD = 'admin2024';
let isAdminLoggedIn = false;

const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const passwordInput = document.getElementById('adminPassword');

// Initialize: Check if user is already logged in
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
    const skillsList = document.getElementById('skillsList');
    const skills = JSON.parse(localStorage.getItem('skillsPosts')) || getDefaultSkills();
    
    skillsList.innerHTML = skills.map(skill => `
        <div class="skill-item">
            <h4>${skill.title}</h4>
            <p class="category-badge">${skill.category}</p>
            <p>${skill.description || 'No description'}</p>
            <button class="btn-edit" onclick="editSkill(${skill.id})">Edit</button>
            <button class="btn-delete" onclick="deleteSkill(${skill.id})">Delete</button>
        </div>
    `).join('');
}

// Get default skills (same as in skills-script.js)
function getDefaultSkills() {
    return [
        {
            id: 1,
            title: 'SQL JOIN - Basic Syntax',
            category: 'SQL',
            description: 'Learn how to perform INNER JOINs'
        },
        {
            id: 2,
            title: 'Python Data Cleaning',
            category: 'Python',
            description: 'Master data cleaning techniques'
        },
        {
            id: 3,
            title: 'R Data Visualization',
            category: 'R',
            description: 'Create beautiful visualizations'
        }
    ];
}

// Edit skill (simplified)
function editSkill(skillId) {
    alert('Edit functionality would redirect to skills.html in a full implementation');
    window.location.href = 'skills.html';
}

// Delete skill
function deleteSkill(skillId) {
    if (confirm('Are you sure you want to delete this skill?')) {
        let skills = JSON.parse(localStorage.getItem('skillsPosts')) || getDefaultSkills();
        skills = skills.filter(s => s.id !== skillId);
        localStorage.setItem('skillsPosts', JSON.stringify(skills));
        loadSkillsList();
        alert('✅ Skill deleted successfully!');
    }
}

// Add new skill button handler
document.getElementById('addNewSkillBtn').addEventListener('click', () => {
    alert('Add skill functionality would open a modal in a full implementation');
    window.location.href = 'skills.html';
});

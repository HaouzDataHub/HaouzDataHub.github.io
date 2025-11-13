// Skills Page Script with GitHub Data Loading and Admin Authentication
// Author: HaouzDataHub
// Purpose: Load skills data from GitHub with centralized storage

const SKILLS_DATA_URL = 'https://raw.githubusercontent.com/HaouzDataHub/HaouzDataHub.github.io/main/skills-data.json';
const ADMIN_PASSWORD = 'admin123';

let skillsData = [];
let isAdmin = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Skills page loading...');
    await loadSkillsData();
    renderSkills();
    checkAdminStatus();
});

// Load skills data from GitHub or fallback to localStorage
async function loadSkillsData() {
    try {
        const response = await fetch(SKILLS_DATA_URL);
        if (response.ok) {
            skillsData = await response.json();
            console.log('Skills loaded from GitHub:', skillsData);
            // Save to localStorage as backup
            localStorage.setItem('skillsData', JSON.stringify(skillsData));
            return;
        }
    } catch (error) {
        console.error('Error loading from GitHub:', error);
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('skillsData');
    if (stored) {
        skillsData = JSON.parse(stored);
        console.log('Skills loaded from localStorage');
    } else {
        skillsData = [];
        console.log('No skills data found, starting with empty array');
    }
}

// Check if user is admin by looking at sessionStorage
function checkAdminStatus() {
    isAdmin = sessionStorage.getItem('skillsAdminAuth') === 'true';
    updateAdminUI();
}

// Update UI based on admin status
function updateAdminUI() {
    const addBtn = document.querySelector('.add-skill-btn');
    const editBtns = document.querySelectorAll('.edit-skill-btn');
    const deleteBtns = document.querySelectorAll('.delete-skill-btn');
    
    if (isAdmin) {
        if (addBtn) addBtn.style.display = 'inline-block';
        editBtns.forEach(btn => btn.style.display = 'inline-block');
        deleteBtns.forEach(btn => btn.style.display = 'inline-block');
    } else {
        if (addBtn) addBtn.style.display = 'none';
        editBtns.forEach(btn => btn.style.display = 'none');
        deleteBtns.forEach(btn => btn.style.display = 'none');
    }
}

// Prompt for admin password
function promptAdminPassword() {
    const password = prompt('Enter admin password:');
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('skillsAdminAuth', 'true');
        isAdmin = true;
        updateAdminUI();
        alert('Admin access granted!');
    } else if (password !== null) {
        alert('Incorrect password');
    }
}

// Logout admin
function logoutAdmin() {
    sessionStorage.removeItem('skillsAdminAuth');
    isAdmin = false;
    updateAdminUI();
    alert('Admin access revoked');
}

// Render skills cards
function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    
    container.innerHTML = '';
    
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
        <h3>${escapeHtml(skill.title)}</h3>
        ${skill.description ? `<p>${escapeHtml(skill.description)}</p>` : ''}
        ${skill.image ? `<img src="${skill.image}" alt="${skill.title}">` : ''}
        ${codeBlock}
        ${adminButtons}
    `;
    
    return card;
}

// Copy code to clipboard
function copyCode(index) {
    const code = skillsData[index].code;
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
        title,
        description: description || '',
        code: code || '',
        image: image || ''
    };
    
    skillsData.push(newSkill);
    saveSkillsData();
    renderSkills();
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
        title: title || skill.title,
        description: description || '',
        code: code || '',
        image: image || ''
    };
    
    saveSkillsData();
    renderSkills();
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
    }
}

// Save skills data to localStorage
function saveSkillsData() {
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    console.log('Skills data saved to localStorage');
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

console.log('Skills script loaded. Press Ctrl+Shift+A to toggle admin mode.');

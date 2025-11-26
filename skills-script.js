// ================================================
// SKILLS PAGE - DYNAMIC FUNCTIONALITY (UPDATED)
// ================================================

// ================================================
// ADMIN AUTHENTICATION - شرح عربي
// ================================================
const ADMIN_PASSWORD = 'admin123'; // نز مخزن لطاقة الربط

let isAdmin = false;

function checkAdminAccess() {
  const password = prompt('رجا أدخل كلمة المرور للدخول للوضع المسؤول');
  if (password === ADMIN_PASSWORD) {
    isAdmin = true;
    sessionStorage.setItem('isAdmin', 'true');
    alert('أهلا و سهلا بك في وضع المسئول !');
  } else {
    isAdmin = false;
    sessionStorage.removeItem('isAdmin');
    if (password !== null) {
      alert('كلمة مرور غير صحيحة');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('isAdmin') === 'true') {
    isAdmin = true;
  }
});

// ================================================
// DOM ELEMENT REFERENCES
// ================================================
const skillsContainer = document.getElementById('skillsContainer');
const skillForm = document.getElementById('skillForm');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillModal = document.getElementById('skillModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const filterButtons = document.querySelectorAll('[data-filter]');
const backToTopBtn = document.getElementById('backToTopBtn');

// ================================================
// GLOBAL STATE
// ================================================
let currentFilter = 'all';
let editingId = null;
let skillsData = [];

// ================================================
// LOAD SKILLS DATA FROM MANAGER OR FALLBACK
// ================================================
function loadSkills() {
  // Try to use skillsManager if available
  if (typeof skillsManager !== 'undefined' && skillsManager) {
    skillsData = skillsManager.getAllSkills();
    return skillsData;
  }
  
  // Fallback to localStorage with correct key
  const stored = localStorage.getItem('haouzDataHub_skills_v2');
  if (stored) {
    try {
      skillsData = JSON.parse(stored);
      return skillsData;
    } catch (e) {
      console.error('Error parsing skills data from localStorage:', e);
      skillsData = [];
    }
  }
  
  // If nothing found, check for default skills in window
  if (typeof defaultSkillsData !== 'undefined' && Array.isArray(defaultSkillsData)) {
    skillsData = defaultSkillsData.map(skill => ({ ...skill }));
    // Save defaults to localStorage
    localStorage.setItem('haouzDataHub_skills_v2', JSON.stringify(skillsData));
    return skillsData;
  }
  
  return [];
}

// ================================================
// SAVE SKILLS DATA
// ================================================
function saveSkills() {
  if (typeof skillsManager !== 'undefined' && skillsManager) {
    skillsManager.saveSkills(skillsData);
  } else {
    localStorage.setItem('haouzDataHub_skills_v2', JSON.stringify(skillsData));
  }
}

// ================================================
// RENDER SKILLS POSTS
// ================================================
function renderPosts(filter = 'all') {
  currentFilter = filter;
  
  if (!skillsContainer) return;
  
  // Ensure we have skills data
  if (!skillsData || skillsData.length === 0) {
    skillsData = loadSkills();
  }
  
  skillsContainer.innerHTML = '';
  
  let filteredSkills = filter === 'all' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === filter);
  
  if (filteredSkills.length === 0) {
    skillsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888;">No skills found in this category</p>';
    return;
  }
  
  filteredSkills.forEach(skill => {
    const skillCard = createSkillCard(skill);
    skillsContainer.appendChild(skillCard);
  });
}

// ================================================
// CREATE SKILL CARD HTML
// ================================================
function createSkillCard(skill) {
  const card = document.createElement('div');
  card.className = 'skill-card';
  card.id = 'skill-' + skill.id;
  
  let cardContent = `
    <div class="skill-card-inner">
      <div class="skill-image">
        <img src="${skill.image || 'images/skill-placeholder.png'}" alt="${skill.title}">
      </div>
      <h3>${skill.title}</h3>
      <p class="skill-description">${skill.description || ''}</p>
      <div class="skill-category"><span class="badge">${skill.category}</span></div>
  `;
  
  if (isAdmin) {
    cardContent += `
      <div class="skill-actions">
        <button class="edit-btn" onclick="editSkill('${skill.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteSkill('${skill.id}')">Delete</button>
      </div>
    `;
  }
  
  cardContent += `
    </div>
  `;
  
  card.innerHTML = cardContent;
  return card;
}

// ================================================
// EDIT SKILL
// ================================================
function editSkill(id) {
  const skill = skillsData.find(s => s.id === id);
  if (!skill) return;
  
  editingId = id;
  document.getElementById('skillTitle').value = skill.title;
  document.getElementById('skillCategory').value = skill.category;
  document.getElementById('skillDescription').value = skill.description || '';
  
  skillModal.style.display = 'flex';
  document.getElementById('skillTitle').focus();
}

// ================================================
// DELETE SKILL
// ================================================
function deleteSkill(id) {
  if (confirm('Are you sure you want to delete this skill?')) {
    skillsData = skillsData.filter(s => s.id !== id);
    saveSkills();
    renderPosts(currentFilter);
  }
}

// ================================================
// HANDLE FORM SUBMISSION
// ================================================
if (skillForm) {
  skillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('skillTitle').value.trim();
    const category = document.getElementById('skillCategory').value;
    const description = document.getElementById('skillDescription').value.trim();
    const imageFile = document.getElementById('skillImageFile').files[0];
    
    if (!title) {
      alert('Please enter a skill title');
      return;
    }
    
    if (editingId) {
      // Update existing skill
      const skill = skillsData.find(s => s.id === editingId);
      if (skill) {
        skill.title = title;
        skill.category = category;
        skill.description = description;
        if (imageFile) {
          const reader = new FileReader();
          reader.onload = (event) => {
            skill.image = event.target.result;
            saveSkills();
            renderPosts(currentFilter);
          };
          reader.readAsDataURL(imageFile);
        } else {
          saveSkills();
          renderPosts(currentFilter);
        }
      }
    } else {
      // Create new skill
      const newSkill = {
        id: 'skill_' + Date.now(),
        title,
        category,
        description,
        image: 'images/skill-placeholder.png'
      };
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newSkill.image = event.target.result;
          skillsData.push(newSkill);
          saveSkills();
          renderPosts(currentFilter);
        };
        reader.readAsDataURL(imageFile);
      } else {
        skillsData.push(newSkill);
        saveSkills();
        renderPosts(currentFilter);
      }
    }
    
    skillForm.reset();
    skillModal.style.display = 'none';
    editingId = null;
  });
}

// ================================================
// FILTER FUNCTIONALITY
// ================================================
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPosts(btn.getAttribute('data-filter'));
  });
});

// ================================================
// MODAL CONTROLS
// ================================================
if (addSkillBtn) {
  addSkillBtn.addEventListener('click', () => {
    editingId = null;
    skillForm.reset();
    document.getElementById('skillImageFile').value = '';
    skillModal.style.display = 'flex';
    document.getElementById('skillTitle').focus();
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    editingId = null;
    skillModal.style.display = 'none';
  });
}

if (skillModal) {
  skillModal.addEventListener('click', (e) => {
    if (e.target === skillModal) {
      editingId = null;
      skillModal.style.display = 'none';
    }
  });
}

// ================================================
// BACK TO TOP
// ================================================
window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

// ================================================
// INITIALIZE ON PAGE LOAD
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  // Wait for skillsManager to load if it exists
  setTimeout(() => {
    // Load skills data
    skillsData = loadSkills();
    
    // Render initial view
    renderPosts(currentFilter);
    
    // Set 'All' button as active
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
  }, 100);
});

// Console feedback
console.log('skills-script.js loaded successfully');
console.log('Using skillsManager:', typeof skillsManager !== 'undefined' ? 'YES' : 'NO');
console.log('Initial skills loaded:', skillsData.length);

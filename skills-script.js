// ================================================
// SKILLS PAGE - DYNAMIC FUNCTIONALITY (UPDATED)
// ================================================

// ADMIN AUTHENTICATION - يرجى تغيير كلمة المرور من البداية
// ================================================
// تحذير أمني: يجب تغيير كلمة المرور إلى كلمة قوية آمنة
// نموذج كلمة قوية: MyP@ssw0rd!Secure2024 (أرقام + رموز + أحرف كبيرة)
const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // SHA256 hash for 'admin'
// إذا أردت تغيير كلمة المرور، احسبها من هنا: https://www.sha256online.com/
let isAdmin = false;
let adminAttempts = 0;
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 300000; // 5 دقائق
let isLockedOut = false;

function simpleHash(str) {
  // بسيطة: إذا كنت تستخدم كلمة مرور معقدة، استخدم نسخة مشفرة بدلاً من الواضح
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

function checkAdminAccess() {
  if (isLockedOut) {
    alert('حسابك مغلق مؤقتاً بسبب محاولات تسجيل دخول خاطئة. يرجى المحاولة بعد 5 دقائق.');
    return;
  }
  
  if (isAdmin) {
    alert('أنت بالفعل مسجل دخول كمسؤول');
    return;
  }
  
  const password = prompt('أدخل كلمة المرور للوصول إلى صلاحيات التعديل والحذف:');
  
  if (password === null) return; // المستخدم ألغى العملية
  
  // استخدم كلمة المرور مباشرة أو hash بناءً على احتياجاتك
  const isCorrect = password === 'admin' || simpleHash(password) === ADMIN_PASSWORD_HASH;
  
  if (isCorrect) {
    isAdmin = true;
    adminAttempts = 0;
    sessionStorage.setItem('isAdmin', 'true');
    sessionStorage.setItem('adminLoginTime', Date.now());
    showEditDeleteButtons();
    showAddButton();
    alert('✅ تم تسجيل الدخول بنجاح! يمكنك الآن تعديل وحذف الأكواد.');
  } else {
    adminAttempts++;
    if (adminAttempts >= MAX_ATTEMPTS) {
      isLockedOut = true;
      alert('❌ لقد حاولت 3 مرات خاطئة. سيتم قفل الحساب لمدة 5 دقائق.');
      setTimeout(() => {
        isLockedOut = false;
        adminAttempts = 0;
      }, LOCKOUT_TIME);
    } else {
      alert(`❌ كلمة المرور غير صحيحة! محاولات متبقية: ${MAX_ATTEMPTS - adminAttempts}`);
    }
  }
}

function logoutAdmin() {
  isAdmin = false;
  adminAttempts = 0;
  sessionStorage.removeItem('isAdmin');
  sessionStorage.removeItem('adminLoginTime');
  hideEditDeleteButtons();
  hideAddButton();
  alert('تم تسجيل الخروج بنجاح!');
}

function showEditDeleteButtons() {
  const editBtns = document.querySelectorAll('.btn-edit');
  const deleteBtns = document.querySelectorAll('.btn-delete');
  editBtns.forEach(btn => btn.style.display = 'inline-flex');
  deleteBtns.forEach(btn => btn.style.display = 'inline-flex');
}

function hideEditDeleteButtons() {
  const editBtns = document.querySelectorAll('.btn-edit');
  const deleteBtns = document.querySelectorAll('.btn-delete');
  editBtns.forEach(btn => btn.style.display = 'none');
  deleteBtns.forEach(btn => btn.style.display = 'none');
}

function showAddButton() {
  const addBtn = document.getElementById('addSkillBtn');
  if (addBtn) addBtn.style.display = 'inline-block';
}

function hideAddButton() {
  const addBtn = document.getElementById('addSkillBtn');
  if (addBtn) addBtn.style.display = 'none';
}

// التحقق من حالة المصادقة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('isAdmin') === 'true') {
    isAdmin = true;
    showEditDeleteButtons();
    showAddButton();
  } else {
    hideEditDeleteButtons();
    hideAddButton();
  }
})
// التحقق من حالة المصادقة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('isAdmin') === 'true') {
    isAdmin = true;
  }
});

// DOM Elements
const postsGrid = document.getElementById('postsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillModal = document.getElementById('skillModal');
const closeModalBtn = document.getElementById('closeModal');
const skillForm = document.getElementById('skillForm');
const backToTopBtn = document.getElementById('backToTop');

let currentFilter = 'all';
let currentDetailId = null;
let editingId = null;

// ================================================
// DETAIL VIEW MODAL
// ================================================
function createDetailModal(skillId) {
    const skills = loadSkills();
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;

    const detailHTML = `
        <div class="modal" id="detailModal" style="display: flex;">
            <div class="modal-content" style="max-width: 90%; max-height: 90vh; overflow-y: auto;">
                <button class="modal-close" onclick="closeDetailModal()">×</button>
                <div style="padding: 2rem;">
                    ${skill.image ? `<img src="${skill.image}" alt="${skill.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;">` : ''}
                    <span class="skill-category" style="display: inline-block; margin-bottom: 1rem;">${skill.category}</span>
                    <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: var(--font-serif);">${skill.title}</h2>
                    ${skill.description ? `<p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.8;">${skill.description}</p>` : ''}
                    <h3 style="margin-bottom: 1rem; margin-top: 2rem;">Code/Example:</h3>
                    <pre class="skill-code" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; white-space: pre-wrap; word-wrap: break-word;"><code>${escapeHtml(skill.code)}</code></pre>
                    <button class="btn-copy" onclick="copyCode('${skill.id}')" style="width: 100%; padding: 0.75rem; margin-bottom: 0.5rem;">📋 Copy Code</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('detailModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', detailHTML);
    currentDetailId = skillId;
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.remove();
    currentDetailId = null;
}

function viewDetailModal(skillId) {
    createDetailModal(skillId);
}

// ================================================
// EDIT FUNCTIONALITY
// ================================================
function editSkill(skillId) {
      if (!isAdmin) {
              checkAdminAccess();
              if (!isAdmin) {
                        alert('لا يمكنك تعديل بدون كلمة مرور');
                        return;
                      }
            }
    const skills = loadSkills();
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;

    // Fill form with skill data
    document.getElementById('skillTitle').value = skill.title;
    document.getElementById('skillCategory').value = skill.category;
    document.getElementById('skillCode').value = skill.code;
    document.getElementById('skillDescription').value = skill.description || '';
    document.getElementById('skillImage').value = skill.image || '';
    
    editingId = skillId;
    skillModal.style.display = 'flex';
    skillModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('skillTitle').focus();
}

// ================================================
// DELETE FUNCTIONALITY (FIXED)
// ================================================
function deleteSkillPost(skillId) {
      if (!isAdmin) {
              checkAdminAccess();
              if (!isAdmin) {
                        alert('لا يمكنك حذف بدون كلمة مرور');
                        return;
                      }
            }
    if (confirm('Are you sure you want to delete this skill post? This action cannot be undone.')) {
        deleteSkill(skillId);
    }
}

function deleteSkill(skillId) {
    let skills = loadSkills();
    skills = skills.filter(s => s.id != skillId);
    localStorage.setItem('skillsPosts', JSON.stringify(skills));
    
    // Remove card from DOM
    const card = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (card) {
        card.remove();
    }
    
    renderPosts(currentFilter);
}

// ================================================
// LOAD AND SAVE SKILLS
// ================================================
function loadSkills() {
    const stored = localStorage.getItem('skillsPosts');
    return stored ? JSON.parse(stored) : [];
}

function saveSkills(skills) {
    localStorage.setItem('skillsPosts', JSON.stringify(skills));
}

// ================================================
// RENDER POSTS
// ================================================
function renderPosts(filter = 'all') {
    currentFilter = filter;
    const skills = loadSkills();
    const filtered = filter === 'all' ? skills : skills.filter(s => s.category.toLowerCase() === filter.toLowerCase());

    postsGrid.innerHTML = filtered.map(skill => `
        <div class="skill-post" data-skill-id="${skill.id}">
            ${skill.image ? `<img src="${skill.image}" alt="${skill.title}" class="skill-image">` : '<div class="skill-image" style="background: linear-gradient(135deg, #1a2e4e 0%, #0f172a 100%);"></div>'}
            <div class="skill-body">
                <span class="skill-category">${skill.category}</span>
                <h3 class="skill-title">${skill.title}</h3>
                <p class="skill-description">${skill.description || ''}</p>
                <pre class="skill-code"><code>${escapeHtml(skill.code.substring(0, 200))}...</code></pre>
            </div>
            <div class="skill-actions">
                <button class="btn-view" onclick="viewDetailModal('${skill.id}')" title="View Details">👁️ View</button>
                <button class="btn-copy" onclick="copyCode('${skill.id}')" title="Copy Code">📋 Copy</button>
                <button class="btn-edit" onclick="editSkill('${skill.id}')" title="Edit Post">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteSkillPost('${skill.id}')" title="Delete Post">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// ================================================
// COPY CODE FUNCTIONALITY
// ================================================
function copyCode(skillId) {
    const skills = loadSkills();
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;

    navigator.clipboard.writeText(skill.code).then(() => {
        alert('Code copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy code');
    });
}

// ================================================
// ESCAPE HTML
// ================================================
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

// ================================================
// FORM SUBMISSION
// ================================================
skillForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('skillTitle').value.trim();
    const category = document.getElementById('skillCategory').value;
    const code = document.getElementById('skillCode').value.trim();
    const description = document.getElementById('skillDescription').value.trim();
    const imageUrl = document.getElementById('skillImage').value.trim();
    const imageFile = document.getElementById('skillImageFile').files[0];

    if (!title || !category || !code) {
        alert('Please fill in all required fields (Title, Category, Code)');
        return;
    }

    let imageData = imageUrl;
    
    // If file is selected, convert to base64
    if (imageFile) {
        imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
    }

    const skills = loadSkills();
    
    if (editingId) {
        // Update existing skill
        const index = skills.findIndex(s => s.id == editingId);
        if (index !== -1) {
            skills[index] = {
                id: editingId,
                title,
                category,
                code,
                description,
                image: imageData
            };
        }
        editingId = null;
    } else {
        // Add new skill
        const newSkill = {
            id: Date.now(),
            title,
            category,
            code,
            description,
            image: imageData
        };
        skills.push(newSkill);
    }

    saveSkills(skills);
    skillForm.reset();
    document.getElementById('skillImageFile').value = '';
    skillModal.style.display = 'none';
    renderPosts(currentFilter);
});

// ================================================
// FILTER FUNCTIONALITY
// ================================================
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderPosts(filter);
    });
});

// ================================================
// MODAL CONTROLS
// ================================================
addSkillBtn.addEventListener('click', () => {
    editingId = null;
    skillForm.reset();
    document.getElementById('skillImageFile').value = '';
    skillModal.style.display = 'flex';
    document.getElementById('skillTitle').focus();
});

closeModalBtn.addEventListener('click', () => {
    editingId = null;
    skillModal.style.display = 'none';
});

skillModal.addEventListener('click', (e) => {
    if (e.target === skillModal) {
        editingId = null;
        skillModal.style.display = 'none';
    }
});

// ================================================
// BACK TO TOP BUTTON
// ================================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================================================
// INITIALIZE
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    renderPosts(currentFilter);
    
    // Set 'All' button as active by default
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
});

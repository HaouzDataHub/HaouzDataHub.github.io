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

// ================================================
// GITHUB JSON SKILLS DATA CACHE
// ================================================
let cachedSkills = null;
const GITHUB_SKILLS_URL = 'https://raw.githubusercontent.com/HaouzDataHub/HaouzDataHub.github.io/main/skills-data.json';

// تحميل بيانات المهارات من GitHub بشكل غير متزامن
async function initializeSkillsFromGitHub() {
  try {
    const response = await fetch(GITHUB_SKILLS_URL);
    if (response.ok) {
      const githubSkills = await response.json();
      const userSkills = localStorage.getItem('skillsPosts') ? JSON.parse(localStorage.getItem('skillsPosts')) : [];
      
      // تصفية المهارات المضافة من قبل المستخدم (غير البيانات الافتراضية)
      const userAddedSkills = userSkills.filter(s => ![1, 2, 3].includes(s.id));
      
      // دمج بيانات GitHub مع مهارات المستخدم
      cachedSkills = [...githubSkills, ...userAddedSkills];
    } else {
      throw new Error('فشل تحميل البيانات من GitHub');
    }
  } catch (error) {
    console.warn('خطأ في تحميل بيانات GitHub، استخدام localStorage:', error);
    // إذا فشل التحميل من GitHub، استخدم localStorage أو البيانات الافتراضية
    cachedSkills = localStorage.getItem('skillsPosts') ? JSON.parse(localStorage.getItem('skillsPosts')) : getDefaultSkills();
  }
}

// دالة البيانات الافتراضية
function getDefaultSkills() {
  return [
    {
      id: 1,
      title: 'SQL JOIN - Basic Syntax',
      category: 'SQL',
      description: 'Learn how to perform INNER JOINs to combine data from multiple tables efficiently.',
      code: 'SELECT a.*, b.column_name\nFROM table_a a\nINNER JOIN table_b b\nON a.id = b.id\nWHERE a.date > "2024-01-01"\nORDER BY a.created_at DESC;'
    },
    {
      id: 2,
      title: 'SQL GROUP BY & AGGREGATE',
      category: 'SQL',
      description: 'Master GROUP BY clauses with aggregate functions to summarize data by categories.',
      code: 'SELECT\n  category,\n  COUNT(*) as total_count,\n  AVG(amount) as average_amount,\n  MAX(amount) as max_amount\nFROM sales\nGROUP BY category\nHAVING COUNT(*) > 10'
    },
    {
      id: 3,
      title: 'SQL Window Functions',
      category: 'SQL',
      description: 'Advanced SQL using window functions like ROW_NUMBER() and AVG() for complex queries.',
      code: 'SELECT\n  id,\n  name,\n  salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank,\n  AVG(salary) OVER (PARTITION BY department) as dept_avg'
    }
  ];
}


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
  editBtns.forEach(btn => btn.style.cssText = 'display: inline-flex !important');
  deleteBtns.forEach(btn => btn.style.cssText = 'display: inline-flex !important');
}

function hideEditDeleteButtons() {
  const editBtns = document.querySelectorAll('.btn-edit');
  const deleteBtns = document.querySelectorAll('.btn-delete');
  editBtns.forEach(btn => btn.style.cssText = 'display: none !important');
  deleteBtns.forEach(btn => btn.style.cssText = 'display: none !important');
}

function showAddButton() {
  const addBtn = document.getElementById('addSkillBtn');
  if (addBtn) addBtn.style.cssText = 'display: inline-block !important';
}

function hideAddButton() {
  const addBtn = document.getElementById('addSkillBtn');
  if (addBtn) addBtn.style.cssText = 'display: none !important';
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
 return cachedSkills || getDefaultSkills();


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
        backToTopBtn.style.cssText = 'display: none !important';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================================================
// INITIALIZE
// ================================================
document.addEventListener('DOMContentLoaded', () => {
   // تحميل بيانات المهارات من GitHub
  initializeSkillsFromGitHub().then(() => {
    renderPosts(currentFilter);
  }).catch(() => {
    // إذا فشل التحميل، استخدم البيانات المتاحة
    renderPosts(currentFilter);
  });ilter);
    
    // Set 'All' button as active by default
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
});


// ================================================
// SECRET ADMIN ACCESS - اختصار لوحة المفاتيح السري
// ================================================
// اضغط: Ctrl+Shift+A لفتح نافذة تسجيل الدخول
let secretKeySequence = [];
const SECRET_KEYS = ['Control', 'Shift', 'KeyA'];

document.addEventListener('keydown', (e) => {
  // بناء تسلسل المفاتيح
  const keyCode = e.code || e.key;
  const currentKey = e.ctrlKey ? 'Control' : e.shiftKey ? 'Shift' : keyCode;
  
  secretKeySequence.push(currentKey);
  
  // احتفظ بآخر 3 مفاتيح فقط
  if (secretKeySequence.length > 3) {
    secretKeySequence.shift();
  }
  
  // تحقق من التسلسل: Ctrl + Shift + A
  if (e.ctrlKey && e.shiftKey && (e.code === 'KeyA' || e.key === 'a')) {
    e.preventDefault();
    checkAdminAccess();
    secretKeySequence = [];
  }
});

// ================================================
// ALTERNATIVE: HIDDEN ADMIN PANEL LINK
// ================================================
// رابط مخفي يمكن الضغط عليه لفتح نافذة الدخول
const createHiddenAdminPanel = () => {
  const adminPanel = document.createElement('div');
  adminPanel.id = 'hiddenAdminPanel';
  adminPanel.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    width: 40px;
    height: 40px;
    background: rgba(56, 189, 248, 0.1);
    border: 2px solid rgba(56, 189, 248, 0.3);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    z-index: 999;
    transition: all 0.3s ease;
    opacity: 0;
    pointer-events: none;
  `;
  
  adminPanel.innerHTML = '⚙️';
  adminPanel.title = 'Admin Panel (Ctrl+Shift+A)';
  
  adminPanel.addEventListener('mouseenter', function() {
    this.style.background = 'rgba(56, 189, 248, 0.2)';
    this.style.borderColor = 'rgba(56, 189, 248, 0.6)';
  });
  
  adminPanel.addEventListener('mouseleave', function() {
    this.style.background = 'rgba(56, 189, 248, 0.1)';
    this.style.borderColor = 'rgba(56, 189, 248, 0.3)';
  });
  
  adminPanel.addEventListener('click', checkAdminAccess);
  
  // أظهر الزر فقط عند تحميل الصفحة (للمسؤول القديم)
  if (sessionStorage.getItem('isAdmin') === 'true') {
    adminPanel.style.opacity = '1';
    adminPanel.style.pointerEvents = 'auto';
  }
  
  document.body.appendChild(adminPanel);
};

// اُستدعي هذه الدالة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', createHiddenAdminPanel);

// عند تسجيل الدخول بنجاح، أظهر الزر المخفي
const originalShowButtons = showEditDeleteButtons;
window.showEditDeleteButtons = function() {
  const adminPanel = document.getElementById('hiddenAdminPanel');
  if (adminPanel) {
    adminPanel.style.opacity = '1';
    adminPanel.style.pointerEvents = 'auto';
  }
  originalShowButtons();
};

// عند تسجيل الخروج، أخفِ الزر المخفي
const originalHideButtons = hideEditDeleteButtons;
window.hideEditDeleteButtons = function() {
  const adminPanel = document.getElementById('hiddenAdminPanel');
  if (adminPanel) {
    adminPanel.style.opacity = '0';
    adminPanel.style.pointerEvents = 'none';
  }
  originalHideButtons();
}

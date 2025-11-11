// ================================================
// SKILLS PAGE - DYNAMIC FUNCTIONALITY (UPDATED)
// ================================================

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
                <button class="modal-close" onclick="closeDetailModal()">&times;</button>
                <div style="padding: 2rem;">
                    ${skill.image ? `<img src="${skill.image}" alt="${skill.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;">` : ''}
                    <span class="skill-category" style="display: inline-block; margin-bottom: 1rem;">${skill.category}</span>
                    <h2 style="font-size: 2rem; margin-bottom: 1rem; font-family: var(--font-serif);">${skill.title}</h2>
                    ${skill.description ? `<p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.8;">${skill.description}</p>` : ''}
                    <h3 style="margin-bottom: 1rem; margin-top: 2rem;">الكود / الصيغة:</h3>
                    <pre class="skill-code" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; white-space: pre-wrap; word-wrap: break-word;"><code>${escapeHtml(skill.code)}</code></pre>
                    <button class="btn-copy" onclick="copyCode('${skill.id}')" style="width: 100%; padding: 0.75rem;">📋 انسخ الكود</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', detailHTML);
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.remove();
}

// ================================================
// RENDER SKILLS POSTS WITH FIXED HEIGHTS
// ================================================
function renderPosts(category = 'all') {
    const posts = filterSkillsByCategory(category);
    
    if (posts.length === 0) {
        postsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3>لا توجد مهارات</h3>
                <p>حاول اختيار فئة مختلفة أو أضف منشور مهارة أول!</p>
            </div>
        `;
        return;
    }
    
    postsGrid.innerHTML = posts.map(post => `
        <article class="skill-post" data-id="${post.id}" style="height: 500px; display: flex; flex-direction: column;">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="skill-image" style="height: 180px; object-fit: cover;">` : '<div class="skill-image" style="height: 180px; background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 1.5rem; font-weight: bold;">${post.category.toUpperCase()}</span></div>'}
            <div class="skill-body" style="flex: 1; overflow: hidden; display: flex; flex-direction: column;">
                <span class="skill-category" style="margin-bottom: 0.5rem;">${post.category}</span>
                <h3 class="skill-title" style="font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${post.title}</h3>
                ${post.description ? `<p class="skill-description" style="font-size: 0.875rem; margin-bottom: 0.75rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${post.description}</p>` : ''}
                <pre class="skill-code" style="flex: 1; font-size: 0.75rem; overflow: hidden; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"><code>${escapeHtml(post.code)}</code></pre>
                <div class="skill-actions" style="display: flex; gap: 0.5rem; margin-top: auto;">
                    <button class="btn-copy" onclick="viewDetailModal('${post.id}')" style="flex: 1; padding: 0.6rem 0.75rem; font-size: 0.85rem;">👁️ اضغط لترى</button>
                    <button class="btn-copy" onclick="copyCode('${post.id}')" style="flex: 1; padding: 0.6rem 0.75rem; font-size: 0.85rem;">📋 انسخ</button>
                    <button class="btn-copy" onclick="deleteSkillPost('${post.id}')" style="flex: 1; padding: 0.6rem 0.75rem; font-size: 0.85rem;">🗑️ حذف</button>
                </div>
            </div>
        </article>
    `).join('');
}

function viewDetailModal(skillId) {
    createDetailModal(skillId);
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDetailModal();
        });
    }
}

// ================================================
// FILTER FUNCTIONALITY
// ================================================
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderPosts(currentFilter);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    });
});

// ================================================
// MODAL MANAGEMENT
// ================================================
const addSkillBtnEl = document.getElementById('addSkillBtn');
if (addSkillBtnEl) {
    addSkillBtnEl.addEventListener('click', () => {
        skillModal.classList.add('show');
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        skillModal.classList.remove('show');
    });
}

if (skillModal) {
    skillModal.addEventListener('click', (e) => {
        if (e.target === skillModal) {
            skillModal.classList.remove('show');
        }
    });
}

// ================================================
// FORM SUBMISSION - FIXED DELETE
// ================================================
if (skillForm) {
    skillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Handle image upload
        const imageInput = document.getElementById('skillImage');
        let imageData = imageInput.value;
        
        // Check if file is uploaded
        const fileInput = document.getElementById('skillImageFile');
        if (fileInput && fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imageData = event.target.result;
                submitSkill(imageData);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            submitSkill(imageData);
        }
    });
}

function submitSkill(imageData) {
    const newSkill = {
        id: Date.now(),
        title: document.getElementById('skillTitle').value,
        category: document.getElementById('skillCategory').value,
        code: document.getElementById('skillCode').value,
        description: document.getElementById('skillDescription').value,
        image: imageData || ''
    };
    
    if (!newSkill.title || !newSkill.category || !newSkill.code) {
        alert('يرجى ملء جميع الحقول المطلوبة!');
        return;
    }
    
    const updatedSkills = addSkill(newSkill);
    
    skillForm.reset();
    skillModal.classList.remove('show');
    
    currentFilter = 'all';
    filterButtons.forEach(b => b.classList.remove('active'));
    filterButtons[0].classList.add('active');
    renderPosts('all');
    
    alert('تم إضافة منشور المهارة بنجاح!');
}

// ================================================
// COPY TO CLIPBOARD
// ================================================
function copyCode(skillId) {
    const skills = loadSkills();
    const skill = skills.find(s => s.id == skillId);
    
    if (skill) {
        navigator.clipboard.writeText(skill.code).then(() => {
            const btn = document.querySelector(`[data-id="${skillId}"] .btn-copy:nth-of-type(2)`);
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '✅ تم النسخ!';
                btn.classList.add('copied');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            }
        }).catch(() => {
            alert('فشل نسخ الكود');
        });
    }
}

// ================================================
// DELETE SKILL POST - PROPERLY SAVES
// ================================================
function deleteSkillPost(skillId) {
    if (confirm('هل تريد حقاً حذف هذا المنشور?')) {
        // Delete from storage
        deleteSkill(skillId);
        // Re-render immediately
        renderPosts(currentFilter);
        alert('تم حذف منشور المهارة!');
    }
}

// ================================================
// UTILITY FUNCTIONS
// ================================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

// ================================================
// INITIALIZE PAGE
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    renderPosts('all');
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        skillModal.classList.remove('show');
        closeDetailModal();
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        skillModal.classList.add('show');
    }
});

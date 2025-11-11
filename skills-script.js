// ================================================
// SKILLS PAGE - DYNAMIC FUNCTIONALITY
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

// ================================================
// RENDER SKILLS POSTS
// ================================================
function renderPosts(category = 'all') {
    const posts = filterSkillsByCategory(category);
    
    if (posts.length === 0) {
        postsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3>No skills found</h3>
                <p>Try selecting a different category or add your first skill post!</p>
            </div>
        `;
        return;
    }
    
    postsGrid.innerHTML = posts.map(post => `
        <article class="skill-post" data-id="${post.id}">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="skill-image">` : '<div class="skill-image" style="background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 2rem;">${post.category.toUpperCase()}</span></div>'}
            <div class="skill-body">
                <span class="skill-category">${post.category}</span>
                <h3 class="skill-title">${post.title}</h3>
                ${post.description ? `<p class="skill-description">${post.description}</p>` : ''}
                <pre class="skill-code"><code>${escapeHtml(post.code)}</code></pre>
                <div class="skill-actions">
                    <button class="btn-copy" onclick="copyCode('${post.id}')">📋 Copy Code</button>
                    <button class="btn-copy" onclick="deleteSkillPost('${post.id}')">🗑️ Delete</button>
                </div>
            </div>
        </article>
    `).join('');
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
addSkillBtn.addEventListener('click', () => {
    skillModal.classList.add('show');
});

closeModalBtn.addEventListener('click', () => {
    skillModal.classList.remove('show');
});

skillModal.addEventListener('click', (e) => {
    if (e.target === skillModal) {
        skillModal.classList.remove('show');
    }
});

// ================================================
// FORM SUBMISSION
// ================================================
skillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newSkill = {
        id: Date.now(),
        title: document.getElementById('skillTitle').value,
        category: document.getElementById('skillCategory').value,
        code: document.getElementById('skillCode').value,
        description: document.getElementById('skillDescription').value,
        image: document.getElementById('skillImage').value || ''
    };
    
    // Validate
    if (!newSkill.title || !newSkill.category || !newSkill.code) {
        alert('Please fill in all required fields!');
        return;
    }
    
    // Add skill to data
    const updatedSkills = addSkill(newSkill);
    
    // Reset form
    skillForm.reset();
    skillModal.classList.remove('show');
    
    // Re-render with 'all' filter
    currentFilter = 'all';
    filterButtons.forEach(b => b.classList.remove('active'));
    filterButtons[0].classList.add('active');
    renderPosts('all');
    
    // Show success message
    alert('Skill post added successfully!');
});

// ================================================
// COPY TO CLIPBOARD
// ================================================
function copyCode(skillId) {
    const skills = loadSkills();
    const skill = skills.find(s => s.id == skillId);
    
    if (skill) {
        navigator.clipboard.writeText(skill.code).then(() => {
            const btn = document.querySelector(`[data-id="${skillId}"] .btn-copy:first-of-type`);
            btn.textContent = '✅ Copied!';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.textContent = '📋 Copy Code';
                btn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            alert('Failed to copy code');
        });
    }
}

// ================================================
// DELETE SKILL POST
// ================================================
function deleteSkillPost(skillId) {
    if (confirm('Are you sure you want to delete this skill post?')) {
        const updatedSkills = deleteSkill(skillId);
        renderPosts(currentFilter);
        alert('Skill post deleted!');
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

// Back to Top Button
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

// ================================================
// INITIALIZE PAGE
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    renderPosts('all');
});

// Keyboard Shortcut: ESC to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        skillModal.classList.remove('show');
    }
});

// Keyboard Shortcut: Ctrl+Shift+N to add new post
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        skillModal.classList.add('show');
    }
});

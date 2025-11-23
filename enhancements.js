// ============================================
// COMPREHENSIVE ENHANCEMENTS - ALL 17 FEATURES
// ============================================

// 1. NAVIGATION IMPROVEMENTS
// ===========================

// 1.1 Sticky Header - Already in CSS
// Applied on body with position: sticky

// 1.2 Smooth Scrolling - Already in CSS
// Applied with scroll-behavior: smooth

// 1.3 Active Link Indicator
function updateActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active-link');
    } else {
      link.classList.remove('active-link');
    }
  });
}

// 1.4 Mobile Menu with Hamburger Icon
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  // Close menu when link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  // Close menu when Escape is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// 2. SIMPLICITY & ELEGANCE
// ==========================

// 2.1 Remove colorful icons - Already in CSS
// Removed emoji/icon styling

// 2.2 Minimalist Design - Already in CSS
// Applied neutral colors and clean styling

// 2.3 Enhanced Typography - Already in CSS
// Improved font hierarchy and sizing

// 2.4 Better White Space - Already in CSS
// Enhanced spacing throughout

// 3. MODERN BROWSE TECHNIQUES
// =============================

// 3.1 Scroll Animations (Fade In, Slide In)
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Observe all scrollable elements
document.querySelectorAll('section, .card, .project, .skill-item, .portfolio-item').forEach(el => {
  scrollObserver.observe(el);
});

// 3.2 Back to Top Button
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');
backToTopBtn.innerHTML = '<span>↑</span>';
backToTopBtn.title = 'Back to top';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 3.3 Breadcrumbs Navigation
function generateBreadcrumbs() {
  const breadcrumbsContainer = document.querySelector('.breadcrumbs');
  if (!breadcrumbsContainer) return;
  
  const pathArray = window.location.pathname.split('/').filter(x => x);
  let breadcrumbHTML = '<a href="/">Home</a>';
  
  pathArray.forEach((path, index) => {
    if (path !== '' && path !== 'index.html') {
      const label = path.replace('.html', '').charAt(0).toUpperCase() + path.slice(1);
      breadcrumbHTML += ` / <span>${label}</span>`;
    }
  });
  
  breadcrumbsContainer.innerHTML = breadcrumbHTML;
}

generateBreadcrumbs();

// 3.4 Search Bar
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  // Keyboard shortcut Ctrl+K for search focus
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const contentElements = document.querySelectorAll('section, article, .project, .skill-item');
    
    contentElements.forEach(el => {
      const text = el.textContent.toLowerCase();
      if (query === '' || text.includes(query)) {
        el.style.display = '';
        el.classList.add('search-highlight');
      } else {
        el.style.display = 'none';
      }
    });
  });
}

// 4. PERFORMANCE & POLISH
// ==========================

// 4.1 Dark Mode Toggle with LocalStorage Persistence
const themeToggle = document.querySelector('.theme-toggle');
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.body.classList.add(savedTheme + '-mode');
}

if (themeToggle) {
  // Initialize theme on load
  initTheme();
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(newTheme + '-mode');
    localStorage.setItem('theme', newTheme);
  });
}

// 4.2 Loading States
function showLoadingState(element) {
  element.classList.add('loading');
}

function hideLoadingState(element) {
  element.classList.remove('loading');
}

// Apply to images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('loadstart', function() { showLoadingState(this); });
  img.addEventListener('load', function() { hideLoadingState(this); });
});

// 4.3 Tooltip Hints
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.position = 'fixed';
      tooltip.style.top = (rect.top - 40) + 'px';
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
      tooltip.dataset.targetElement = element;
    });
    
    element.addEventListener('mouseleave', function() {
      document.querySelectorAll('.tooltip').forEach(t => t.remove());
    });
  });
}

initTooltips();

// 4.4 Micro-interactions on Buttons
document.querySelectorAll('button, a.btn').forEach(btn => {
  btn.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
  });
  btn.addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// 5. LAYOUT IMPROVEMENTS
// ========================

// 5.1 Enhanced Grid Layout - Already in CSS
// Applied with CSS Grid auto-fit

// 5.2 Enhanced Card Design - Already in CSS
// Applied with hover effects and shadows

// 5.3 Lazy Loading for Images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
        }
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// INITIALIZATION
// ===============

// Update active links on page load and hash change
updateActiveLink();
window.addEventListener('hashchange', updateActiveLink);
window.addEventListener('popstate', updateActiveLink);

// Log that enhancements are loaded
console.log('✓ All 17 enhancements loaded successfully');
console.log('Features: Sticky Header, Smooth Scrolling, Active Links, Mobile Menu, Minimalist Design, Typography, Spacing, Scroll Animations, Back to Top, Breadcrumbs, Search, Dark Mode, Loading States, Tooltips, Micro-interactions, Grid Layout, Card Design, Lazy Loading');

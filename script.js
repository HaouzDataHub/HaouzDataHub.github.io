// Navbar glow on scroll
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 6px 30px rgba(56,189,248,0.2)';
    navbar.style.borderColor = 'rgba(56,189,248,0.15)';
  } else {
    navbar.style.boxShadow = '0 10px 40px rgba(2,6,23,0.55)';
    navbar.style.borderColor = 'rgba(255,255,255,0.03)';
  }
});

// Smooth fade-in on scroll for sections
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver(function(entries, observer){
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));
// === BACK TO TOP BUTTON ===
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

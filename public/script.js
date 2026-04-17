// Update Footer Year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Typing Effect for Hero Section
const typingText = document.getElementById('typing-text');
const roles = [
    "Undergraduate Cyber Security Student",
    "Full-Stack Developer",
    "Flutter & Android Developer",
    "AI-Powered Project Builder"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newRoleDelay = 2000;

function type() {
    if (!typingText) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(type, erasingDelay);
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(type, typingDelay);
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(type, newRoleDelay);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, typingDelay);
    }
}

// Start typing effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typingText) setTimeout(type, 1000);
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinksItems = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Stop observing once revealed
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Active Nav Link on Scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact Form Validation
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (name.length < 2) {
            formStatus.textContent = 'Please enter a valid name.';
            formStatus.className = 'form-status error';
            return;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            formStatus.textContent = 'Please enter a valid email address.';
            formStatus.className = 'form-status error';
            return;
        }
        
        if (message.length < 10) {
            formStatus.textContent = 'Message must be at least 10 characters long.';
            formStatus.className = 'form-status error';
            return;
        }
        
        // Process actual API request
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
            
            if (data.success) {
                contactForm.reset();
                formStatus.textContent = 'Message sent successfully!';
                formStatus.className = 'form-status success';
            } else {
                formStatus.textContent = data.error || 'Failed to send message.';
                formStatus.className = 'form-status error';
            }
            
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        })
        .catch(err => {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
            formStatus.textContent = 'Network error. Please try again later.';
            formStatus.className = 'form-status error';
            
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        });
    });
}

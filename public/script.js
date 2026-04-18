// Dynamic Content State
let siteProfile = {
    name: 'Sehas Pathirana',
    typingRoles: ["Cyber Security Student", "Full-Stack Developer", "Flutter & Android Developer", "AR Platform Creator"],
    heroDesc: 'Motivated Cyber Security undergraduate with a passion for building secure and innovative solutions.',
    aboutMe: 'I am a motivated Cyber Security undergraduate with a proven track record in developing secure mobile and web applications.',
    socialLinks: { github: 'https://github.com/pathiranasehas676-creator', linkedin: 'https://linkedin.com' }
};

// Custom Cursor Glow Effect
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    if (cursorGlow) {
        // Smooth interpolation for "premium" feel
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursorGlow.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Update Footer Year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Typing Effect for Hero Section
const typingText = document.getElementById('typing-text');
let roles = siteProfile.typingRoles;

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100; // Faster typing for premium feel
let erasingDelay = 50;
let newRoleDelay = 2000;

function type() {
    if (!typingText || roles.length === 0) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = newRoleDelay;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// API Integration
async function initializeCMS() {
    try {
        // Fetch Profile
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();
        if (profileData.success) {
            const p = profileData.data;
            document.getElementById('hero-name').textContent = p.name;
            document.getElementById('hero-desc').textContent = p.heroDesc;
            document.getElementById('about-text').textContent = p.aboutMe || document.getElementById('about-text').textContent;
            document.getElementById('profile-location').textContent = p.location;
            document.getElementById('profile-email').textContent = p.email;
            document.getElementById('profile-email').href = `mailto:${p.email}`;
            
            const phoneEl = document.getElementById('profile-phone');
            if (phoneEl) {
                phoneEl.textContent = p.phone || phoneEl.textContent;
                phoneEl.href = `tel:${p.phone}`;
            }
            
            document.getElementById('github-link').href = p.socialLinks.github;
            document.getElementById('linkedin-link').href = p.socialLinks.linkedin;
            
            roles = p.typingRoles && p.typingRoles.length > 0 ? p.typingRoles : roles;
            // Restart typing if roles changed
            roleIndex = 0;
            charIndex = 0;
        }

        // Fetch Skills
        const skillsRes = await fetch('/api/skills');
        const skillsData = await skillsRes.json();
        if (skillsData.success) {
            renderSkills(skillsData.data);
        }

        // Fetch Projects
        const projectsRes = await fetch('/api/projects');
        const projectsData = await projectsRes.json();
        if (projectsData.success) {
            renderProjects(projectsData.data);
        }

        const eduRes = await fetch('/api/education');
        const eduData = await eduRes.json();
        if (eduData.success) renderEducation(eduData.data);

        // Final refresh after all content is ready
        refreshReveal();

    } catch (err) {
        console.error('CMS Initialization Failed:', err);
    }
}

function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    if (!grid || !skills.length) return;
    grid.innerHTML = '';
    
    const categories = [
        { name: 'Core Domains', icon: 'fa-microchip', color: '#00f2ff' },
        { name: 'Programming & Languages', icon: 'fa-code', color: '#60a5fa' },
        { name: 'Mobile Development', icon: 'fa-mobile-screen', color: '#a78bfa' },
        { name: 'Web & Frontend', icon: 'fa-laptop-code', color: '#34d399' },
        { name: 'Backend & Databases', icon: 'fa-server', color: '#fb923c' },
        { name: 'APIs & Integration', icon: 'fa-link', color: '#f87171' },
        { name: 'Tools & Platforms', icon: 'fa-screwdriver-wrench', color: '#94a3b8' },
        { name: 'Soft + Practical Skills', icon: 'fa-brain', color: '#fbbf24' }
    ];

    categories.forEach((cat, index) => {
        const catSkills = skills.filter(s => s.category === cat.name);
        if (catSkills.length === 0) return;

        const catDiv = document.createElement('div');
        catDiv.className = 'skill-category glass-card hover-glow reveal slide-up';
        catDiv.style.transitionDelay = `${index * 0.1}s`;
        catDiv.innerHTML = `
            <div class="skill-icon-wrapper">
                <i class="fa-solid ${cat.icon}" style="color: ${cat.color}"></i>
            </div>
            <h3>${cat.name}</h3>
            <div class="skill-tags">
                ${catSkills.map(s => `
                    <span class="skill-tag">
                        <i class="${s.icon || 'fa-solid fa-check'}" style="color: ${cat.color}; opacity: 0.7;"></i> 
                        ${s.name}
                    </span>
                `).join('')}
            </div>
        `;
        grid.appendChild(catDiv);
    });
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    if (projects.length === 0) {
        grid.innerHTML = '<p class="text-center">No projects hosted yet.</p>';
        return;
    }
    grid.innerHTML = '';
    
    projects.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'project-card reveal slide-up';
        card.style.transitionDelay = `${index * 0.15}s`;
        // Use DB provided gradient/icon or fallback
        const gradClass = p.gradient_class || `bg-gradient-${(index % 3) + 1}`;
        const iconClass = p.icon_class || 'fa-solid fa-code';
        const badgeText = p.badge_text || 'v1.0';
        
        card.innerHTML = `
            <div class="project-img-wrapper">
                <div class="project-placeholder ${gradClass}">
                    <i class="${iconClass}" style="font-size: 4rem; opacity: 0.4;"></i>
                </div>
                ${badgeText ? `<div class="dl-badge">${badgeText}</div>` : ''}
            </div>
            <div class="project-content">
                <div class="project-type">${p.category || 'Software Directive'}</div>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.description}</p>
                <div class="project-tech">
                    ${p.tech_stack ? p.tech_stack.map(tag => `<span class="tech-pill">${tag}</span>`).join('') : ''}
                </div>
                <div class="project-links">
                    ${p.github_url && p.github_url !== '#' ? `<a href="${p.github_url}" target="_blank" class="btn btn-primary btn-sm"><i class="fa-brands fa-github"></i> Source</a>` : ''}
                    ${p.demo_url && p.demo_url !== '#' ? `<a href="${p.demo_url}" target="_blank" class="btn btn-outline btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderExperience(exp) {
    const container = document.getElementById('experience-timeline');
    if (!container || !exp.length) return;
    container.innerHTML = '';
    exp.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'exp-item reveal slide-up';
        div.style.transitionDelay = `${index * 0.1}s`;
        div.innerHTML = `
            <div class="exp-card">
                <div class="exp-header">
                    <span class="exp-type">${item.type || 'Experience'}</span>
                    <h3 class="exp-title">${item.title}</h3>
                    <div class="exp-company">
                        <i class="fas fa-building"></i>
                        <span>${item.company}</span>
                        <span class="ms-auto text-dim" style="font-size: 0.9rem;">${item.period}</span>
                    </div>
                </div>
                <div class="exp-body">
                    <ul class="exp-list">
                        ${Array.isArray(item.description) ? item.description.map(d => `<li>${d}</li>`).join('') : `<li>${item.description}</li>`}
                    </ul>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderEducation(edu) {
    const container = document.getElementById('education-timeline');
    if (!container || !edu.length) return;
    container.innerHTML = '';
    edu.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'exp-item reveal slide-up';
        div.style.transitionDelay = `${index * 0.1}s`;
        div.innerHTML = `
            <div class="exp-card">
                <div class="exp-header">
                    <span class="exp-type">Education</span>
                    <h3 class="exp-title">${item.degree}</h3>
                    <div class="exp-company">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${item.institution}</span>
                        <span class="status-badge" style="margin-left: 1rem; font-size: 0.7rem; padding: 2px 8px; border: 1px solid var(--primary); border-radius: 4px; color: var(--primary);">${item.status}</span>
                    </div>
                    <p class="text-dim mt-2" style="font-size: 0.9rem;">${item.period}</p>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Magnetic Button Effect
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-icon, .btn-outline');
    
    magneticBtns.forEach(btn => {
        btn.classList.add('magnetic');
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Start typing effect and CMS load when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCMS().then(() => {
        if (typingText) setTimeout(type, 1000);
        
        // Initialize interactive effects after content is loaded
        initMagneticButtons();
        
        // Refresh intersection observer for new dynamic elements
        setTimeout(() => {
            refreshReveal();
        }, 500);
    });
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');
const navLinksItems = document.querySelectorAll('.nav-link');

function toggleMenu(isOpen) {
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active', isOpen);
        navMenu.classList.toggle('active', isOpen);
        if (navOverlay) navOverlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = !navMenu.classList.contains('active');
        toggleMenu(isOpen);
    });

    if (navOverlay) {
        navOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
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
const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

function refreshReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));
}

// Initial call
refreshReveal();

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

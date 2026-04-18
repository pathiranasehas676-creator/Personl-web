document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Check if Already Logged In
    const token = localStorage.getItem('genesis_admin_token');
    if (token) {
        showDashboard();
    } else {
        loginContainer.style.display = 'flex';
    }

    // Login Form Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');
        
        btn.innerHTML = '<span>AUTHENTICATING...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok && data.token) {
                localStorage.setItem('genesis_admin_token', data.token);
                showDashboard();
            } else {
                loginError.textContent = data.msg || 'Authentication Failed';
                btn.innerHTML = '<span>AUTHENTICATE</span> <i class="fa-solid fa-lock"></i>';
            }
        } catch (error) {
            loginError.textContent = 'Server Connection Error';
            btn.innerHTML = '<span>AUTHENTICATE</span> <i class="fa-solid fa-lock"></i>';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('genesis_admin_token');
        location.reload();
    });

    function showDashboard() {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'grid';
        loadDashboardData();
        setupEventListeners();
    }

    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-links li');
    const viewSections = document.querySelectorAll('.view-section');
    const currentViewTitle = document.getElementById('current-view-title');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                sidebar.classList.remove('active');
            }
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-target');
            
            viewSections.forEach(section => {
                section.classList.remove('active');
                if(section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            currentViewTitle.textContent = link.textContent.trim();
        });
    });

    function getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('genesis_admin_token')
        };
    }

    // Event Listeners for CMS
    function setupEventListeners() {
        // Profile Update
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = profileForm.querySelector('button');
                btn.disabled = true;
                btn.innerHTML = '<span>UPDATING...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

                const profileData = {
                    name: document.getElementById('prof-name').value,
                    title: document.getElementById('prof-title').value,
                    heroDesc: document.getElementById('prof-hero-desc').value,
                    aboutMe: document.getElementById('prof-about').value,
                    email: document.getElementById('prof-email').value,
                    location: document.getElementById('prof-location').value,
                    socialLinks: {
                        github: document.getElementById('prof-github').value,
                        linkedin: document.getElementById('prof-linkedin').value
                    }
                };

                try {
                    const res = await fetch('/api/profile', {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(profileData)
                    });
                    const data = await res.json();
                    const status = document.getElementById('profile-status');
                    if(data.success) {
                        status.textContent = 'Profile successfully updated.';
                        status.className = 'status-msg success';
                    } else {
                        status.textContent = 'Capture failed. Check connection.';
                        status.className = 'status-msg error';
                    }
                    setTimeout(() => status.textContent = '', 3000);
                } catch (err) {
                    console.error(err);
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = '<span>UPDATE IDENTITY</span> <i class="fa-solid fa-arrows-rotate"></i>';
                }
            });
        }

        // Skills Manager
        document.getElementById('show-skill-form').addEventListener('click', () => {
            const container = document.getElementById('skill-form-container');
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('skill-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const skill = {
                name: document.getElementById('skill-name').value,
                category: document.getElementById('skill-category').value,
                icon: document.getElementById('skill-icon').value
            };

            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(skill)
            });
            if (res.ok) {
                document.getElementById('skill-form').reset();
                document.getElementById('skill-form-container').style.display = 'none';
                loadSkills();
            }
        });

        // Project Manager
        document.getElementById('add-project-btn').addEventListener('click', () => {
            const title = prompt('Project Title:');
            if(!title) return;
            const category = prompt('Category (e.g. Web App):');
            const description = prompt('Description:');
            const tags = prompt('Tags (comma separated):').split(',').map(t => t.trim());
            
            saveProject({ title, category, description, tags });
        });
    }

    async function saveProject(project) {
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(project)
        });
        if(res.ok) loadProjects();
    }

    window.showTimelineForm = (type) => {
        const container = document.getElementById('timeline-form-container');
        container.style.display = 'block';
        container.innerHTML = `
            <form id="tl-form">
                <h4>Add ${type === 'exp' ? 'Experience' : 'Education'}</h4>
                <div class="input-row">
                    <input type="text" id="tl-title" placeholder="${type === 'exp' ? 'Job Title' : 'Degree'}" required>
                    <input type="text" id="tl-org" placeholder="${type === 'exp' ? 'Company' : 'Institution'}" required>
                </div>
                <div class="input-row">
                    <input type="text" id="tl-period" placeholder="Period (e.g. 2023 - 2024)" required>
                    ${type === 'exp' ? '<input type="text" id="tl-type" placeholder="Type (Internship/Full-time)">' : '<input type="text" id="tl-status" placeholder="Status (Ongoing/Completed)">'}
                </div>
                ${type === 'exp' ? '<textarea id="tl-desc" placeholder="Desc (Separate bullet points with | )"></textarea>' : ''}
                <div class="btn-group">
                    <button type="submit" class="cyber-btn small">SAVE</button>
                    <button type="button" class="cyber-btn small" onclick="document.getElementById('timeline-form-container').style.display='none'">CANCEL</button>
                </div>
            </form>
        `;

        document.getElementById('tl-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                period: document.getElementById('tl-period').value
            };

            if(type === 'exp') {
                payload.title = document.getElementById('tl-title').value;
                payload.company = document.getElementById('tl-org').value;
                payload.type = document.getElementById('tl-type').value || 'Internship';
                payload.description = document.getElementById('tl-desc').value.split('|').map(x => x.trim());
            } else {
                payload.degree = document.getElementById('tl-title').value;
                payload.institution = document.getElementById('tl-org').value;
                payload.status = document.getElementById('tl-status').value || 'Ongoing';
            }

            const res = await fetch(`/api/${type === 'exp' ? 'experience' : 'education'}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            if(res.ok) {
                container.style.display = 'none';
                loadTimeline();
            }
        });
    };

    // Data Loaders
    async function loadDashboardData() {
        loadMessages();
        loadProjects();
        loadProfile();
        loadSkills();
        loadTimeline();
    }

    async function loadProfile() {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success && data.data) {
            const p = data.data;
            document.getElementById('prof-name').value = p.name;
            document.getElementById('prof-title').value = p.title;
            document.getElementById('prof-hero-desc').value = p.heroDesc;
            document.getElementById('prof-about').value = p.aboutMe;
            document.getElementById('prof-github').value = p.socialLinks.github;
            document.getElementById('prof-linkedin').value = p.socialLinks.linkedin;
            document.getElementById('prof-email').value = p.email;
            document.getElementById('prof-location').value = p.location;
        }
    }

    async function loadSkills() {
        const res = await fetch('/api/skills');
        const data = await res.json();
        if (data.success) {
            const list = document.getElementById('admin-skills-list');
            list.innerHTML = data.data.map(s => `
                <div class="skill-manager-item glass-card">
                    <span><i class="${s.icon}"></i> ${s.name} (${s.category})</span>
                    <button class="delete-btn" onclick="deleteItem('skills', '${s._id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    async function loadProjects() {
        const pRes = await fetch('/api/projects');
        const pData = await pRes.json();
        if (pData.success) {
            const grid = document.getElementById('admin-projects-grid');
            document.getElementById('stat-projs').textContent = pData.data.length;
            grid.innerHTML = pData.data.map(p => `
                <div class="glass-card proj-admin-card">
                    <h3>${p.title}</h3>
                    <p>${p.category}</p>
                    <div class="card-actions">
                        <button class="cyber-btn small" onclick="deleteItem('projects', '${p._id}')" style="border-color:var(--danger); color:var(--danger)">DELETE</button>
                    </div>
                </div>
            `).join('');
        }
    }

    async function loadMessages() {
        const mRes = await fetch('/api/messages', { headers: getAuthHeaders() });
        const mData = await mRes.json();
        if (mData.success) {
            const body = document.querySelector('#messages-table tbody');
            document.getElementById('stat-msgs').textContent = mData.data.length;
            document.getElementById('msg-badge').textContent = mData.data.filter(m => !m.isRead).length;
            body.innerHTML = mData.data.map(m => `
                <tr>
                    <td>${new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>${m.name}<br><small>${m.email}</small></td>
                    <td>${m.message}</td>
                    <td>${m.isRead ? 'Read' : 'NEW'}</td>
                </tr>
            `).join('');
        }
    }

    async function loadTimeline() {
        const expRes = await fetch('/api/experience');
        const eduRes = await fetch('/api/education');
        const expData = await expRes.json();
        const eduData = await eduRes.json();

        if (expData.success) {
            document.getElementById('admin-exp-list').innerHTML = expData.data.map(e => `
                <div class="timeline-admin-item glass-card">
                    <div><strong>${e.title}</strong> @ ${e.company} (${e.period})</div>
                    <button class="delete-btn" onclick="deleteItem('experience', '${e._id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `).join('');
        }
        if (eduData.success) {
            document.getElementById('admin-edu-list').innerHTML = eduData.data.map(e => `
                <div class="timeline-admin-item glass-card">
                    <div><strong>${e.degree}</strong> @ ${item.institution}</div>
                    <button class="delete-btn" onclick="deleteItem('education', '${e._id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `).join('');
        }
    }

    // Global helper for deletion
    window.deleteItem = async (entity, id) => {
        if (!confirm(`Are you sure you want to remove this ${entity}?`)) return;
        try {
            const res = await fetch(`/api/${entity}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                if (entity === 'skills') loadSkills();
                if (entity === 'projects') loadProjects();
                if (entity === 'experience' || entity === 'education') loadTimeline();
            }
        } catch (err) {
            console.error(err);
        }
    };
});

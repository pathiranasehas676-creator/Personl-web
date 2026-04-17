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
    }

    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-links li');
    const viewSections = document.querySelectorAll('.view-section');
    const currentViewTitle = document.getElementById('current-view-title');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-target');
            
            viewSections.forEach(section => {
                section.classList.remove('active');
                if(section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Update Title
            currentViewTitle.textContent = link.textContent.trim();
        });
    });

    // Mock Data Loader (Will connect to Node API endpoints later)
    function loadDashboardData() {
        // Load messages (Mock)
        const messagesTableBody = document.querySelector('#messages-table tbody');
        messagesTableBody.innerHTML = `
            <tr>
                <td>2026-04-18 00:45</td>
                <td>John Doe<br><small>john@example.com</small></td>
                <td>Interested in your Cyber Security projects...</td>
                <td><span class="badge" style="background:var(--accent-cyan)">NEW</span></td>
            </tr>
        `;
        document.getElementById('msg-badge').textContent = '1';
        document.getElementById('stat-msgs').textContent = '1';

        // Load Projects (Mock)
        const projectsGrid = document.getElementById('admin-projects-grid');
        projectsGrid.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: var(--accent-blue)">Genesis Protocol</h3>
                <p style="font-size: 0.9rem; margin: 10px 0;">Cyber-security endpoint matrix.</p>
                <div style="display: flex; gap: 10px;">
                    <button class="cyber-btn small" style="padding: 5px 10px;">EDIT</button>
                    <button class="cyber-btn small" style="padding: 5px 10px; border-color: var(--danger); color: var(--danger);">DELETE</button>
                </div>
            </div>
        `;
        document.getElementById('stat-projs').textContent = '1';
    }
});

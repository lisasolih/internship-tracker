let applications = JSON.parse(localStorage.getItem('applications')) || [];
let currentFilter = 'All';

const form = document.querySelector('form');
const companyInput = document.querySelector('input[placeholder="Company name"]');
const roleInput = document.querySelector('input[placeholder="Role"]');
const statusSelect = document.querySelector('select');
const dateInput = document.getElementById('dateInput');
const notesInput = document.getElementById('notesInput');
const applicationsList = document.querySelector('.applications-section');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const status = statusSelect.value;
    const date = dateInput.value;
    const notes = notesInput.value.trim();
    if (!company || !role) return;
    applications.push({ company, role, status, date, notes });
    companyInput.value = '';
    roleInput.value = '';
    dateInput.value = '';
    notesInput.value = '';
    renderApplications();
});

applicationsList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        applications.splice(index, 1);
        renderApplications();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderApplications();
    }
});

function getBadgeClass(status) {
    const classes = {
        'Applied': 'badge-applied',
        'Phone Screen': 'badge-phone',
        'Interview': 'badge-interview',
        'Offer': 'badge-offer',
        'Rejected': 'badge-rejected'
    };
    return classes[status] || 'badge-applied';
}

function updateStats() {
    const total = applications.length;
    const interviews = applications.filter(app => app.status === 'Interview').length;
    const offers = applications.filter(app => app.status === 'Offer').length;
    const statCards = document.querySelectorAll('.stat-card');
    statCards[0].textContent = `Total Applied: ${total}`;
    statCards[1].textContent = `Interviews: ${interviews}`;
    statCards[2].textContent = `Offers: ${offers}`;
}

function renderApplications() {
    updateStats();

    const emptyState = document.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    document.querySelectorAll('.app-card').forEach(card => card.remove());

    const filtered = currentFilter === 'All'
        ? applications
        : applications.filter(app => app.status === currentFilter);

    filtered.forEach(function(app) {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-info">
                <strong>${app.company}</strong>
                <span>${app.role}</span>
                ${app.date ? `<span style="color:#999; font-size:12px;">Applied: ${app.date}</span>` : ''}
                ${app.notes ? `<span style="color:#999; font-size:12px;">📝 ${app.notes}</span>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="status-badge ${getBadgeClass(app.status)}">${app.status}</span>
                <button class="delete-btn" data-index="${applications.indexOf(app)}">✕</button>
            </div>
        `;
        applicationsList.appendChild(card);
    });

    localStorage.setItem('applications', JSON.stringify(applications));
}

renderApplications();
let applications = JSON.parse(localStorage.getItem('applications')) || [];
let currentFilter = 'All';
let currentSort = 'added'; 

const STATUSES = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

const form = document.querySelector('form');
const companyInput = document.querySelector('input[placeholder="Company name"]');
const roleInput = document.querySelector('input[placeholder="Role"]');
const statusSelect = document.querySelector('select');
const dateInput = document.getElementById('dateInput');
const notesInput = document.getElementById('notesInput');
const applicationsList = document.querySelector('.applications-section');
const sortSelect = document.getElementById('sortSelect'); 

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

applicationsList.addEventListener('change', function(e) {
    if (e.target.classList.contains('status-select')) {
        const index = e.target.getAttribute('data-index');
        applications[index].status = e.target.value;
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

sortSelect.addEventListener('change', function() {
    currentSort = sortSelect.value;
    renderApplications();
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

function sortApplications(list) {
    const sorted = [...list];
    if (currentSort === 'added') return sorted;

    const direction = currentSort === 'newest' ? -1 : 1;
    sorted.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;   // applications with no date go last
        if (!b.date) return -1;
        return a.date.localeCompare(b.date) * direction;
    });
    return sorted;
}

function renderApplications() {
    updateStats();

    const emptyState = document.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    document.querySelectorAll('.app-card').forEach(card => card.remove());

    const filtered = currentFilter === 'All'
        ? applications
        : applications.filter(app => app.status === currentFilter);

        sortApplications(filtered).forEach(function(app)  {
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
                <select class="status-select ${getBadgeClass(app.status)}" data-index="${applications.indexOf(app)}">
                    ${STATUSES.map(s => `<option value="${s}" ${s === app.status ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
                <button class="delete-btn" data-index="${applications.indexOf(app)}">✕</button>
            </div>
        `;
        applicationsList.appendChild(card);
    });

    if (filtered.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = currentFilter === 'All'
            ? 'No applications yet. Add one above!'
            : `No ${currentFilter} applications.`;
        applicationsList.appendChild(empty);
    }

    localStorage.setItem('applications', JSON.stringify(applications));
}

renderApplications();
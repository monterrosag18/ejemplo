// Dashboard functionality - CRUDZASO
// Panel administrativo con métricas y gestión de tareas

const API_URL = 'http://localhost:3000';
let currentUser = null;
let allTasks = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const session = localStorage.getItem('session');
    if (!session) {
        window.location.href = '../index.html';
        return;
    }

    currentUser = JSON.parse(session);
    // Poblar navbar con datos del usuario actual
    updateNavbarUser();
    
    // Verificar que sea admin
    if (currentUser.role !== 'admin') {
        window.location.href = 'tasks.html';
        return;
    }

    // Mostrar info del usuario
    updateUserInfo();
    
    // Cargar datos
    await loadDashboardData();
    
    // Configurar filtros
    setupFilters();
    
    // Configurar búsqueda
    setupSearch();
    
    // Configurar logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
});

function updateNavbarUser() {
    try {
        const name = currentUser?.name || 'User';
        const roleLabel = currentUser?.role === 'admin' ? 'Administrator' : 'Student';
        const avatarUrl = currentUser?.avatar
            ? currentUser.avatar
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;

        const navNameEl = document.getElementById('userName');
        const navRoleEl = document.getElementById('userRole');
        const navAvatarEl = document.getElementById('navAvatar');

        if (navNameEl) navNameEl.textContent = name;
        if (navRoleEl) navRoleEl.textContent = roleLabel;
        if (navAvatarEl) navAvatarEl.src = avatarUrl;
    } catch (e) {
        console.warn('Navbar user update skipped:', e);
    }
}

function updateUserInfo() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role === 'admin' ? 'Administrator' : 'Student';
}

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        allTasks = await response.json();
        
        // Calcular estadísticas
        const stats = calculateStats(allTasks);
        updateStatsCards(stats);
        
        // Mostrar tareas en la tabla
        renderTasksTable(allTasks);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not load dashboard data',
            confirmButtonColor: '#2563eb'
        });
    }
}

function calculateStats(tasks) {
    return {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length
    };
}

function updateStatsCards(stats) {
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('completedTasks').textContent = stats.completed;
    document.getElementById('pendingTasks').textContent = stats.pending;
    
    // Calcular progreso
    const progress = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;
    document.getElementById('overallProgress').textContent = `${progress}%`;
}

function renderTasksTable(tasks) {
    const tbody = document.getElementById('tasksTableBody');
    
    if (tasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                    No tasks found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td class="ps-4">
                <div class="fw-medium">${task.title}</div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee || 'Unknown')}&background=random" 
                         class="rounded-circle me-2" width="32" height="32" alt="${task.assignee}">
                    <span>${task.assignee || 'Unassigned'}</span>
                </div>
            </td>
            <td>
                <span class="badge ${getStatusBadgeClass(task.status)}">${task.status}</span>
            </td>
            <td>
                <span class="badge ${getPriorityBadgeClass(task.priority)}">${task.priority}</span>
            </td>
            <td class="text-muted">${formatDate(task.dueDate)}</td>
            <td class="pe-4">
                <button class="btn btn-sm btn-link text-primary" onclick="editTask('${task.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-link text-danger" onclick="deleteTask('${task.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeClass(status) {
    const classes = {
        'Pending': 'bg-warning-subtle text-warning border border-warning',
        'In Progress': 'bg-primary-subtle text-primary border border-primary',
        'Completed': 'bg-success-subtle text-success border border-success'
    };
    return classes[status] || 'bg-secondary';
}

function getPriorityBadgeClass(priority) {
    const classes = {
        'High': 'bg-danger text-white',
        'Medium': 'bg-warning text-white',
        'Low': 'bg-secondary text-white'
    };
    return classes[priority] || 'bg-secondary text-white';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function setupFilters() {
    document.querySelectorAll('#taskTabs .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Actualizar clase active
            document.querySelectorAll('#taskTabs .nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Filtrar tareas
            const filter = link.getAttribute('data-filter');
            filterTasks(filter);
        });
    });
}

function filterTasks(filter) {
    let filtered = allTasks;
    
    if (filter === 'pending') {
        filtered = allTasks.filter(t => t.status === 'Pending');
    } else if (filter === 'completed') {
        filtered = allTasks.filter(t => t.status === 'Completed');
    }
    
    renderTasksTable(filtered);
}

function setupSearch() {
    const searchInput = document.getElementById('searchTasks');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allTasks.filter(task => 
                task.title.toLowerCase().includes(query) ||
                (task.assignee && task.assignee.toLowerCase().includes(query))
            );
            renderTasksTable(filtered);
        });
    }
}

async function editTask(taskId) {
    // Redirigir a página de edición
    window.location.href = `create-task.html?id=${taskId}`;
}

async function deleteTask(taskId) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This task will be permanently deleted",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Task has been deleted',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                // Recargar datos
                await loadDashboardData();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not delete task',
                confirmButtonColor: '#2563eb'
            });
        }
    }
}

function logout() {
    localStorage.removeItem('session');
    window.location.href = '../index.html';
}

// Tasks page - CRUDZASO
// Gestión de tareas para usuarios estudiantes

const API_URL = 'http://localhost:3000';
let currentUser = null;
let userTasks = [];

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
    
    // Mostrar info del usuario
    updateUserInfo();
    
    // Cargar tareas del usuario
    await loadUserTasks();
    
    // Configurar búsqueda
    setupSearch();
    
    // Configurar logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
});

function updateNavbarUser() {
    try {
        const name = currentUser?.name || 'User';
        const roleLabel = currentUser?.role === 'admin' ? 'Admin' : 'Student';
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
    document.getElementById('userRole').textContent = currentUser.role === 'admin' ? 'Admin' : 'Student';
}

async function loadUserTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const allTasks = await response.json();
        
        // Filtrar solo las tareas del usuario actual
        userTasks = currentUser.role === 'admin' 
            ? allTasks 
            : allTasks.filter(task => task.userId === currentUser.id);
        
        // Calcular estadísticas
        updateStats(userTasks);
        
        // Renderizar lista de tareas
        renderTasksList(userTasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not load tasks',
            confirmButtonColor: '#2563eb'
        });
    }
}

function updateStats(tasks) {
    const stats = {
        total: tasks.length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        pending: tasks.filter(t => t.status === 'Pending').length
    };

    document.getElementById('totalTasksCount').textContent = stats.total;
    document.getElementById('inProgressCount').textContent = stats.inProgress;
    document.getElementById('completedCount').textContent = stats.completed;
    document.getElementById('pendingReviewCount').textContent = stats.pending;
}

function renderTasksList(tasks) {
    const container = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                <p class="text-muted">No tasks yet. Create your first task!</p>
                <button class="btn btn-primary mt-2" onclick="window.location.href='create-task.html'">
                    <i class="bi bi-plus-lg me-2"></i>New Task
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="d-flex align-items-center px-4 py-3 border-bottom hover-bg">
            <div class="form-check me-3">
                <input class="form-check-input" type="checkbox" ${task.status === 'Completed' ? 'checked' : ''} 
                       onchange="toggleTaskStatus('${task.id}', this.checked)">
            </div>
            <div class="flex-grow-1">
                <div class="fw-medium mb-1">${task.title}</div>
                <div class="small text-muted">ID: #${task.id.slice(-8)} • ${task.description ? task.description.substring(0, 50) + '...' : 'No description'}</div>
            </div>
            <div style="width: 200px;" class="text-center">
                <span class="badge ${getCategoryBadgeClass(task.category)}">${task.category}</span>
            </div>
            <div style="width: 150px;" class="text-center">
                <span class="badge ${getPriorityBadgeClass(task.priority)}">${task.priority}</span>
            </div>
            <div style="width: 150px;" class="text-center">
                <span class="badge ${getStatusBadgeClass(task.status)}">${task.status}</span>
            </div>
            <div style="width: 100px;" class="text-end">
                <button class="btn btn-sm btn-link text-primary" onclick="editTask('${task.id}')" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-link text-danger" onclick="deleteTask('${task.id}')" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getCategoryBadgeClass(category) {
    const classes = {
        'Mathematics': 'bg-primary-subtle text-primary',
        'Physics': 'bg-info-subtle text-info',
        'Computer Science': 'bg-danger-subtle text-danger',
        'History': 'bg-warning-subtle text-warning',
        'Literature': 'text-purple',
        'Chemistry': 'bg-success-subtle text-success',
        'Biology': 'bg-info-subtle text-info'
    };
    return classes[category] || 'bg-secondary-subtle text-secondary';
}

function getPriorityBadgeClass(priority) {
    const classes = {
        'High': 'bg-danger text-white',
        'Medium': 'bg-warning text-white',
        'Low': 'bg-success text-white'
    };
    return classes[priority] || 'bg-secondary text-white';
}

function getStatusBadgeClass(status) {
    const classes = {
        'Pending': 'bg-warning-subtle text-warning',
        'In Progress': 'bg-primary-subtle text-primary',
        'Completed': 'bg-success-subtle text-success'
    };
    return classes[status] || 'bg-secondary-subtle text-secondary';
}

async function toggleTaskStatus(taskId, isCompleted) {
    try {
        const task = userTasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatus = isCompleted ? 'Completed' : 'In Progress';
        
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                status: newStatus,
                updatedAt: new Date().toISOString()
            })
        });

        if (response.ok) {
            await loadUserTasks();
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = userTasks.filter(task => 
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query) ||
                task.category.toLowerCase().includes(query)
            );
            renderTasksList(filtered);
        });
    }
}

function editTask(taskId) {
    window.location.href = `create-task.html?id=${taskId}`;
}

async function deleteTask(taskId) {
    const result = await Swal.fire({
        title: 'Delete this task?',
        text: "This action cannot be undone",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
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
                    text: 'Task removed successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                await loadUserTasks();
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

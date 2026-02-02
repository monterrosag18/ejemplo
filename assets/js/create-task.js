// Create/Edit Task - CRUDZASO
// Permite crear nuevas tareas o editar existentes

const API_URL = 'http://localhost:3000';
let currentUser = null;
let editingTaskId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const session = localStorage.getItem('session');
    if (!session) {
        window.location.href = '../index.html';
        return;
    }

    currentUser = JSON.parse(session);
    
    // Verificar si estamos editando una tarea
    const urlParams = new URLSearchParams(window.location.search);
    editingTaskId = urlParams.get('id');
    
    if (editingTaskId) {
        await loadTaskForEdit(editingTaskId);
    }
    
    // Configurar formulario
    const form = document.getElementById('create-task-form');
    form.addEventListener('submit', handleSubmit);
    
    // Establecer fecha mínima como hoy
    const dateInput = document.getElementById('dueDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
});

async function loadTaskForEdit(taskId) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`);
        const task = await response.json();
        
        // Llenar el formulario con los datos existentes
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('category').value = task.category;
        document.getElementById('priority').value = task.priority;
        document.getElementById('status').value = task.status;
        document.getElementById('dueDate').value = task.dueDate;
        document.getElementById('description').value = task.description || '';
        
        // Cambiar el título de la página
        document.querySelector('h1').textContent = 'Edit Task';
    } catch (error) {
        console.error('Error loading task:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not load task data',
            confirmButtonColor: '#2563eb'
        });
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const category = document.getElementById('category').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    const dueDate = document.getElementById('dueDate').value;
    const description = document.getElementById('description').value.trim();
    
    // Validaciones
    if (!title) {
        showError('Please enter a task title');
        return;
    }
    
    if (!category) {
        showError('Please select a category');
        return;
    }
    
    if (!dueDate) {
        showError('Please select a due date');
        return;
    }
    
    const taskData = {
        title,
        description,
        category,
        priority,
        status,
        dueDate,
        updatedAt: new Date().toISOString()
    };
    
    // Si estamos creando una nueva tarea
    if (!editingTaskId) {
        taskData.id = `task_${Date.now()}`;
        taskData.createdAt = new Date().toISOString();
        taskData.assignee = currentUser.name;
        taskData.userId = currentUser.id;
        taskData.estimatedHours = 0;
        taskData.actualHours = 0;
        taskData.tags = [];
        taskData.difficulty = 'Medium';
        
        await createTask(taskData);
    } else {
        // Si estamos editando
        await updateTask(editingTaskId, taskData);
    }
}

async function createTask(taskData) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
            await Swal.fire({
                icon: 'success',
                title: 'Task Created!',
                text: 'Your new task has been added successfully',
                confirmButtonColor: '#2563eb'
            });
            
            // Redirigir de vuelta a la lista de tareas
            window.location.href = currentUser.role === 'admin' ? 'dashboard.html' : 'tasks.html';
        } else {
            showError('Could not create task. Please try again.');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        showError('Connection error. Please try again.');
    }
}

async function updateTask(taskId, taskData) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
            await Swal.fire({
                icon: 'success',
                title: 'Task Updated!',
                text: 'Changes saved successfully',
                confirmButtonColor: '#2563eb'
            });
            
            window.location.href = currentUser.role === 'admin' ? 'dashboard.html' : 'tasks.html';
        } else {
            showError('Could not update task. Please try again.');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showError('Connection error. Please try again.');
    }
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: message,
        confirmButtonColor: '#2563eb'
    });
}

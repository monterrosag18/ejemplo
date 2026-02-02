// Profile page - CRUDZASO
// Muestra y permite editar la información del perfil del usuario

const API_URL = 'http://localhost:3000';
let currentUser = null;
let isEditing = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const session = localStorage.getItem('session');
    if (!session) {
        window.location.href = '../index.html';
        return;
    }

    currentUser = JSON.parse(session);
    
    // Cargar información completa del usuario
    await loadUserProfile();
    
    // Configurar botones
    document.getElementById('editProfileBtn')?.addEventListener('click', toggleEditMode);
    document.getElementById('cancelEditBtn')?.addEventListener('click', toggleEditMode);
    document.getElementById('edit-profile-form')?.addEventListener('submit', handleSaveProfile);
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
});

async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/users/${currentUser.id}`);
        const userData = await response.json();
        
        // Actualizar información mostrada
        updateProfileDisplay(userData);
        
        // Cargar conteo de tareas
        await loadTaskCount();
    } catch (error) {
        console.error('Error loading profile:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not load profile data',
            confirmButtonColor: '#2563eb'
        });
    }
}

function updateProfileDisplay(user) {
    // Actualizar elementos del perfil
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    document.getElementById('infoFullName').textContent = user.name;
    document.getElementById('infoEmployeeId').textContent = user.studentId;
    document.getElementById('infoPhone').textContent = user.phoneNumber || 'Not specified';
    document.getElementById('infoDepartment').textContent = user.department;
    document.getElementById('infoRoleLevel').textContent = user.academicLevel || 'Student';
    
    // Formatear fecha de ingreso
    const joinDate = new Date(user.joinDate);
    document.getElementById('infoJoinDate').textContent = joinDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function loadTaskCount() {
    try {
        const response = await fetch(`${API_URL}/tasks?userId=${currentUser.id}`);
        const tasks = await response.json();
        document.getElementById('profileTaskCount').textContent = tasks.length;
    } catch (error) {
        console.error('Error loading task count:', error);
    }
}

function toggleEditMode() {
    isEditing = !isEditing;
    const editFormCard = document.getElementById('editFormCard');
    
    if (isEditing) {
        // Mostrar formulario de edición
        editFormCard.style.display = 'block';
        
        // Llenar formulario con datos actuales
        document.getElementById('editFullName').value = currentUser.name;
        document.getElementById('editPhone').value = document.getElementById('infoPhone').textContent;
        document.getElementById('editEmail').value = currentUser.email;
        document.getElementById('editDepartment').value = currentUser.department;
        
        // Scroll al formulario
        editFormCard.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Ocultar formulario
        editFormCard.style.display = 'none';
    }
}

async function handleSaveProfile(e) {
    e.preventDefault();
    
    const updatedData = {
        name: document.getElementById('editFullName').value.trim(),
        phoneNumber: document.getElementById('editPhone').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        department: document.getElementById('editDepartment').value,
        bio: document.getElementById('editBio').value.trim(),
        lastActive: new Date().toISOString()
    };
    
    // Validación básica
    if (!updatedData.name || !updatedData.email) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Name and email are required',
            confirmButtonColor: '#2563eb'
        });
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        if (response.ok) {
            const updatedUser = await response.json();
            
            // Actualizar sesión
            const session = {
                ...currentUser,
                name: updatedUser.name,
                email: updatedUser.email,
                department: updatedUser.department
            };
            localStorage.setItem('session', JSON.stringify(session));
            currentUser = session;
            
            await Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your changes have been saved',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Recargar perfil y ocultar formulario
            await loadUserProfile();
            toggleEditMode();
        } else {
            throw new Error('Update failed');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not update profile. Please try again.',
            confirmButtonColor: '#2563eb'
        });
    }
}

function logout() {
    localStorage.removeItem('session');
    window.location.href = '../index.html';
}

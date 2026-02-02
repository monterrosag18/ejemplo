// Login functionality - CRUDZASO
// Maneja autenticación de usuarios y administradores

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay sesión activa
    const session = localStorage.getItem('session');
    if (session) {
        const user = JSON.parse(session);
        redirectByRole(user.role);
        return;
    }

    // Configurar el formulario
    const form = document.getElementById('login-form');
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle para mostrar/ocultar contraseña
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            toggleBtn.innerHTML = type === 'password' 
                ? '<i class="bi bi-eye"></i>' 
                : '<i class="bi bi-eye-slash"></i>';
        });
    }

    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users`);
            const users = await response.json();
            
            // Buscar usuario con credenciales correctas
            const user = users.find(u => 
                u.email === email && u.password === password
            );

            if (user) {
                // Guardar sesión
                const sessionData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    studentId: user.studentId
                };
                
                localStorage.setItem('session', JSON.stringify(sessionData));
                
                // Mostrar mensaje de éxito
                await Swal.fire({
                    icon: 'success',
                    title: 'Welcome back!',
                    text: `Hello ${user.name}`,
                    timer: 1500,
                    showConfirmButton: false
                });

                // Redirigir según rol
                redirectByRole(user.role);
            } else {
                showError('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Connection error. Please try again.');
        }
    });
});

// Función para redirigir según el rol
function redirectByRole(role) {
    if (role === 'admin') {
        window.location.href = 'pages/dashboard.html';
    } else {
        window.location.href = 'pages/tasks.html';
    }
}

// Función para mostrar errores
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        confirmButtonColor: '#2563eb'
    });
}

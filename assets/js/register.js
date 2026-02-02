// Register functionality - CRUDZASO
// Permite crear nuevas cuentas de usuario

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones básicas
        if (!fullName || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }

        try {
            // Verificar si el email ya existe
            const checkResponse = await fetch(`${API_URL}/users?email=${email}`);
            const existingUsers = await checkResponse.json();
            
            if (existingUsers.length > 0) {
                showError('This email is already registered');
                return;
            }

            // Crear nuevo usuario
            const newUser = {
                id: `user_${Date.now()}`,
                name: fullName,
                email: email,
                password: password,
                role: 'student',
                department: 'Not specified',
                academicLevel: 'Undergraduate',
                studentId: `STU${Date.now().toString().slice(-6)}`,
                phoneNumber: '',
                bio: '',
                avatar: null,
                joinDate: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                timezone: 'America/New_York',
                language: 'en',
                theme: 'light',
                notifications: {
                    email: true,
                    push: true,
                    deadline: true,
                    daily: false
                }
            };

            // Guardar en la base de datos
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Account created!',
                    text: 'You can now sign in with your credentials',
                    confirmButtonColor: '#2563eb'
                });
                
                window.location.href = '../index.html';
            } else {
                showError('Error creating account. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError('Connection error. Please try again.');
        }
    });
});

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: message,
        confirmButtonColor: '#2563eb'
    });
}

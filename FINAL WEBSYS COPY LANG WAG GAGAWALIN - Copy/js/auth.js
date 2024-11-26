import validation from './validation.js';

class AuthHandler {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Login form handler
        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));

            // Real-time validation for login
            const emailInput = loginForm.querySelector('#email');
            const passwordInput = loginForm.querySelector('#password');

            emailInput?.addEventListener('input', () => this.validateField(emailInput, 'email'));
            passwordInput?.addEventListener('input', () => this.validateField(passwordInput, 'password'));
        }

        // Register form handler
        const registerForm = document.querySelector('#registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));

            // Real-time validation for registration
            const nameInput = registerForm.querySelector('#fullname');
            const emailInput = registerForm.querySelector('#email');
            const passwordInput = registerForm.querySelector('#password');
            const confirmPasswordInput = registerForm.querySelector('#confirm-password');

            nameInput?.addEventListener('input', () => this.validateField(nameInput, 'name'));
            emailInput?.addEventListener('input', () => this.validateField(emailInput, 'email'));
            passwordInput?.addEventListener('input', () => this.validateField(passwordInput, 'password'));
            confirmPasswordInput?.addEventListener('input', () => {
                this.validateConfirmPassword(confirmPasswordInput, passwordInput.value);
            });
        }
    }

    validateField(input, type) {
        const value = input.value.trim();
        if (!value) {
            validation.showError(input, `${type.charAt(0).toUpperCase() + type.slice(1)} is required`);
            return false;
        }

        if (!validation[type](value)) {
            const messages = {
                email: 'Please enter a valid email address',
                password: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number',
                name: 'Name must be at least 2 characters long'
            };
            validation.showError(input, messages[type]);
            return false;
        }

        validation.removeError(input);
        return true;
    }

    validateConfirmPassword(confirmInput, password) {
        if (confirmInput.value !== password) {
            validation.showError(confirmInput, 'Passwords do not match');
            return false;
        }
        validation.removeError(confirmInput);
        return true;
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const rememberMe = e.target.querySelector('[name="remember"]')?.checked;

        // Validate fields
        const isEmailValid = this.validateField(e.target.email, 'email');
        const isPasswordValid = this.validateField(e.target.password, 'password');

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        try {
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                this.currentUser = user;
                if (rememberMe) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                this.showMessage('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                this.showMessage('Invalid email or password', 'error');
            }
        } catch (error) {
            this.showMessage('An error occurred during login', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = e.target.fullname.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target['confirm-password'].value;

        // Validate all fields
        const isNameValid = this.validateField(e.target.fullname, 'name');
        const isEmailValid = this.validateField(e.target.email, 'email');
        const isPasswordValid = this.validateField(e.target.password, 'password');
        const isConfirmPasswordValid = this.validateConfirmPassword(
            e.target['confirm-password'],
            password
        );

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        try {
            // Check if user already exists
            if (this.users.some(user => user.email === email)) {
                this.showMessage('Email already registered', 'error');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));

            this.showMessage('Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            this.showMessage('An error occurred during registration', 'error');
        }
    }

    showMessage(message, type) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.padding = '1rem';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.backgroundColor = type === 'success' ? '#38a169' : '#e53e3e';
        messageDiv.style.color = 'white';
        messageDiv.style.zIndex = '1000';
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize authentication handler
document.addEventListener('DOMContentLoaded', () => {
    new AuthHandler();
});
// Form validation functions
const validation = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    password: (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    },

    name: (name) => {
        return name.trim().length >= 2;
    },

    showError: (inputElement, message) => {
        const formGroup = inputElement.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#e53e3e';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
        inputElement.style.borderColor = '#e53e3e';
    },

    removeError: (inputElement) => {
        const formGroup = inputElement.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        inputElement.style.borderColor = '#38a169';
    }
};

export default validation;
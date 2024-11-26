// DOM Elements
const profileNav = document.querySelector('.profile-nav');
const profileSections = document.querySelectorAll('.profile-section');
const profileForm = document.querySelector('.profile-form');
const favoriteCards = document.querySelectorAll('.favorite-card');

// State management
let currentTab = 'profile';

// Tab switching functionality
profileNav.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn')) {
        const tabId = e.target.dataset.tab;
        switchTab(tabId);
    }
});

function switchTab(tabId) {
    // Update nav buttons
    const navButtons = profileNav.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });

    // Update sections
    profileSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === tabId || section.id === `${tabId}-info`) {
            section.classList.add('active');
        }
    });

    currentTab = tabId;
}

// Form handling
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value
    };

    // Validate form data
    if (!validateForm(formData)) {
        return;
    }

    // Simulate API call to save profile
    saveProfile(formData);
});

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;

    if (!data.fullName.trim()) {
        showError('Please enter your full name');
        return false;
    }

    if (!emailRegex.test(data.email)) {
        showError('Please enter a valid email address');
        return false;
    }

    if (!phoneRegex.test(data.phone)) {
        showError('Please enter a valid phone number');
        return false;
    }

    if (!data.location.trim()) {
        showError('Please enter your location');
        return false;
    }

    return true;
}

function saveProfile(data) {
    // Show loading state
    const saveBtn = profileForm.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
            showSuccess('Profile updated successfully!');
        }, 1000);
    }, 1500);
}

// Favorites handling
favoriteCards.forEach(card => {
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => removeFavorite(card));
});

function removeFavorite(card) {
    // Add fade out animation
    card.style.transition = 'opacity 0.3s ease';
    card.style.opacity = '0';

    // Remove card after animation
    setTimeout(() => {
        card.remove();
        showSuccess('Item removed from favorites');
    }, 300);
}

// Notification system
function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '5px',
        backgroundColor: type === 'error' ? '#f56565' : '#48bb78',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: '2000',
        transition: 'opacity 0.3s ease'
    });

    // Add to document
    document.body.appendChild(notification);

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle profile image upload
const profileAvatar = document.querySelector('.profile-avatar img');
if (profileAvatar) {
    profileAvatar.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileAvatar.src = e.target.result;
                    showSuccess('Profile picture updated');
                };
                reader.readAsDataURL(file);
            }
        });

        fileInput.click();
    });
}

// Add hover effect to profile avatar
if (profileAvatar) {
    profileAvatar.addEventListener('mouseenter', () => {
        profileAvatar.style.cursor = 'pointer';
        profileAvatar.title = 'Click to update profile picture';
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active tab
    switchTab(currentTab);

    // Add smooth scrolling for mobile nav
    if (window.innerWidth <= 768) {
        const navScroll = document.querySelector('.profile-nav');
        let isScrolling = false;
        let startX;
        let scrollLeft;

        navScroll.addEventListener('mousedown', (e) => {
            isScrolling = true;
            startX = e.pageX - navScroll.offsetLeft;
            scrollLeft = navScroll.scrollLeft;
        });

        navScroll.addEventListener('mouseleave', () => {
            isScrolling = false;
        });

        navScroll.addEventListener('mouseup', () => {
            isScrolling = false;
        });

        navScroll.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.pageX - navScroll.offsetLeft;
            const walk = (x - startX) * 2;
            navScroll.scrollLeft = scrollLeft - walk;
        });
    }
});
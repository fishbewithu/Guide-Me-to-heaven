document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryItems = document.querySelectorAll('.category-item');

    /**
     * Filter categories based on the selected category
     * @param {string} category - The category to filter by
     */
    const filterCategories = (category) => {
        categoryItems.forEach(item => {
            const categories = item.dataset.categories?.split(',') || [];
            
            // First, remove any existing animation classes
            item.classList.remove('fade-in', 'fade-out');
            
            if (category === 'all' || categories.includes(category)) {
                // Show items that match the category
                item.style.display = 'block';
                // Add fade-in animation
                setTimeout(() => {
                    item.classList.add('fade-in');
                }, 50);
            } else {
                // Hide items that don't match
                item.classList.add('fade-out');
                // Remove the element from layout after animation
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300); // Match this with CSS transition duration
            }
        });
    };

    /**
     * Initialize filter buttons
     */
    const initializeFilters = () => {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state of buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter categories
                filterCategories(btn.dataset.category);
            });
        });
    };

    // Initialize the filtering functionality
    initializeFilters();
});

// ========== GLOBAL VARIABLES ========== //
const cart = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const users = JSON.parse(localStorage.getItem('users')) || [];
const menuData = [
    { id: 1, name: 'Bruschetta', description: 'Toasted bread topped with tomatoes, garlic, and fresh basil', price: 249.99, category: 'starters', image: 'bruschetta.jpg' },
    { id: 2, name: 'Calamari', description: 'Crispy fried squid served with lemon aioli', price: 310.00, category: 'starters', image: 'Calamari.png' },
    { id: 3, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze', price: 325.99, category: 'starters', image: 'Caprese-salad.jpg' },
    { id: 4, name: 'Filet Mignon', description: '8oz grass-fed beef with roasted vegetables and mashed potatoes', price: 410.99, category: 'mains', image: 'filet-mignon.png' },
    { id: 5, name: 'Grilled Salmon', description: 'Wild-caught salmon with lemon butter sauce and asparagus', price: 350.00, category: 'mains', image: 'Grilled salmon.jpg' },
    { id: 6, name: 'Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms and parmesan', price: 380.00, category: 'mains', image: 'mushroom risotto.jpg' },
    { id: 7, name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 450.00, category: 'mains', image: 'pizza margherita.jpg' },
    { id: 8, name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers', price: 349.99, category: 'desserts', image: 'tiramisu.jpg' },
    { id: 9, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center and vanilla ice cream', price: 265.00, category: 'desserts', image: 'chocolate lava cake.jpg' },
    { id: 10, name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar topping', price: 340.00, category: 'desserts', image: 'creme.jpg' },
    { id: 11, name: 'House Red Wine', description: 'Glass of our signature Cabernet Sauvignon', price: 300.00, category: 'drinks', image: 'red-wine.jpg' },
    { id: 12, name: 'Craft Beer', description: 'Local IPA from our microbrewery partner', price: 220.00, category: 'drinks', image: 'craft-beer.jpg' },
    { id: 13, name: 'Sparkling Water', description: 'Premium mineral water with natural carbonation', price: 85.00, category: 'drinks', image: 'Sparkling water.jpg' },
    { id: 14, name: 'Lumpiang Shanghai', description: 'Crispy fried spring rolls filled with seasoned ground pork, carrots, and onions, served with a sweet and sour dipping sauce.', price: 125.00, category: 'starters', image: 'lumpia-shanghai.jpg' },
    { id: 15, name: 'Sinigang na Baboy', description: 'Tamarind-based sour pork soup with vegetables.', price: 325.00, category: 'mains', image: 'Pork-Sinigang.jpg' },
    { id: 16, name: 'Halo-Halo', description: 'A mix of crushed ice, sweetened fruits, leche flan, and ube topped with evaporated milk.', price: 185.00, category: 'desserts', image: 'Halo-halo.jpg' },
    { id: 17, name: 'Bicol Express', description: 'Creamy and spicy coconut milk dish with pork and chili peppers.', price: 280.00, category: 'mains', image: 'bicol express.jpg' },
    { id: 18, name: 'Calamansi Juice', description: 'Sweet and tangy local lime juice, served hot or cold.', price: 90.00, category: 'drinks', image: 'Calamansi-Juice.jpg' }
];

// ========== MAIN INITIALIZATION ========== //
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initSmoothScrolling();
    initScrollSpy();
    initMenuFilter();
    initFAQAccordion();
    initCartSystem();
    initForms();
    initReservationSystem();
    initLoyaltyProgram();
    initLoader();
    initBackToTop();
    initMenuSearch();
    initAuthSystem();
    
    updateCart();
    updateAuthUI();
    populateMenuItems();
});

// ========== COMPONENT INITIALIZERS ========== //

function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollSpy() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const navItems = document.querySelectorAll('.nav-links li a');
        
        document.querySelectorAll('.page').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
}

function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.parentElement.classList.remove('active');
                }
            });
        });
    });
}

function initCartSystem() {
    const cartModal = document.getElementById('cart-modal');
    const cartButton = document.querySelector('a[href="#cart"]');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');

    if (!cartModal || !cartButton) return;

    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                e.target.closest('.modal').style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            if (e.target === cartModal) {
                cartModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            if (e.target.classList.contains('add-to-cart')) {
                const itemId = e.target.getAttribute('data-id');
                addToCart(itemId);
            }

            if (e.target.classList.contains('cart-item-remove')) {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(itemId);
            }
        });

    if (clearCartButton) {
        clearCartButton.addEventListener('click', function() {
            cart.length = 0;
            updateCart();
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert('Thank you for your order! Your delicious food will be prepared shortly.');
            cart.length = 0;
            updateCart();
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
}

function initForms() {
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
            this.reset();
        });
    }
}

function initReservationSystem() {
    const reservationForm = document.querySelector('.reservation-form');
    if (!reservationForm) return;

    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Your reservation has been confirmed! We look forward to serving you.');
        this.reset();
    });
}

function initLoyaltyProgram() {
    const joinButton = document.querySelector('.loyalty-join .btn');
    if (!joinButton) return;

    joinButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const modal = document.createElement('div');
        modal.className = 'loyalty-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Join Our Rewards Program</h2>
                <form id="loyalty-form">
                    <div class="form-group">
                        <input type="text" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="Email" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" placeholder="Phone Number" required>
                    </div>
                    <button type="submit" class="btn">Sign Up</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        });

        const loyaltyForm = modal.querySelector('#loyalty-form');
        if (loyaltyForm) {
            loyaltyForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for joining!');
                document.body.removeChild(modal);
                document.body.classList.remove('modal-open');
            });
        }
    });
}

function initLoader() {
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader-wrapper');
        if (!loader) return;
        
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    });
}

function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initMenuSearch() {
    const menuSearchInput = document.getElementById('menu-search-input');
    const searchClear = document.getElementById('search-clear');
    if (!menuSearchInput || !searchClear) return;

    menuSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const desc = item.querySelector('p').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        searchClear.style.display = searchTerm ? 'block' : 'none';
    });

    searchClear.addEventListener('click', function() {
        menuSearchInput.value = '';
        this.style.display = 'none';
        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.display = 'block';
        });
    });
}

function initAuthSystem() {
    
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');
    

    // In your auth system initialization
document.addEventListener('click', function(e) {
    const userProfile = document.getElementById('user-profile');
    const dropdown = document.querySelector('.user-dropdown');
    
    if (e.target.closest('#user-profile')) {
        // Toggle dropdown
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        document.body.classList.toggle('dropdown-open', !isOpen);
    } else {
        // Close when clicking elsewhere
        if (dropdown) dropdown.style.display = 'none';
        document.body.classList.remove('dropdown-open');
    }
});
    if (loginLink) loginLink.addEventListener('click', showLoginModal);
    if (registerLink) registerLink.addEventListener('click', showRegisterModal);
    if (showRegister) showRegister.addEventListener('click', showRegisterModal);
    if (showLogin) showLogin.addEventListener('click', showLoginModal);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
}

// ========== CART FUNCTIONS ========== //

function addToCart(itemId) {
    const specialDishes = [
        { id: 101, name: 'Adobo Short Ribs', description: 'Braised beef short ribs in adobo reduction', price: 550.00, image: 'filipino adobo-short-ribs.jpg' },
        { id: 102, name: 'Organic Salad Bowl', description: 'Fresh organic vegetables', price: 200.00, image: 'organic salad bowl.jpg' },
        { id: 103, name: 'Seafood Kinilaw', description: 'Fresh tuna, scallops, and oysters', price: 350.00, image: 'Seafood kinilaw.jpg' }
    ];

    itemId = parseInt(itemId);
    
    let item = menuData.find(item => item.id === itemId) || 
               specialDishes.find(item => item.id === itemId);
    
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCart();
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartCount || !cartTotal) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '₱0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <span class="cart-item-remove" data-id="${item.id}">Remove</span>
            </div>
            <div class="cart-item-price">
                ₱${item.price.toFixed(2)} x ${item.quantity}<br>
                <strong>₱${itemTotal.toFixed(2)}</strong>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = `₱${total.toFixed(2)}`;
}

// ========== AUTH FUNCTIONS ========== //

function showLoginModal(e) {
    if (e) e.preventDefault();
    const registerModal = document.getElementById('register-modal');
    const loginModal = document.getElementById('login-modal');
    
    if (registerModal) registerModal.style.display = 'none';
    if (loginModal) loginModal.style.display = 'block';
}

function showRegisterModal(e) {
    if (e) e.preventDefault();
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (loginModal) loginModal.style.display = 'none';
    if (registerModal) registerModal.style.display = 'block';
}

function updateAuthUI() {
    const authLinks = document.getElementById('auth-links');
    const userProfile = document.getElementById('user-profile');
    const userGreeting = document.getElementById('user-greeting');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    

    if (currentUser) {
        if (authLinks) authLinks.style.display = 'none';
        if (userProfile) userProfile.style.display = 'block';
        if (userGreeting) userGreeting.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'none';
    } else {
        if (authLinks) authLinks.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }
}

function handleAuthSuccess(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    showNotification(`Welcome, ${user.name}!`);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        handleAuthSuccess(user);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        joinDate: new Date().toISOString(),
        loyaltyPoints: 0
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    handleAuthSuccess(newUser);
    document.getElementById('register-form').reset();
}

function handleLogout(e) {
    if (e) e.preventDefault();
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('You have been logged out');
}


// ========== UTILITY FUNCTIONS ========== //

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function populateMenuItems() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    menuData.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-item ${item.category}`;
        menuItem.innerHTML = `
            <div class="menu-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-item-content">
                <span class="menu-item-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                <div class="menu-item-title">
                    <h3>${item.name}</h3>
                    <span class="price">₱${item.price.toFixed(2)}</span>
                </div>
                <p>${item.description}</p>
                <button class="btn add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
}
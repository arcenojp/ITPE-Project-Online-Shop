const cart = [];
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scrolling for navigation
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

    // Update active nav item on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
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

    // Menu Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
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

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other open FAQs
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.parentElement.classList.remove('active');
                }
            });
        });
    });

    // Cart Functionality
    const cartModal = document.getElementById('cart-modal');
    const cartButton = document.querySelector('a[href="#cart"]');
    const closeModal = document.querySelector('.close-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Sample menu data
    const menuData = [
        { id: 1, name: 'Bruschetta', description: 'Toasted bread topped with tomatoes, garlic, and fresh basil', price: 249.99, category: 'starters', image: 'bruschetta.jpg' },
        { id: 2, name: 'Calamari', description: 'Crispy fried squid served with lemon aioli', price: 380.00, category: 'starters', image: 'Calamari.png' },
        { id: 3, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze', price: 425.99, category: 'starters', image: 'Caprese-salad.jpg' },
        { id: 4, name: 'Filet Mignon', description: '8oz grass-fed beef with roasted vegetables and mashed potatoes', price: 899.99, category: 'mains', image: 'filet-mignon.png' },
        { id: 5, name: 'Grilled Salmon', description: 'Wild-caught salmon with lemon butter sauce and asparagus', price: 550.00, category: 'mains', image: 'Grilled salmon.jpg' },
        { id: 6, name: 'Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms and parmesan', price: 600.00, category: 'mains', image: 'mushroom risotto.jpg' },
        { id: 7, name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 450.00, category: 'mains', image: 'pizza margherita.jpg' },
        { id: 8, name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers', price: 349.99, category: 'desserts', image: 'tiramisu.jpg' },
        { id: 9, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center and vanilla ice cream', price: 265.00, category: 'desserts', image: 'chocolate lava cake.jpg' },
        { id: 10, name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar topping', price: 340.00, category: 'desserts', image: 'creme.jpg' },
        { id: 11, name: 'House Red Wine', description: 'Glass of our signature Cabernet Sauvignon', price: 500.00, category: 'drinks', image: 'red-wine.jpg' },
        { id: 12, name: 'Craft Beer', description: 'Local IPA from our microbrewery partner', price: 250.00, category: 'drinks', image: 'craft-beer.jpg' },
        { id: 13, name: 'Sparkling Water', description: 'Premium mineral water with natural carbonation', price: 125.00, category: 'drinks', image: 'Sparkling water.jpg' }
    ];
    

    // Populate menu items
    const menuContainer = document.getElementById('menu-container');
    
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

    // Add event listeners to all add-to-cart buttons (including dynamically created ones)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const itemId = e.target.getAttribute('data-id');
            addToCart(itemId);
        }
    });

    // Cart functions
    function addToCart(itemId) {
        const specialDishes = [
            { id: 101, name: 'Adobo Short Ribs', description: 'Braised beef short ribs in adobo reduction', price: 550.00, image: 'filipino adobo-short-ribs.jpg' },
            { id: 102, name: 'Organic Salad Bowl', description: 'Fresh organic vegetables', price: 200.00, image: 'organic salad bowl.jpg' },
            { id: 103, name: 'Seafood Kinilaw', description: 'Fresh tuna, scallops, and oysters', price: 350.00, image: 'Seafood kinilaw.jpg' }
        ];
    
        itemId = parseInt(itemId);
        
        // Find item in either regular menu or special dishes
        let item = menuData.find(item => item.id === itemId);
        if (!item) {
            item = specialDishes.find(item => item.id === itemId);
        }
        
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }
    
        // Check if item already in cart
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }
        console.log('Adding to cart:', item); 
    updateCart();
        updateCart();
        showCartNotification(item.name);
    }

    function removeFromCart(itemId) {
        const itemIndex = cart.findIndex(i => i.id === itemId);
        
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            updateCart();
        }
    }

    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart modal
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
                    <img src="${item.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}" alt="${item.name}">
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
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                removeFromCart(itemId);
            });
        });
        
        // Update total
        cartTotal.textContent = `₱${total.toFixed(2)}`;
    }

    function showCartNotification(itemName) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <p>${itemName} added to cart!</p>
        `;
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

    // Cart modal controls
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    clearCartButton.addEventListener('click', function() {
        cart.length = 0;
        updateCart();
    });

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

    // Form submission
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

    // Initialize
    updateCart();
});
// Reservation Form Handling
const reservationForm = document.querySelector('.reservation-form');
if (reservationForm) {
  reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Your reservation has been confirmed! We look forward to serving you.');
    this.reset();
  });
}

// Loyalty Program Join Button
// Updated Loyalty Program Join Button
const joinButton = document.querySelector('.loyalty-join .btn');
if (joinButton) {
  joinButton.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default anchor behavior
    
    // Create modal
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
    
    // Append modal
    document.body.appendChild(modal);
    
    // Close modal handler
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', function() {
      document.body.removeChild(modal);
      document.body.classList.remove('modal-open'); // Restore scrolling
    });

    // Form submission
    const loyaltyForm = modal.querySelector('#loyalty-form');
    loyaltyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for joining!');
      document.body.removeChild(modal);
      document.body.classList.remove('modal-open');
    });
    
    // Add class to body to handle scroll properly
    document.body.classList.add('modal-open');
  });
}
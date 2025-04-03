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
            
            const filterValue = this.getAttribute('data-filter');
            
            menuItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
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
    const cart = [];
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
        { id: 1, name: 'Bruschetta', description: 'Toasted bread topped with tomatoes, garlic, and fresh basil', price: 8.99, category: 'starters', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f' },
        { id: 2, name: 'Calamari', description: 'Crispy fried squid served with lemon aioli', price: 12.99, category: 'starters', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b' },
        { id: 3, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze', price: 10.99, category: 'starters', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae' },
        { id: 4, name: 'Filet Mignon', description: '8oz grass-fed beef with roasted vegetables and mashed potatoes', price: 32.99, category: 'mains', image: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
        { id: 5, name: 'Grilled Salmon', description: 'Wild-caught salmon with lemon butter sauce and asparagus', price: 26.99, category: 'mains', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a8b9903' },
        { id: 6, name: 'Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms and parmesan', price: 18.99, category: 'mains', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3' },
        { id: 7, name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 16.99, category: 'mains', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
        { id: 8, name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers', price: 9.99, category: 'desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb' },
        { id: 9, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center and vanilla ice cream', price: 10.99, category: 'desserts', image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94' },
        { id: 10, name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar topping', price: 8.99, category: 'desserts', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2' },
        { id: 11, name: 'House Red Wine', description: 'Glass of our signature Cabernet Sauvignon', price: 9.99, category: 'drinks', image: 'https://images.unsplash.com/photo-1551218372-f9e86a1a7e7a' },
        { id: 12, name: 'Craft Beer', description: 'Local IPA from our microbrewery partner', price: 7.99, category: 'drinks', image: 'https://images.unsplash.com/photo-1572913017566-3679f27cbac2' },
        { id: 13, name: 'Sparkling Water', description: 'Premium mineral water with natural carbonation', price: 3.99, category: 'drinks', image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24' }
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
                    <span class="price">$${item.price.toFixed(2)}</span>
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
            const itemId = parseInt(e.target.getAttribute('data-id'));
            addToCart(itemId);
        }
    });

    // Cart functions
    function addToCart(itemId) {
        const item = menuData.find(i => i.id === itemId) || 
                    { id: 101, name: 'Truffle Pasta', description: 'Handmade pasta with black truffle and parmesan', price: 24.99 } ||
                    { id: 102, name: 'Organic Salad Bowl', description: 'Fresh organic vegetables with house dressing', price: 18.99 } ||
                    { id: 103, name: 'Chocolate Soufflé', description: 'Warm chocolate soufflé with vanilla ice cream', price: 14.99 };
        
        const existingItem = cart.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }
        
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
            cartTotal.textContent = '$0.00';
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
                    $${item.price.toFixed(2)} x ${item.quantity}<br>
                    <strong>$${itemTotal.toFixed(2)}</strong>
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
        cartTotal.textContent = `$${total.toFixed(2)}`;
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
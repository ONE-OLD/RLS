// Global state
let currentPage = 'home';
let currentTheme = 'light';
let isMobileMenuOpen = false;

// Safe initializer for gallery (some builds call this before the gallery code loads)
function initializeGallery() {
    // No-op: gallery items are loaded via Firebase modules and event listeners
    // attachGalleryClickEvents() is called later in the file to avoid duplicate listeners.
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeAnimations();
    initializeContactForm();
    initializeEmailJS();
    initializeGallery();
    initializeAcademicsTabs();
    
    // Set initial page
    navigateTo('home');
});

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.body.className = `${savedTheme}-theme`;
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = `${currentTheme}-theme`;
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add a subtle animation effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function updateThemeIcon() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        const sunIcon = button.querySelector('.sun-icon');
        const moonIcon = button.querySelector('.moon-icon');
        
        if (currentTheme === 'dark') {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        } else {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        }
    });
}

// Navigation Management
function initializeNavigation() {
    // Update navigation items based on current page
    updateActiveNavItem();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            navigateTo(event.state.page, false);
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileNav = document.getElementById('mobile-nav');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (isMobileMenuOpen && 
            !mobileNav.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            closeMobileMenu();
        }
    });
}

function navigateTo(page, addToHistory = true) {
    // Hide current page
    const currentPageElement = document.querySelector('.page.active');
    if (currentPageElement) {
        currentPageElement.classList.remove('active');
    }
    
    // Show new page
    const newPageElement = document.getElementById(`${page}-page`);
    if (newPageElement) {
        newPageElement.classList.add('active');
        currentPage = page;
        
        // Update browser history
        if (addToHistory) {
            const title = getPageTitle(page);
            history.pushState({ page: page }, title, `#${page}`);
            document.title = title;
        }
        
        // Update navigation
        updateActiveNavItem();
        
        // Close mobile menu if open
        closeMobileMenu();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger entrance animations
        triggerPageAnimations(newPageElement);
    }
}

function updateActiveNavItem() {
    // Update desktop navigation
    const desktopNavItems = document.querySelectorAll('.nav-item');
    desktopNavItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function getPageTitle(page) {
    const titles = {
        'home': 'Rwamagana Leaders\' School - Home',
        'about': 'About Us - Rwamagana Leaders\' School',
        'academics': 'Academics - Rwamagana Leaders\' School',
        'admissions': 'Admissions - Rwamagana Leaders\' School',
        'gallery': 'Gallery - Rwamagana Leaders\' School',
        'news': 'News & Events - Rwamagana Leaders\' School',
        'contact': 'Contact Us - Rwamagana Leaders\' School'
    };
    return titles[page] || 'Rwaamagana Leaders\' School';
}

// Mobile Menu Management
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    mobileNav.classList.add('active');
    mobileMenuBtn.classList.add('active');
    isMobileMenuOpen = true;
    
    // Animate menu items
    const menuItems = mobileNav.querySelectorAll('.mobile-nav-item');
    menuItems.forEach((item, index) => {
        item.style.animation = `fadeIn 0.3s ease-out ${index * 0.1}s both`;
    });
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    mobileNav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    isMobileMenuOpen = false;
}

// Animation Management
function initializeAnimations() {
    // Set up intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Timeline animation observer
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

function triggerPageAnimations(pageElement) {
    // Reset and trigger animations for the new page
    const animatedElements = pageElement.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    animatedElements.forEach((element, index) => {
        // Reset animation
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        
        // Reapply animation with delay
        const animationClass = Array.from(element.classList).find(cls => 
            ['fade-in', 'slide-in-left', 'slide-in-right', 'scale-in'].includes(cls)
        );
        
        if (animationClass) {
            element.style.animation = `${getAnimationName(animationClass)} 0.6s ease-out ${index * 0.1}s both`;
        }
    });
}

function getAnimationName(className) {
    const animationMap = {
        'fade-in': 'fadeIn',
        'slide-in-left': 'slideInLeft',
        'slide-in-right': 'slideInRight',
        'scale-in': 'scaleIn'
    };
    return animationMap[className] || 'fadeIn';
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: 'Cb1SnkxeBdcnZdwS7', // Replace with your EmailJS public key
    serviceId: 'service_73pauik', // Replace with your EmailJS service ID
    templateId: 'template_midup9j' // Replace with your EmailJS template ID
};

// Initialize EmailJS
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
}

// Contact Form Management
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const admissionsForm = document.getElementById('admissions-form');
    const newsletterForm = document.getElementById('newsletter-form');
    const footerSubscribeForm = document.getElementById('footer-subscribe-form');
    const footerOnesignalButton = document.getElementById('footer-onesignal-subscribe');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    if (admissionsForm) {
        admissionsForm.addEventListener('submit', handleAdmissionsFormSubmit);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterFormSubmit);
    }

    if (footerSubscribeForm) {
        footerSubscribeForm.addEventListener('submit', handleFooterSubscribeSubmit);
    }

    if (footerOnesignalButton) {
        footerOnesignalButton.addEventListener('click', handleFooterOneSignalSubscribe);
    }
}

function handleFooterSubscribeSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById('footer-subscribe-email');
    const status = document.getElementById('footer-subscribe-status');
    const email = emailInput?.value.trim();

    if (!email) {
        if (status) {
            status.textContent = 'Please enter an email address.';
            status.style.color = '#f9c74f';
        }
        return;
    }

    if (status) {
        status.textContent = 'Thank you for subscribing!';
        status.style.color = '#8fd14f';
    }

    if (emailInput) {
        emailInput.value = '';
    }

    showNotification('You are subscribed for school updates.');
}

async function handleFooterOneSignalSubscribe() {
    const status = document.getElementById('footer-subscribe-status');
    const button = document.getElementById('footer-onesignal-subscribe');

    if (button) {
        button.disabled = true;
        button.textContent = 'Subscribing...';
    }

    try {
        const OneSignal = await new Promise((resolve, reject) => {
            if (window.OneSignal) {
                resolve(window.OneSignal);
                return;
            }

            const timeout = setTimeout(() => reject(new Error('OneSignal timed out.')), 6000);
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(function(instance) {
                clearTimeout(timeout);
                resolve(instance);
            });
        });

        let subscribed = false;

        if (typeof OneSignal.Notifications?.requestPermission === 'function') {
            await OneSignal.Notifications.requestPermission();
            subscribed = Notification.permission === 'granted';
        } else if (typeof OneSignal.User?.PushSubscription?.optIn === 'function') {
            await OneSignal.User.PushSubscription.optIn();
            subscribed = true;
        } else if (typeof OneSignal.showSlidedownPrompt === 'function') {
            await OneSignal.showSlidedownPrompt();
            subscribed = Notification.permission === 'granted';
        }

        if (subscribed) {
            if (status) {
                status.textContent = 'Push alerts enabled.';
                status.style.color = '#8fd14f';
            }
            showNotification('Push alerts enabled.');
        } else {
            if (status) {
                status.textContent = 'Push permission was not granted.';
                status.style.color = '#f9c74f';
            }
        }
    } catch (error) {
        console.error('OneSignal subscription failed:', error);
        if (status) {
            status.textContent = 'Unable to enable push alerts.';
            status.style.color = '#f9c74f';
        }
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = 'Enable push alerts';
        }
    }
}

function handleContactFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = {
        from_name: document.getElementById('name').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Submit contact form via EmailJS
    submitContactForm(data, event.target);
}

function submitContactForm(data, form) {
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    if (data.to_email) {
        data.to_email = data.to_email + ', kwizerarsn@gmail.com'; // <-- Add your second email here
    }
    // Send email via EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, data)
        .then(function(response) {
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            showNotification('Message sent successfully! We\'ll get back to you soon.');
            console.log('Email sent successfully:', response);
        })
        .catch(function(error) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            showNotification('Failed to send message. Please try again later.', 'error');
            console.error('Email sending failed:', error);
        });
}

// Initialize EmailJS
const EMAILJS_CONFIg = {
    serviceId: "service_73pauik",       // e.g., "service_abc123"
    templateId: "template_kj4eg4y",     // e.g., "template_xyz456"
    publicKey: "Cb1SnkxeBdcnZdwS7"        // e.g., "P8abcd123xyz"
};

emailjs.init(EMAILJS_CONFIg.publicKey);

// Handle form submission
function handleAdmissionsFormSubmit(event) {
    event.preventDefault();

    // Basic form validation
    if (!validateAdmissionsForm(event.target)) {
        return;
    }

    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    // Send email through EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIg.templateId, data)
        .then(response => {
            console.log('Email successfully sent!', response);
            showAdmissionsSuccess(); // Show success message
        })
        .catch(error => {
            console.error('EmailJS Error:', error);
            showNotification('Failed to send application. Please try again later.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

// Validate form inputs
function validateAdmissionsForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('error');
            isValid = false;
        }
    }

    // Validate essay length
    const essayField = form.querySelector('#essay');
    if (essayField && essayField.value.length < 100) {
        essayField.classList.add('error');
        showNotification('Essay must be at least 100 characters long.', 'error');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }

    return isValid;
}

// Display success message
function showAdmissionsSuccess() {
    const formContainer = document.querySelector('.application-form-section');
    const successHTML = `
        <div class="success-message" style="text-align:center; padding:30px;">
            <div class="success-icon" style="color:green; margin-bottom:20px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
            </div>
            <h2>Application Submitted!</h2>
            <p>Thank you for your application to Rwamagana Leaders' School.<br>
               We will review your submission and contact you within 5–7 business days.</p>
            <button onclick="resetAdmissionsForm()" class="btn btn-outline">Submit Another Application</button>
        </div>
    `;
    formContainer.innerHTML = successHTML;
}

// Reset form after success
function resetAdmissionsForm() {
    location.reload();
}

// Simple notification popup
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#fff',
        background: type === 'error' ? '#e74c3c' : '#2ecc71',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        zIndex: '1000',
        transition: 'opacity 0.3s'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}


function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary);
        color: var(--primary-foreground);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px var(--shadow);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}


// Smooth scrolling for internal links
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && isMobileMenuOpen) {
        closeMobileMenu();
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Close mobile menu on Escape
    if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Navigation shortcuts (Alt + number)
    if (event.altKey && event.key >= '1' && event.key <= '7') {
        event.preventDefault();
        const pages = ['home', 'about', 'academics', 'admissions', 'gallery', 'news', 'contact'];
        const pageIndex = parseInt(event.key) - 1;
        if (pages[pageIndex]) {
            navigateTo(pages[pageIndex]);
        }
    }
});

// Initialize URL-based navigation
function initializeURLNavigation() {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'about', 'academics', 'admissions', 'gallery', 'news', 'contact'].includes(hash)) {
        navigateTo(hash, false);
    }
}

// Call URL navigation after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeURLNavigation);

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Add custom CSS for notifications
const notificationStyles = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// ------------------ GALLERY MANAGEMENT ------------------

let currentLightboxIndex = 0;

// ------------------ FILTERING ------------------
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        filterGallery(category);
    });
});

function filterGallery(category) {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (category === "all" || itemCategory === category) {
            item.style.display = "block";
            item.style.animation = "fadeIn 0.5s ease-out";
        } else {
            item.style.display = "none";
        }
    });
}

// ------------------ LIGHTBOX ------------------
function attachGalleryClickEvents() {
    const galleryContainer = document.getElementById("gallery-grid");

    // Event delegation for dynamically loaded items
    galleryContainer.addEventListener("click", function(e) {
        const item = e.target.closest(".gallery-item");
        if (!item) return;

        const visibleItems = [...document.querySelectorAll(".gallery-item")].filter(i => i.style.display !== "none");
        const index = visibleItems.indexOf(item);
        openLightbox(index);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxCategory = document.getElementById("lightbox-category");

    const visibleItems = [...document.querySelectorAll(".gallery-item")].filter(i => i.style.display !== "none");
    if (!visibleItems[index]) return;

    currentLightboxIndex = index;

    const img = visibleItems[index].querySelector("img");
    const title = visibleItems[index].querySelector("h3")?.textContent || img.alt;
    const paragraph = visibleItems[index].querySelector("p")?.textContent || "";
    const category = visibleItems[index].getAttribute("data-category");
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;

    // Set download link for the currently viewed image
    const downloadLink = document.getElementById('lightbox-download');
    if (downloadLink) {
        try {
            const imageUrl = img.src;
            downloadLink.href = imageUrl;
            // derive filename from URL
            const urlObj = new URL(imageUrl, window.location.href);
            let filename = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1) || 'image.jpg';
            // fallback to title if filename is empty
            if (!filename || filename === '/') filename = (title || 'image').replace(/\s+/g, '_') + '.jpg';
            downloadLink.setAttribute('download', filename);
            downloadLink.style.display = 'inline-block';

            // Attach a click handler to force a download via fetch -> blob
            downloadLink.onclick = async function(e) {
                e.preventDefault();
                try {
                    const resp = await fetch(imageUrl, { mode: 'cors' });
                    if (!resp.ok) throw new Error('Network response was not ok');
                    const blob = await resp.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(blobUrl);
                    showNotification('Download started');
                } catch (err) {
                    // Fallback: open image in a new tab so user can save it manually
                    showNotification('Automatic download failed; opening image in new tab.');
                    window.open(imageUrl, '_blank', 'noopener');
                }
            };
        } catch (err) {
            downloadLink.style.display = 'none';
        }
    }

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("active");
    // hide download link when closing
    const downloadLink = document.getElementById('lightbox-download');
    if (downloadLink) downloadLink.style.display = 'none';
    
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

function navigateLightbox(direction) {
    const visibleItems = [...document.querySelectorAll(".gallery-item")].filter(i => i.style.display !== "none");
    let newIndex = currentLightboxIndex + direction;

    if (newIndex < 0) newIndex = visibleItems.length - 1;
    if (newIndex >= visibleItems.length) newIndex = 0;

    openLightbox(newIndex);
}

// ------------------ LIGHTBOX CONTROLS ------------------
const lightbox = document.getElementById("lightbox");
if (lightbox) {
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev")?.addEventListener("click", () => navigateLightbox(-1));
    lightbox.querySelector(".lightbox-next")?.addEventListener("click", () => navigateLightbox(1));

    // Close lightbox by clicking outside
    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") navigateLightbox(-1);
        if (e.key === "ArrowRight") navigateLightbox(1);
    });
}

// ------------------ INITIALIZE ------------------
// Call this after Firebase loads gallery items
attachGalleryClickEvents();

// Academics Page Tabs
function initializeAcademicsTabs() {
    const gradeTabs = document.querySelectorAll('.grade-tab');
    const gradeContents = document.querySelectorAll('.grade-content');
    
    if (!gradeTabs.length || !gradeContents.length) return;
    
    gradeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const gradeLevel = this.getAttribute('data-grade');
            
            // Update active tab
            gradeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            gradeContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === gradeLevel) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Export functions for global access (if needed)
window.navigateTo = navigateTo;
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.resetAdmissionsForm = resetAdmissionsForm;

// ------------------ LIVE SEARCH (reusable) ------------------
// Usage: add an input element with attribute `data-live-search`.
// Optionally set the attribute value to a comma-separated list of selectors
// (e.g. `data-live-search=".news-item, .event-item"`). Defaults to both selectors.
function createLiveSearch(inputSelector, defaultSelectors = '.news-item, .event-item') {
    const inputs = document.querySelectorAll(inputSelector);
    if (!inputs.length) return;

    inputs.forEach(input => {
        const targetAttr = input.getAttribute('data-live-search') || defaultSelectors;
        const selectors = targetAttr.split(',').map(s => s.trim()).filter(Boolean).join(', ');

        const noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.textContent = 'No results found';
        noResults.style.display = 'none';
        input.insertAdjacentElement('afterend', noResults);

        function runFilter() {
            const q = input.value.trim().toLowerCase();
            const items = document.querySelectorAll(selectors);
            let visible = 0;

            items.forEach(item => {
                const text = (item.textContent || '').replace(/\s+/g, ' ').toLowerCase();
                const match = q === '' || text.indexOf(q) !== -1;
                item.style.display = match ? '' : 'none';
                if (match) visible++;
            });

            noResults.style.display = visible ? 'none' : '';
        }

        input.addEventListener('keyup', runFilter);
        input.addEventListener('input', runFilter);
    });
}

// Auto-attach to inputs carrying `data-live-search` after DOM ready
document.addEventListener('DOMContentLoaded', function() {
    createLiveSearch('input[data-live-search]');
});

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => { preloader.style.display = 'none'; }, 400);
}

window.addEventListener('load', () => setTimeout(hidePreloader, 3000));
document.addEventListener("DOMContentLoaded", () => {
  const contextMenu = document.getElementById("custom-context-menu");
  const btnCopy = document.getElementById("menu-copy");
  const btnRefresh = document.getElementById("menu-refresh");
  const btnExit = document.getElementById("menu-exit");
  

  if (!contextMenu) return;

  // Variable to temporarily store selected text before it gets deselected
  let textToCopy = "";

  // 1. Show context menu and capture selected text
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // CAPTURE SELECTED TEXT:
    const activeElement = document.activeElement;
    
    // Check if right-clicking inside an input/textarea
    if (
      activeElement && 
      (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
    ) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      textToCopy = activeElement.value.substring(start, end);
    } else {
      // Normal highlighted text on the page
      textToCopy = window.getSelection().toString();
    }

    // Show menu first to compute true size
    contextMenu.style.display = "block";

    let mouseX = event.clientX;
    let mouseY = event.clientY;

    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Boundary checks
    if (mouseX + menuWidth > windowWidth) {
      mouseX = windowWidth - menuWidth - 5;
    }
    if (mouseY + menuHeight > windowHeight) {
      mouseY = windowHeight - menuHeight - 5;
    }

    contextMenu.style.left = `${mouseX}px`;
    contextMenu.style.top = `${mouseY}px`;
  });

  // 2. Hide context menu on left click
  document.addEventListener("click", () => {
    contextMenu.style.display = "none";
  });

  // --- ACTIONS ---

  // COPY ACTION
  btnCopy?.addEventListener("click", async () => {
    contextMenu.style.display = "none";

    // Clean text string
    const trimmedText = textToCopy.trim();

    if (trimmedText) {
      try {
        await navigator.clipboard.writeText(trimmedText);
        console.log("Copied to clipboard:", trimmedText);
      } catch (err) {
        // Fallback for older browsers or restricted security contexts
        const textarea = document.createElement("textarea");
        textarea.value = trimmedText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } else {
      alert("No text highlighted to copy!");
    }
  });

  // REFRESH ACTION
  btnRefresh?.addEventListener("click", () => {
    window.location.reload();
  });

  // EXIT PAGE ACTION
  btnExit?.addEventListener("click", () => {
    window.close();
    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 100);
  });
});
document.addEventListener("keydown", (event) => {
  // Check if the pressed key is F1 through F12
  if (event.key >= "F1" && event.key <= "F12") {
    event.preventDefault(); // Block standard browser functions (Help, DevTools, Refresh, etc.)
    event.stopPropagation();
    console.log(`Blocked key: ${event.key}`);
  }
});
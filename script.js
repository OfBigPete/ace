// ================================
// INITIALIZATION & DOM ELEMENTS
// ================================

// EmailJS Configuration
// 1. Sign up at https://www.emailjs.com
// 2. Get your Public Key from Account > API Keys
// 3. Replace 'YOUR_PUBLIC_KEY' below with your actual key
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your template ID

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigationScrollDetection();
    setupMobileMenu();
    setupScrollToTop();
    setupScrollRevealAnimation();
    setupBookingForm();
    setupDatePicker();
    setupContactForm();
    removeLoadingScreen();
}

// ================================
// LOADING SCREEN
// ================================
function removeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2400);
}

// ================================
// NAVIGATION
// ================================
function setupNavigationScrollDetection() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar with shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        }

        // Update active nav link based on scroll position
        updateActiveNavLink(navLinks);
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                closeMobileMenu();

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

function updateActiveNavLink(navLinks) {
    let current = '';

    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 200) {
                current = link.getAttribute('href');
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });
}

// ================================
// MOBILE MENU
// ================================
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ================================
// SCROLL REVEAL ANIMATION
// ================================
function setupScrollRevealAnimation() {
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.style.animationPlayState = 'running';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

// ================================
// SCROLL TO TOP BUTTON
// ================================
function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// DATE PICKER SETUP
// ================================
function setupDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date();
    
    // Set minimum date to today
    const minDate = formatDateForInput(today);
    dateInput.setAttribute('min', minDate);
    
    // Set maximum date to 3 months ahead
    const maxDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
    dateInput.setAttribute('max', formatDateForInput(maxDate));
    
    // Disable Sundays and already booked dates
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        
        // Check if it's a Sunday (0 = Sunday)
        if (selectedDate.getDay() === 0) {
            alert('Sorry, we are closed on Sundays. Please select another date.');
            this.value = '';
            return;
        }
        
        updateAvailableTimeSlots();
    });
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ================================
// BOOKING FORM & FUNCTIONALITY
// ================================
function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            phone: document.getElementById('clientPhone').value,
            service: document.getElementById('service').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            deposit: document.getElementById('depositAmount').value,
            notes: document.getElementById('notes').value
        };

        // Validate form
        if (!validateBookingForm(formData)) {
            return;
        }

        // Check for double booking
        if (isTimeSlotBooked(formData.date, formData.time)) {
            alert('This time slot is already booked. Please select another time.');
            return;
        }

        // Save booking to localStorage
        saveBooking(formData);

        // Send emails via EmailJS
        sendBookingEmails(formData);

        // Show confirmation
        showBookingConfirmation(formData);

        // Reset form
        bookingForm.reset();
        document.getElementById('depositAmount').value = '£25';
        updateAvailableTimeSlots();
    });
}

function validateBookingForm(formData) {
    // Validate phone - UK format (simple validation)
    const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$|^\d{10,11}$/;
    
    if (!formData.phone) {
        alert('Please enter a phone number');
        return false;
    }

    if (formData.phone.replace(/\s/g, '').length < 10) {
        alert('Please enter a valid phone number');
        return false;
    }

    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Check all required fields
    if (!formData.name || !formData.service || !formData.date || !formData.time) {
        alert('Please fill in all required fields');
        return false;
    }

    return true;
}

function saveBooking(formData) {
    // Get existing bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem('aceOfBraidsBookings')) || [];

    // Create booking object with unique ID
    const booking = {
        id: Date.now(),
        ...formData,
        bookedAt: new Date().toISOString()
    };

    // Add to bookings array
    bookings.push(booking);

    // Save to localStorage
    localStorage.setItem('aceOfBraidsBookings', JSON.stringify(bookings));

    // Log confirmation
    console.log('Booking saved:', booking);
}

function isTimeSlotBooked(date, time) {
    const bookings = JSON.parse(localStorage.getItem('aceOfBraidsBookings')) || [];
    return bookings.some(booking => booking.date === date && booking.time === time);
}

function updateAvailableTimeSlots() {
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    const selectedDate = dateInput.value;

    if (!selectedDate) return;

    // Get all booked times for selected date
    const bookings = JSON.parse(localStorage.getItem('aceOfBraidsBookings')) || [];
    const bookedTimes = bookings
        .filter(booking => booking.date === selectedDate)
        .map(booking => booking.time);

    // Update time slot availability
    const timeOptions = timeSelect.querySelectorAll('option');
    timeOptions.forEach(option => {
        if (option.value && bookedTimes.includes(option.value)) {
            option.disabled = true;
            option.textContent += ' (Booked)';
        } else if (option.value) {
            option.disabled = false;
        }
    });
}

function showBookingConfirmation(formData) {
    const modal = document.getElementById('confirmationModal');
    const message = document.getElementById('confirmationMessage');
    const details = document.getElementById('confirmationDetails');

    // Format date
    const dateObj = new Date(formData.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    message.textContent = `Thank you, ${formData.name}! Your booking has been confirmed.`;

    details.innerHTML = `
        <p><strong>Service:</strong> ${formData.service}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formData.time}</p>
        <p><strong>Deposit Required:</strong> ${formData.deposit}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.notes ? `<p><strong>Notes:</strong> ${formData.notes}</p>` : ''}
        <p style="margin-top: 1rem; font-style: italic; color: #666;">A confirmation email will be sent to you shortly.</p>
    `;

    modal.classList.add('active');

    // Close modal on button click
    document.getElementById('closeModal').onclick = function() {
        modal.classList.remove('active');
    };

    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// ================================
// DEPOSIT CALCULATION
// ================================
function setupDepositCalculation() {
    const serviceSelect = document.getElementById('service');
    const depositInput = document.getElementById('depositAmount');

    if (!serviceSelect || !depositInput) {
        console.error('Deposit elements not found!');
        return;
    }

    // Calculate deposit when service changes
    serviceSelect.addEventListener('change', function() {
        const selectedService = this.value;
        
        if (!selectedService) {
            depositInput.value = '';
            return;
        }

        // Extract price range from service option (e.g., "Box Braids - £60-120")
        const priceMatch = selectedService.match(/£(\d+)-£(\d+)/);
        
        if (priceMatch) {
            const minPrice = parseInt(priceMatch[1]);
            const maxPrice = parseInt(priceMatch[2]);
            const avgPrice = (minPrice + maxPrice) / 2;
            const deposit = Math.round(avgPrice * 0.2); // 20% deposit

            depositInput.value = `£${deposit}`;
        }
    });
}

// ================================
// CONTACT FORM
// ================================
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
        const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
        const message = contactForm.querySelector('textarea[placeholder="Your Message"]').value;

        // Validate
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // In a real application, this would send to a server
        // For now, we'll just show a success message
        const formMessage = document.createElement('div');
        formMessage.style.cssText = `
            background-color: #27ae60;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            animation: slideUp 0.5s ease-out;
        `;
        formMessage.textContent = 'Thank you! We\'ll get back to you shortly.';

        contactForm.parentNode.insertBefore(formMessage, contactForm);

        // Reset form
        contactForm.reset();

        // Remove message after 3 seconds
        setTimeout(() => {
            formMessage.remove();
        }, 3000);

        console.log('Contact message:', { name, email, message });
    });
}

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Get all bookings from localStorage
 */
function getAllBookings() {
    return JSON.parse(localStorage.getItem('aceOfBraidsBookings')) || [];
}

/**
 * Send booking confirmation emails via EmailJS
 */
function sendBookingEmails(formData) {
    // Format the appointment date
    const dateObj = new Date(formData.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Email data for admin notification
    const adminEmailData = {
        to_email: 'aceofbraids@example.com', // Replace with actual email
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        service: formData.service,
        appointment_date: formattedDate,
        appointment_time: formData.time,
        deposit: formData.deposit,
        notes: formData.notes || 'No additional notes'
    };

    // Email data for customer confirmation
    const customerEmailData = {
        to_email: formData.email,
        client_name: formData.name,
        service: formData.service,
        appointment_date: formattedDate,
        appointment_time: formData.time,
        deposit: formData.deposit,
        business_email: 'aceofbraids@example.com' // Replace with actual email
    };

    // Send admin notification
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, adminEmailData)
            .then((response) => {
                console.log('Admin email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Failed to send admin email:', error);
                // Don't break the booking even if email fails
            });

        // Send customer confirmation
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, customerEmailData)
            .then((response) => {
                console.log('Customer confirmation email sent:', response);
            })
            .catch((error) => {
                console.error('Failed to send customer email:', error);
                // Don't break the booking even if email fails
            });
    } else {
        console.warn('EmailJS not configured. Please set up your EmailJS credentials.');
    }
}

/**
 * Clear all bookings from localStorage (for testing)
 */
function clearAllBookings() {
    localStorage.removeItem('aceOfBraidsBookings');
    console.log('All bookings cleared');
}

/**
 * Get bookings for a specific date
 */
function getBookingsForDate(date) {
    const allBookings = getAllBookings();
    return allBookings.filter(booking => booking.date === date);
}

/**
 * Cancel a booking by ID
 */
function cancelBooking(bookingId) {
    let bookings = getAllBookings();
    bookings = bookings.filter(booking => booking.id !== bookingId);
    localStorage.setItem('aceOfBraidsBookings', JSON.stringify(bookings));
    console.log('Booking cancelled:', bookingId);
}

// ================================
// PERFORMANCE & OPTIMIZATION
// ================================

// Lazy load images if implemented in future
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.classList.add('loaded');
                observer.unobserve(image);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ================================
// DEBUGGING FUNCTIONS
// ================================

// Log booking system info to console
function getBookingSystemInfo() {
    const bookings = getAllBookings();
    return {
        totalBookings: bookings.length,
        bookings: bookings,
        availableTimeSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
        services: [
            'Box Braids - £60-120',
            'Cornrows - £50-100',
            'Goddess Braids - £80-150',
            'Wig Styling - £40-80',
            'Kilo Braids - £70-130',
            'Crochet Braids - £45-90'
        ]
    };
}

console.log('Ace of Braids booking system initialized');
console.log('Tip: Use getBookingSystemInfo() to see all bookings');
console.log('Tip: Use clearAllBookings() to reset the system');

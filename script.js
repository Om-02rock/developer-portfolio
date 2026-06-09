// Main interactions for Om Narayan Gupta's Developer Portfolio

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggler
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navLinksWrapper.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksWrapper.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 2. Active Section Spy on Scroll (Intersection Observer)
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // 3. Header Styling on Scroll
    const header = document.querySelector('.navbar-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(6, 7, 19, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            header.style.height = '70px';
        } else {
            header.style.background = 'rgba(6, 7, 19, 0.8)';
            header.style.boxShadow = 'none';
            header.style.height = '80px';
        }
    });

    // 4. Interactive Project Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade-out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Trigger reflow for fade-in animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // Contact Form Validation and submission handler
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit-form');
    const formStatus = document.getElementById('form-status');

    // Helper for validation check
    const validateField = (inputEl, errorEl) => {
        let isValid = true;
        const groupEl = inputEl.parentElement;

        if (!inputEl.value.trim()) {
            isValid = false;
        } else if (inputEl.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(inputEl.value.trim())) {
                isValid = false;
            }
        }

        if (isValid) {
            groupEl.classList.remove('error');
        } else {
            groupEl.classList.add('error');
        }

        return isValid;
    };

    // Remove error class on focus/input
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('error');
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');

        const isNameValid = validateField(nameInput, document.getElementById('error-name'));
        const isEmailValid = validateField(emailInput, document.getElementById('error-email'));
        const isSubjectValid = validateField(subjectInput, document.getElementById('error-subject'));
        const isMessageValid = validateField(messageInput, document.getElementById('error-message-field'));

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Form is valid: Send message
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            fetch("https://formsubmit.co/ajax/omnarayangupta98@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Oops! There was a problem sending your message. Please try again.';
            });
        } else {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please correct the highlighted errors before submitting.';
        }
    });
});

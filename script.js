// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', function () {
    navLinks.classList.toggle('mobile-open');
    this.classList.toggle('active');
});

// Add mobile menu styles dynamically
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: var(--bg-primary);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            border-right: 1px solid var(--border-color);
        }
        .nav-links.mobile-open {
            left: 0;
        }
        .nav-links li {
            margin: 1rem 0;
        }
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const closeModal = document.getElementById('close-modal');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields!');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    simulateFormSubmission(name, email, subject, message);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(name, email, subject, message) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        contactForm.reset();
        successModal.style.display = 'block';

        console.log('Form Submitted:', {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });
    }, 2000);
}

// Success Modal Close
closeModal.addEventListener('click', function () {
    successModal.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Collab Modal Functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = contactSection.offsetTop - navbarHeight;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Resume Download
function downloadResume() {
    const resumeContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Name - Resume</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 25px; }
                .section h2 { color: #6c5ce7; border-bottom: 2px solid #6c5ce7; padding-bottom: 5px; }
                .contact-info { display: flex; justify-content: center; gap: 20px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Praw Jaiswal</h1>
                <p>Web Developer & Music Enthusiast</p>
                <div class="contact-info">
                    <span>📧 praw.jaiswal@example.com</span>
                    <span>📱 +977-9841234567</span>
                    <span>📍 Kathmandu, Nepal</span>
                </div>
            </div>
            <div class="section">
                <h2>Summary</h2>
                <p>Dedicated CSIT student with a strong foundation in computer science and 1 month of intensive web development learning. Passionate about creating innovative web solutions with excellent problem-solving skills and attention to detail.</p>
            </div>
            <div class="section">
                <h2>Technical Skills</h2>
                <ul>
                    <li>HTML5 - Semantic markup and modern features</li>
                    <li>CSS3 - Responsive design and modern techniques</li>
                    <li>JavaScript - Interactive functionality and DOM manipulation</li>
                    <li>C Programming - Strong foundation in programming fundamentals</li>
                </ul>
            </div>
            <div class="section">
                <h2>Additional Skills</h2>
                <ul>
                    <li>Problem Solving and Analytical Thinking</li>
                    <li>Music and Creative Expression</li>
                    <li>Quick Learning and Adaptability</li>
                    <li>Attention to Detail</li>
                    <li>Creative Problem Solving</li>
                    <li>Attention to Detail</li>
                </ul>
            </div>
            <div class="section">
                <h2>Education</h2>
                <p><strong>Bachelor in Computer Science and Information Technology (CSIT)</strong><br>
                Tribhuvan University - Currently Pursuing</p>
                <p><strong>Higher Secondary Education - Science</strong><br>
                Kathmandu Model College (2019-2021)</p>
                <p><strong>Web Development</strong> - Self-taught (2024 to Present)</p>
            </div>
            <div class="section">
                <h2>Projects</h2>
                <p><strong>Music-Themed Personal Portfolio</strong><br>
                Developed a responsive portfolio website using HTML, CSS, and JavaScript featuring dark/light theme toggle, smooth animations, and modern design principles.</p>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([resumeContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Your_Name_Resume.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Resume downloaded! 📄');
}

// Navbar Background on Scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 50) {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'light'
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(10, 10, 15, 0.98)';
    } else {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'light'
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(10, 10, 15, 0.95)';
    }
});

// Music Easter Egg - Konami Code
document.addEventListener('keydown', function (e) {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.querySelectorAll('.music-note, .note').forEach(note => {
                note.style.animation = 'float 0.5s ease-in-out infinite';
            });
            alert('🎵 Music mode activated! 🎵');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Page Load Animation
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    const vinylRecord = document.querySelector('.vinyl-record');
    if (vinylRecord) {
        vinylRecord.style.animationPlayState = 'running';
    }
});

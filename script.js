// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Hamburger animation
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to reservation section
function scrollToReservation() {
    document.getElementById('reservation').scrollIntoView({
        behavior: 'smooth'
    });
}

// Reservation Form Logic
const reservationForm = document.getElementById('reservationForm');
const roomTypeSelect = document.getElementById('roomType');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const totalPriceElement = document.getElementById('totalPrice');

// Room prices
const roomPrices = {
    'standard': 80000,
    'deluxe': 120000,
    'premium': 180000
};

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
checkInInput.min = today;
checkOutInput.min = today;

// Update checkout minimum date when check-in changes
checkInInput.addEventListener('change', function() {
    const checkInDate = new Date(this.value);
    checkInDate.setDate(checkInDate.getDate() + 1);
    checkOutInput.min = checkInDate.toISOString().split('T')[0];
    calculateTotalPrice();
});

// Calculate total price
function calculateTotalPrice() {
    const roomType = roomTypeSelect.value;
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    
    if (roomType && checkInInput.value && checkOutInput.value && checkOutDate > checkInDate) {
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const roomPrice = roomPrices[roomType];
        const totalPrice = roomPrice * nights;
        
        totalPriceElement.textContent = totalPrice.toLocaleString() + '원';
        
        // Show nights calculation
        const priceDetails = document.querySelector('.price-details');
        priceDetails.innerHTML = `
            <div style="margin-bottom: 10px;">
                <span>${roomTypeSelect.options[roomTypeSelect.selectedIndex].text} × ${nights}박</span>
            </div>
            <span>총 금액: <strong>${totalPrice.toLocaleString()}원</strong></span>
        `;
    } else {
        totalPriceElement.textContent = '0원';
    }
}

// Add event listeners for price calculation
roomTypeSelect.addEventListener('change', calculateTotalPrice);
checkOutInput.addEventListener('change', calculateTotalPrice);

// Form submission
reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const reservationData = {};
    
    for (let [key, value] of formData.entries()) {
        reservationData[key] = value;
    }
    
    // Validate dates
    const checkIn = new Date(reservationData.checkIn);
    const checkOut = new Date(reservationData.checkOut);
    
    if (checkOut <= checkIn) {
        alert('체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.');
        return;
    }
    
    // Calculate nights and total price
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const roomPrice = roomPrices[reservationData.roomType];
    const totalPrice = roomPrice * nights;
    
    // Show confirmation
    const confirmMessage = `
예약 정보를 확인해주세요:

📅 체크인: ${reservationData.checkIn}
📅 체크아웃: ${reservationData.checkOut}
🏠 객실: ${document.querySelector('#roomType option:checked').textContent}
👥 인원: ${reservationData.guests}명
🐕 반려동물: ${document.querySelector('#petType option:checked').textContent} ${reservationData.petCount}마리
👤 예약자: ${reservationData.customerName}
📞 연락처: ${reservationData.phone}
✉️ 이메일: ${reservationData.email}

💰 총 금액: ${totalPrice.toLocaleString()}원 (${nights}박)

예약을 진행하시겠습니까?
    `;
    
    if (confirm(confirmMessage)) {
        // In a real application, this would send data to a server
        alert(`예약이 접수되었습니다!\n\n담당자가 24시간 내에 연락드리겠습니다.\n예약번호: PET${Date.now()}`);
        
        // Reset form
        this.reset();
        totalPriceElement.textContent = '0원';
        document.querySelector('.price-details').innerHTML = '<span>총 금액: <strong id="totalPrice">0원</strong></span>';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.room-card, .facility-item, .contact-item');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Pet type validation based on room type
const petTypeSelect = document.getElementById('petType');

roomTypeSelect.addEventListener('change', function() {
    const roomType = this.value;
    const petTypeOptions = petTypeSelect.querySelectorAll('option');
    
    // Reset all options
    petTypeOptions.forEach(option => {
        option.style.display = 'block';
        option.disabled = false;
    });
    
    // Apply restrictions based on room type
    if (roomType === 'standard') {
        // Standard room: only small dogs
        petTypeOptions.forEach(option => {
            if (option.value === 'medium' || option.value === 'large') {
                option.style.display = 'none';
                option.disabled = true;
            }
        });
        if (petTypeSelect.value === 'medium' || petTypeSelect.value === 'large') {
            petTypeSelect.value = '';
        }
    } else if (roomType === 'deluxe') {
        // Deluxe room: small and medium dogs
        petTypeOptions.forEach(option => {
            if (option.value === 'large') {
                option.style.display = 'none';
                option.disabled = true;
            }
        });
        if (petTypeSelect.value === 'large') {
            petTypeSelect.value = '';
        }
    }
    // Premium room: all sizes allowed (no restrictions)
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 3 && value.length <= 7) {
        value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    } else if (value.length > 7) {
        value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
    }
    
    e.target.value = value;
});

// Email validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.setCustomValidity('올바른 이메일 주소를 입력해주세요.');
    } else {
        this.setCustomValidity('');
    }
});

// Add loading animation for form submission
function showLoading() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = '처리 중...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Enhanced hamburger animation
hamburger.addEventListener('click', () => {
    const spans = hamburger.querySelectorAll('span');
    
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Back to top button
const backToTop = document.createElement('button');
backToTop.innerHTML = '↑';
backToTop.className = 'back-to-top';
backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #2c5530;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    z-index: 1000;
`;

document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Add hover effects for interactive elements
document.querySelectorAll('.room-card, .facility-item, .contact-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
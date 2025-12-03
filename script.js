// script.js
// ================================
// ENHANCED ALERT SYSTEM
// ================================

class EnhancedAlertSystem {
    constructor() {
        this.container = this.createAlertContainer();
        this.alerts = new Map();
        this.alertCounter = 0;
        this.currentAlert = null;
    }

    createAlertContainer() {
        const container = document.createElement('div');
        container.className = 'alert-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'error', duration = 4000) {
        // Clear existing alert if any
        if (this.currentAlert) {
            this.dismiss(this.currentAlert);
        }
        
        const alertId = `alert-${Date.now()}-${this.alertCounter++}`;
        
        const alert = this.createAlertElement(alertId, message, type);
        this.container.appendChild(alert);
        this.alerts.set(alertId, { element: alert, timeoutId: null });
        this.currentAlert = alertId;

        // Animate in
        setTimeout(() => {
            alert.style.opacity = '1';
            alert.style.transform = 'translateX(0)';
        }, 10);

        // Auto dismiss after duration
        if (duration > 0) {
            const timeoutId = setTimeout(() => {
                this.dismiss(alertId);
            }, duration);
            
            this.alerts.get(alertId).timeoutId = timeoutId;
            
            // Add progress bar
            const progressBar = this.createProgressBar(duration);
            alert.appendChild(progressBar);
        }

        return alertId;
    }

    createAlertElement(id, message, type) {
        const alert = document.createElement('div');
        alert.className = `alert-system-alert alert-system-alert-${type}`;
        alert.id = id;
        alert.setAttribute('role', 'alert');
        alert.setAttribute('aria-live', 'assertive');
        alert.setAttribute('aria-atomic', 'true');

        const icon = this.getIconForType(type);
        
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon" aria-hidden="true">${icon}</span>
                <span class="alert-message">${message}</span>
            </div>
            <button class="alert-close" aria-label="Close alert">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        `;

        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => this.dismiss(id));

        // Keyboard navigation
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.dismiss(id);
            }
        });

        return alert;
    }

    createProgressBar(duration) {
        const progressBar = document.createElement('div');
        progressBar.className = 'alert-progress';
        progressBar.style.animationDuration = `${duration}ms`;
        return progressBar;
    }

    getIconForType(type) {
        const icons = {
            'error': '<i class="fas fa-times-circle"></i>',
            'success': '<i class="fas fa-check-circle"></i>',
            'warning': '<i class="fas fa-exclamation-triangle"></i>',
            'info': '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    dismiss(alertId) {
        const alertData = this.alerts.get(alertId);
        if (!alertData) return;

        const { element, timeoutId } = alertData;
        
        // Clear timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Animate out
        element.classList.add('fade-out');
        
        // Remove after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.alerts.delete(alertId);
            if (this.currentAlert === alertId) {
                this.currentAlert = null;
            }
        }, 300);
    }

    clearAll() {
        for (const alertId of this.alerts.keys()) {
            this.dismiss(alertId);
        }
    }
}

// Initialize enhanced alert system
const alertSystem = new EnhancedAlertSystem();

// Global function to show alert
function showAlert(message, type = 'error', duration = 4000) {
    return alertSystem.show(message, type, duration);
}

// ================================
// GLOBAL VARIABLES & INITIALIZATION
// ================================

let currentLang = 'id';

// Mapping jarak antar kota di Provinsi Yogyakarta
const jarakKota = {
    "Kota Yogyakarta": { "Kota Yogyakarta": 10, "Sleman": 15, "Bantul": 25, "Gunungkidul": 45, "Kulonprogo": 35 },
    "Sleman": { "Kota Yogyakarta": 15, "Sleman": 10, "Bantul": 30, "Gunungkidul": 50, "Kulonprogo": 40 },
    "Bantul": { "Kota Yogyakarta": 25, "Sleman": 30, "Bantul": 10, "Gunungkidul": 45, "Kulonprogo": 50 },
    "Gunungkidul": { "Kota Yogyakarta": 45, "Sleman": 50, "Bantul": 45, "Gunungkidul": 10, "Kulonprogo": 60 },
    "Kulonprogo": { "Kota Yogyakarta": 35, "Sleman": 40, "Bantul": 50, "Gunungkidul": 60, "Kulonprogo": 10 }
};

// ================================
// FORM VALIDATION FUNCTIONS
// ================================

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;
    let isValid = true;
    let errorMessage = '';

    // Reset field style
    field.classList.remove('error', 'success');
    
    // Check if empty
    if (!value) {
        isValid = false;
        if (field.tagName === 'SELECT') {
            errorMessage = currentLang === 'id' ? 'Pilih kota asal dan tujuan terlebih dahulu' : 'Please select origin and destination cities first';
        } else if (fieldName === 'beratPaket') {
            errorMessage = currentLang === 'id' ? 'Masukkan berat paket minimal 1 kg' : 'Please enter package weight minimum 1 kg';
        } else if (fieldName === 'nama') {
            errorMessage = currentLang === 'id' ? 'Masukkan nama lengkap Anda' : 'Please enter your full name';
        } else if (fieldName === 'whatsapp') {
            errorMessage = currentLang === 'id' ? 'Masukkan nomor WhatsApp yang valid' : 'Please enter a valid WhatsApp number';
        } else if (fieldName === 'pesan') {
            errorMessage = currentLang === 'id' ? 'Masukkan pesan Anda' : 'Please enter your message';
        } else {
            errorMessage = currentLang === 'id' ? 'Isi data yang diperlukan' : 'Please fill in the required data';
        }
        field.classList.add('error');
    } 
    // Check for specific validations
    else if (fieldName === 'beratPaket') {
        const weight = parseFloat(value);
        if (isNaN(weight) || weight < 1) {
            isValid = false;
            errorMessage = currentLang === 'id' ? 'Berat paket minimal 1 kg' : 'Minimum package weight is 1 kg';
            field.classList.add('error');
        } else {
            field.classList.add('success');
        }
    } 
    // Check for whatsapp validation - only numbers
    else if (fieldName === 'whatsapp') {
        const whatsappRegex = /^[0-9]+$/;
        if (!whatsappRegex.test(value)) {
            isValid = false;
            errorMessage = currentLang === 'id' ? 'Nomor WhatsApp hanya boleh berisi angka' : 'WhatsApp number must contain only numbers';
            field.classList.add('error');
        } else if (value.length < 10 || value.length > 13) {
            isValid = false;
            errorMessage = currentLang === 'id' ? 'Nomor WhatsApp harus 10-13 digit' : 'WhatsApp number must be 10-13 digits';
            field.classList.add('error');
        } else {
            field.classList.add('success');
        }
    }
    // Check for message length
    else if (fieldName === 'pesan' && value.length > 500) {
        isValid = false;
        errorMessage = currentLang === 'id'
            ? 'Pesan maksimal 500 karakter'
            : 'Message cannot exceed 500 characters';
        field.classList.add('error');
    }
    else {
        field.classList.add('success');
    }

    return { isValid, errorMessage };
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    let firstErrorField = null;
    let errorMessages = [];

    // Clear all alerts first
    alertSystem.clearAll();

    // Validate each field
    fields.forEach(field => {
        const validation = validateField(field);
        if (!validation.isValid) {
            isValid = false;
            if (!firstErrorField) {
                firstErrorField = field;
            }
            // Collect error messages
            if (!errorMessages.includes(validation.errorMessage)) {
                errorMessages.push(validation.errorMessage);
            }
        }
    });

    // Show all error messages
    if (errorMessages.length > 0) {
        // Show first error message
        showAlert(errorMessages[0], 'error');
        
        // If there are more errors, show additional alert after 500ms
        if (errorMessages.length > 1) {
            setTimeout(() => {
                showAlert(currentLang === 'id' ? 'Silakan isi semua form terlebih dahulu' : 'Please fill out all required fields', 'error', 3000);
            }, 500);
        }
    }

    // Focus on first error field
    if (firstErrorField) {
        firstErrorField.focus();
    }

    return isValid;
}

// ================================
// EVENT LISTENERS & HANDLERS
// ================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Swift Jogja Delivery Website Loaded');
    disableHTML5Validation();
    initializeEventListeners();
    initializeInputRestrictions();
});

function disableHTML5Validation() {
    // Disable HTML5 validation for all forms immediately
    document.querySelectorAll('form').forEach(form => {
        form.setAttribute('novalidate', 'novalidate');
    });
    
    // Also observe for dynamically added forms
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'FORM') {
                    node.setAttribute('novalidate', 'novalidate');
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

function initializeEventListeners() {
    // Form cek ongkir
    const ongkirForm = document.getElementById('ongkirForm');
    if (ongkirForm) {
        // Disable HTML5 validation
        ongkirForm.setAttribute('novalidate', 'novalidate');
        ongkirForm.addEventListener('submit', handleOngkirSubmit);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Disable HTML5 validation
        contactForm.setAttribute('novalidate', 'novalidate');
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Character counter for message
    const pesanTextarea = document.getElementById('pesan');
    const charCountElement = document.getElementById('charCount');
    if (pesanTextarea && charCountElement) {
        pesanTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCountElement.textContent = length;
            
            // Update styling
            const charCounter = document.querySelector('.char-counter');
            if (charCounter) {
                if (length > 500) {
                    charCounter.classList.add('error');
                    charCounter.classList.remove('warning');
                } else if (length > 450) {
                    charCounter.classList.remove('error');
                    charCounter.classList.add('warning');
                } else {
                    charCounter.classList.remove('error', 'warning');
                }
            }
        });
    }
}

function initializeInputRestrictions() {
    // Disable HTML5 validation messages for all forms
    document.querySelectorAll('form').forEach(form => {
        form.setAttribute('novalidate', 'novalidate');
    });

    // Prevent HTML5 validation on all input fields
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            return false;
        });
    });

    // Restrict whatsapp input to numbers only
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function() {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        whatsappInput.addEventListener('blur', function() {
            validateField(this);
        });
    }

    // Restrict beratPaket input to numbers and decimal only
    const beratPaketInput = document.getElementById('beratPaket');
    if (beratPaketInput) {
        beratPaketInput.addEventListener('input', function() {
            // Allow numbers and one decimal point
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            const parts = this.value.split('.');
            if (parts.length > 2) {
                this.value = parts[0] + '.' + parts.slice(1).join('');
            }
        });
        
        beratPaketInput.addEventListener('blur', function() {
            validateField(this);
        });
    }

    // Add real-time validation for select fields
    ['kotaAsal', 'kotaTujuan'].forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('change', function() {
                validateField(this);
            });
        }
    });
}

// ================================
// FORM SUBMIT HANDLERS
// ================================

function handleOngkirSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Validate form
    if (!validateForm('ongkirForm')) {
        return false;
    }
    
    const kotaAsal = document.getElementById('kotaAsal').value;
    const kotaTujuan = document.getElementById('kotaTujuan').value;
    const beratPaket = parseFloat(document.getElementById('beratPaket').value);
    
    // Show loading
    document.getElementById('resultCard').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    
    // Simulate API call
    setTimeout(() => {
        const totalOngkir = hitungOngkir(kotaAsal, kotaTujuan, beratPaket);

        if (totalOngkir === null) {
            showAlert(
                currentLang === 'id' 
                    ? 'Kota tujuan tidak tersedia di provinsi Yogyakarta' 
                    : 'Destination city is not available in Yogyakarta province',
                'error'
            );
            document.getElementById('loader').style.display = 'none';
            return;
        }

        // Update result display
        document.getElementById('loader').style.display = 'none';
        document.getElementById('resultAsal').textContent = kotaAsal;
        document.getElementById('resultTujuan').textContent = kotaTujuan;
        document.getElementById('resultBerat').textContent = beratPaket + ' kg';
        document.getElementById('resultTotal').textContent = 'Rp ' + formatRupiah(totalOngkir);
        
        const resultCard = document.getElementById('resultCard');
        resultCard.style.display = 'block';
        
        // Scroll to result
        setTimeout(() => {
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    }, 1500);
    
    return false;
}

function handleContactSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Validate form
    if (!validateForm('contactForm')) {
        return false;
    }
    
    const nama = document.getElementById('nama').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const pesan = document.getElementById('pesan').value;
    
    // Simulate sending message
    showAlert(
        currentLang === 'id' ? 'Pesan berhasil dikirim!' : 'Message sent successfully!',
        'success'
    );
    
    // Reset form
    document.getElementById('contactForm').reset();
    document.getElementById('charCount').textContent = '0';
    const charCounter = document.querySelector('.char-counter');
    if (charCounter) {
        charCounter.classList.remove('error', 'warning');
    }
    
    // Remove success/error classes from fields
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        field.classList.remove('error', 'success');
    });
    
    return false;
}

// ================================
// CORE FUNCTIONS
// ================================

// Toggle language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('langDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const langSwitcher = document.querySelector('.language-switcher');
    const dropdown = document.getElementById('langDropdown');
    
    if (langSwitcher && !langSwitcher.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

function changeLanguage(lang) {
    currentLang = lang;
    
    // Update current language text
    const currentLangText = document.getElementById('currentLangText');
    if (currentLangText) {
        currentLangText.textContent = lang.toUpperCase();
    }
    
    // Update active option
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });

    // Close dropdown
    document.getElementById('langDropdown').classList.remove('active');

    // Update all translatable elements
    document.querySelectorAll('[data-lang-id]').forEach(el => {
        const text = el.getAttribute(`data-lang-${lang}`);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            const placeholder = el.getAttribute(`data-lang-placeholder-${lang}`);
            if (placeholder) {
                el.placeholder = placeholder;
            }
        } else if (el.tagName === 'OPTION') {
            el.textContent = text;
        } else {
            el.textContent = text;
        }
    });

    // Update document language
    document.documentElement.lang = lang;
}

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Smooth scroll ke form cek ongkir
function scrollToForm() {
    document.getElementById('cek-ongkir').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll untuk semua link di navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            const navMenu = document.getElementById('navMenu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Format angka ke rupiah (hanya format angka)
function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi hitung ongkir berdasarkan jarak
function hitungOngkir(kotaAsal, kotaTujuan, berat) {
    if (!jarakKota[kotaAsal] || jarakKota[kotaAsal][kotaTujuan] === undefined) {
        return null;
    }

    const jarak = jarakKota[kotaAsal][kotaTujuan];
    let tarifPerKg;

    if (jarak > 40) {
        tarifPerKg = 12000;
    } else if (jarak >= 30) {
        tarifPerKg = 8000;
    } else {
        tarifPerKg = 5000;
    }

    return berat * tarifPerKg;
}

// ================================
// TEST FUNCTIONS
// ================================

// Test fungsi alert (untuk testing manual)
window.testAlert = function(type = 'error') {
    const messages = {
        'error': currentLang === 'id' ? 'Ini adalah pesan error untuk testing' : 'This is an error message for testing',
        'success': currentLang === 'id' ? 'Ini adalah pesan sukses untuk testing' : 'This is a success message for testing',
        'warning': currentLang === 'id' ? 'Ini adalah pesan warning untuk testing' : 'This is a warning message for testing',
        'info': currentLang === 'id' ? 'Ini adalah pesan info untuk testing' : 'This is an info message for testing'
    };
    
    showAlert(messages[type] || messages.info, type);
};

// Test semua alert
window.testAllAlerts = function() {
    alertSystem.clearAll();
    
    setTimeout(() => showAlert(currentLang === 'id' ? 'Isi data yang diperlukan' : 'Please fill in the required data', 'error'), 100);
    setTimeout(() => showAlert(currentLang === 'id' ? 'Pilih kota asal dan tujuan terlebih dahulu' : 'Please select origin and destination cities first', 'error'), 1100);
    setTimeout(() => showAlert(currentLang === 'id' ? 'Berat paket minimal 1 kg' : 'Minimum package weight is 1 kg', 'error'), 2100);
    setTimeout(() => showAlert(currentLang === 'id' ? 'Pesan berhasil dikirim!' : 'Message sent successfully!', 'success'), 3100);
};

// Run specific test case
window.runTestCase = function(testId) {
    alertSystem.clearAll();
    
    const testCases = {
        'TC-15': () => {
            document.getElementById('ongkirForm').reset();
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-16': () => {
            document.getElementById('kotaAsal').value = 'Kota Yogyakarta';
            document.getElementById('kotaTujuan').value = 'Sleman';
            document.getElementById('beratPaket').value = '0.5';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-17': () => {
            document.getElementById('kotaAsal').value = 'Kota Yogyakarta';
            document.getElementById('kotaTujuan').value = 'Sleman';
            document.getElementById('beratPaket').value = '0';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-18': () => {
            document.getElementById('kotaAsal').value = 'Kota Yogyakarta';
            document.getElementById('kotaTujuan').value = 'Sleman';
            document.getElementById('beratPaket').value = '-1';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-19': () => {
            document.getElementById('kotaAsal').value = '';
            document.getElementById('kotaTujuan').value = 'Bantul';
            document.getElementById('beratPaket').value = '3';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-20': () => {
            document.getElementById('kotaAsal').value = 'Sleman';
            document.getElementById('kotaTujuan').value = '';
            document.getElementById('beratPaket').value = '3';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-26': () => {
            document.getElementById('nama').value = 'Alfi Dias';
            document.getElementById('whatsapp').value = '08123456789';
            document.getElementById('pesan').value = 'Test pesan untuk delivery';
            setTimeout(() => document.getElementById('contactForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-27': () => {
            document.getElementById('contactForm').reset();
            setTimeout(() => document.getElementById('contactForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-28': () => {
            document.getElementById('nama').value = 'Test User';
            document.getElementById('whatsapp').value = 'abc123456';
            document.getElementById('pesan').value = 'Test pesan';
            setTimeout(() => document.getElementById('contactForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'TC-29': () => {
            document.getElementById('nama').value = 'Test';
            document.getElementById('whatsapp').value = '08123456789';
            document.getElementById('pesan').value = 'A'.repeat(550);
            setTimeout(() => document.getElementById('contactForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        }
    };
    
    if (testCases[testId]) {
        testCases[testId]();
        console.log(`✅ Test ${testId} executed`);
    } else {
        console.log('❌ Test case tidak ditemukan. Available: TC-15 to TC-20, TC-26 to TC-29');
    }
};

// Test form validation dengan berbagai skenario
window.testFormValidation = function(scenario) {
    alertSystem.clearAll();
    
    const tests = {
        'empty': () => {
            document.getElementById('ongkirForm').reset();
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'no-origin': () => {
            document.getElementById('kotaAsal').value = '';
            document.getElementById('kotaTujuan').value = 'Sleman';
            document.getElementById('beratPaket').value = '2';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'no-destination': () => {
            document.getElementById('kotaAsal').value = 'Kota Yogyakarta';
            document.getElementById('kotaTujuan').value = '';
            document.getElementById('beratPaket').value = '2';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'weight-less-than-1': () => {
            document.getElementById('kotaAsal').value = 'Kota Yogyakarta';
            document.getElementById('kotaTujuan').value = 'Sleman';
            document.getElementById('beratPaket').value = '0.5';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        },
        'valid': () => {
            document.getElementById('kotaAsal').value = 'Kota Yogyakarta';
            document.getElementById('kotaTujuan').value = 'Sleman';
            document.getElementById('beratPaket').value = '2';
            setTimeout(() => document.getElementById('ongkirForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
        }
    };
    
    if (tests[scenario]) {
        tests[scenario]();
        console.log(`✅ Testing scenario: ${scenario}`);
    } else {
        console.log('❌ Scenario tidak ditemukan. Available: empty, no-origin, no-destination, weight-less-than-1, valid');
    }
};

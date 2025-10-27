// Link Shortener Frontend JavaScript

// API Configuration
const API_BASE_URL = 'http://localhost:4000';

// DOM Elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');
const resultsDiv = document.getElementById('results');
const originalUrlInput = document.getElementById('originalUrl');
const shortUrlInput = document.getElementById('shortUrl');
const visitLink = document.getElementById('visitLink');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Link Shortener Frontend Loaded');

    // Add form validation
    urlInput.addEventListener('input', validateUrlInput);

    // Handle form submission
    urlForm.addEventListener('submit', handleFormSubmit);
});

// URL Input Validation
function validateUrlInput() {
    const url = urlInput.value.trim();

    if (url && isValidUrlFormat(url)) {
        urlInput.classList.remove('input-error');
        urlInput.classList.add('input-success');
    } else if (url) {
        urlInput.classList.remove('input-success');
        urlInput.classList.add('input-error');
    } else {
        urlInput.classList.remove('input-success', 'input-error');
    }
}

// Basic URL format validation
function isValidUrlFormat(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const url = urlInput.value.trim();

    if (!url) {
        showAlert('خطا', 'لطفاً یک لینک وارد کنید', 'error');
        return;
    }

    if (!isValidUrlFormat(url)) {
        showAlert('خطا', 'لینک وارد شده معتبر نیست', 'error');
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        console.log('📤 Sending request to API:', url);

        const response = await fetch(`${API_BASE_URL}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();
        console.log('📥 API Response:', data);

        if (response.ok) {
            // Success
            showResults(data);
            showAlert('موفقیت', 'لینک با موفقیت کوتاه شد!', 'success');
        } else {
            // Error
            throw new Error(data.error || 'خطا در کوتاه کردن لینک');
        }

    } catch (error) {
        console.error('❌ API Error:', error);
        showAlert('خطا', error.message, 'error');
    } finally {
        setLoadingState(false);
    }
}

// Set Loading State
function setLoadingState(loading) {
    if (loading) {
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        shortenBtn.disabled = true;
        urlInput.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        shortenBtn.disabled = false;
        urlInput.disabled = false;
    }
}

// Show Results
function showResults(data) {
    originalUrlInput.value = data.originalUrl;
    shortUrlInput.value = data.shortUrl;
    visitLink.href = data.shortUrl;

    // Show results section with animation
    resultsDiv.classList.remove('hidden');
    resultsDiv.classList.add('fade-in');

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Reset Form
function resetForm() {
    urlForm.reset();
    resultsDiv.classList.add('hidden');
    resultsDiv.classList.remove('fade-in');
    urlInput.classList.remove('input-success', 'input-error');
    urlInput.focus();
}

// Copy to Clipboard
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const button = element.nextElementSibling;

    try {
        await navigator.clipboard.writeText(element.value);

        // Show feedback
        showCopyFeedback(button, 'کپی شد!');

        // Visual feedback
        button.classList.add('bg-green-300');
        setTimeout(() => {
            button.classList.remove('bg-green-300');
        }, 200);

    } catch (error) {
        console.error('Failed to copy:', error);

        // Fallback for older browsers
        element.select();
        document.execCommand('copy');

        showCopyFeedback(button, 'کپی شد!');
    }
}

// Show Copy Feedback
function showCopyFeedback(button, message) {
    // Remove existing feedback
    const existingFeedback = button.querySelector('.copy-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Create new feedback
    const feedback = document.createElement('div');
    feedback.className = 'copy-feedback';
    feedback.textContent = message;

    button.style.position = 'relative';
    button.appendChild(feedback);

    // Show and hide feedback
    setTimeout(() => {
        feedback.classList.add('show');
    }, 10);

    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }, 2000);
}

// Sweet Alert Functions
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'باشه',
        confirmButtonColor: '#3b82f6',
        timer: icon === 'success' ? 3000 : undefined,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        customClass: {
            popup: 'rtl-popup'
        }
    });
}

// Enhanced URL validation with security checks
function validateUrlSecurity(url) {
    const suspiciousPatterns = [
        'javascript:',
        'data:',
        'vbscript:',
        'file:',
        'ftp:',
        '<script',
        'onload=',
        'onerror='
    ];

    const lowerUrl = url.toLowerCase();
    return !suspiciousPatterns.some(pattern => lowerUrl.includes(pattern));
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        urlForm.dispatchEvent(new Event('submit'));
    }

    // Escape to reset form
    if (e.key === 'Escape' && !resultsDiv.classList.contains('hidden')) {
        resetForm();
    }
});

// Add loading animation to buttons
function addButtonLoadingEffect() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.id.includes('shortenBtn')) {
            button.addEventListener('click', function() {
                this.classList.add('pulse');
                setTimeout(() => {
                    this.classList.remove('pulse');
                }, 2000);
            });
        }
    });
}

// Initialize loading effects
addButtonLoadingEffect();

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

/**
 * Frontend tests for Link Shortener
 * Tests the JavaScript functionality and API integration
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Setup DOM environment
const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
const { window } = new JSDOM(html, {
  url: 'http://localhost:4000',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLElement = window.HTMLElement;
global.HTMLInputElement = window.HTMLInputElement;
global.Event = window.Event;
global.CustomEvent = window.CustomEvent;

// Mock fetch for testing
global.fetch = require('jest-fetch-mock');
require('jest-fetch-mock').enableMocks();

// Load the script
require('../public/script.js');

describe('Frontend Functionality', () => {
  beforeEach(() => {
    fetch.resetMocks();
    // Reset DOM
    document.body.innerHTML = html;
    // Reinitialize event listeners
    document.addEventListener('DOMContentLoaded', function() {
      const urlForm = document.getElementById('urlForm');
      const urlInput = document.getElementById('urlInput');
      urlInput.addEventListener('input', validateUrlInput);
      urlForm.addEventListener('submit', handleFormSubmit);
    });
  });

  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      const urlInput = document.getElementById('urlInput');

      // Test valid URL
      urlInput.value = 'https://example.com';
      urlInput.dispatchEvent(new Event('input'));
      expect(urlInput.classList.contains('input-success')).toBe(true);

      // Test invalid URL
      urlInput.value = 'invalid-url';
      urlInput.dispatchEvent(new Event('input'));
      expect(urlInput.classList.contains('input-error')).toBe(true);
    });

    it('should show error for malicious URLs', () => {
      const urlInput = document.getElementById('urlInput');

      urlInput.value = 'javascript:alert("xss")';
      urlInput.dispatchEvent(new Event('input'));
      expect(urlInput.classList.contains('input-error')).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should handle successful URL shortening', async () => {
      const mockResponse = {
        shortUrl: 'http://localhost:4000/abc123',
        originalUrl: 'https://example.com'
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const urlForm = document.getElementById('urlForm');
      const urlInput = document.getElementById('urlInput');

      urlInput.value = 'https://example.com';
      urlForm.dispatchEvent(new Event('submit'));

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://example.com' })
      });
    });

    it('should handle API errors', async () => {
      const mockError = { error: 'Invalid URL' };
      fetch.mockResponseOnce(JSON.stringify(mockError), { status: 400 });

      // Mock SweetAlert
      global.Swal = {
        fire: jest.fn()
      };

      const urlForm = document.getElementById('urlForm');
      const urlInput = document.getElementById('urlInput');

      urlInput.value = 'invalid-url';
      urlForm.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'خطا',
          icon: 'error'
        })
      );
    });
  });

  describe('Copy to Clipboard', () => {
    it('should copy text to clipboard', async () => {
      // Mock clipboard API
      global.navigator.clipboard = {
        writeText: jest.fn().mockResolvedValue()
      };

      const mockElement = {
        value: 'test-url',
        nextElementSibling: {
          classList: {
            add: jest.fn(),
            remove: jest.fn()
          }
        }
      };

      // Mock document.getElementById
      global.document.getElementById = jest.fn().mockReturnValue(mockElement);

      await copyToClipboard('testElement');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-url');
    });
  });

  describe('Form Reset', () => {
    it('should reset form and hide results', () => {
      const resultsDiv = document.getElementById('results');
      const urlInput = document.getElementById('urlInput');

      // Show results first
      resultsDiv.classList.remove('hidden');
      resultsDiv.classList.add('fade-in');

      // Reset form
      resetForm();

      expect(resultsDiv.classList.contains('hidden')).toBe(true);
      expect(resultsDiv.classList.contains('fade-in')).toBe(false);
      expect(urlInput.classList.contains('input-success')).toBe(false);
      expect(urlInput.classList.contains('input-error')).toBe(false);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should submit form with Ctrl+Enter', () => {
      const urlForm = document.getElementById('urlForm');
      const urlInput = document.getElementById('urlInput');

      // Mock form submission
      const mockSubmit = jest.fn();
      urlForm.addEventListener('submit', mockSubmit);

      urlInput.value = 'https://example.com';

      // Simulate Ctrl+Enter
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true
      });

      document.dispatchEvent(event);

      expect(mockSubmit).toHaveBeenCalled();
    });

    it('should reset form with Escape key', () => {
      const resultsDiv = document.getElementById('results');

      // Show results first
      resultsDiv.classList.remove('hidden');

      // Mock resetForm
      global.resetForm = jest.fn();

      // Simulate Escape key
      const event = new KeyboardEvent('keydown', {
        key: 'Escape'
      });

      document.dispatchEvent(event);

      expect(global.resetForm).toHaveBeenCalled();
    });
  });

  describe('Security Validation', () => {
    it('should detect malicious URLs', () => {
      const maliciousUrls = [
        'javascript:alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        'vbscript:msgbox("xss")',
        '<script>alert("xss")</script>',
        'http://example.com/onload=alert("xss")'
      ];

      maliciousUrls.forEach(url => {
        expect(validateUrlSecurity(url)).toBe(false);
      });
    });

    it('should allow safe URLs', () => {
      const safeUrls = [
        'https://example.com',
        'http://example.com',
        'https://subdomain.example.com/path?query=value'
      ];

      safeUrls.forEach(url => {
        expect(validateUrlSecurity(url)).toBe(true);
      });
    });
  });
});

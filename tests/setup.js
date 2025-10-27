/**
 * Jest setup file for frontend testing
 * Configures JSDOM environment and mocks
 */

// Only run for frontend tests
if (process.env.JEST_TEST_ENVIRONMENT === 'jsdom') {
  // Setup JSDOM environment
  const { JSDOM } = require('jsdom');

  // Create DOM environment
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:4000',
    pretendToBeVisual: true,
    resources: 'usable'
  });

  const { window } = dom;

  // Setup global variables
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.HTMLElement = window.HTMLElement;
  global.HTMLInputElement = window.HTMLInputElement;
  global.Event = window.Event;
  global.CustomEvent = window.CustomEvent;
  global.KeyboardEvent = window.KeyboardEvent;

  // Mock fetch for testing
  global.fetch = require('jest-fetch-mock');
  require('jest-fetch-mock').enableMocks();

  // Mock clipboard API
  Object.assign(global.navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue()
    }
  });

  // Mock SweetAlert
  global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
  };

  // Setup console methods for testing
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  };
}

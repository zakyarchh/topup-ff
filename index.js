// ========================================
// Index Page Script - nazzstore
// ========================================

import {
  db,
  doc,
  getDoc,
  onSnapshot
} from './firebase-config.js';

import {
  animateCounter,
  toast
} from './utils.js';

// DOM Elements
const mainContent = document.getElementById('mainContent');
const maintenancePage = document.getElementById('maintenancePage');
const statTransactions = document.getElementById('statTransactions');
const statDiamonds = document.getElementById('statDiamonds');
const statCustomers = document.getElementById('statCustomers');

// Check maintenance mode
async function checkMaintenanceMode() {
  try {
    const settingsRef = doc(db, 'settings', 'general');
    onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.data();
        if (settings.maintenanceMode) {
          mainContent.style.display = 'none';
          maintenancePage.style.display = 'flex';
        } else {
          mainContent.style.display = 'block';
          maintenancePage.style.display = 'none';
        }
      }
    });
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
  }
}

// Load and animate stats
function loadStats() {
  try {
    const statsRef = doc(db, 'stats', 'general');
    onSnapshot(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const stats = snapshot.data();
        
        // Animate counters
        if (statTransactions) {
          animateCounter(statTransactions, stats.totalOrders || 0, 2000);
        }
        if (statDiamonds) {
          animateCounter(statDiamonds, stats.totalDiamonds || 0, 2500);
        }
        if (statCustomers) {
          animateCounter(statCustomers, stats.totalCustomers || 0, 2000);
        }
      } else {
        // Initialize stats if not exists
        console.log('Stats document does not exist');
      }
    });
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe feature cards
  document.querySelectorAll('.feature-card, .stat-card').forEach(card => {
    observer.observe(card);
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    lastScrollY = window.scrollY;
  });
}

// Initialize page
function init() {
  checkMaintenanceMode();
  loadStats();
  initScrollAnimations();
  initSmoothScroll();
  initNavbarScroll();
}

// Run on DOM ready

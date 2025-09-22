'use strict';

/* ============================
   Robust script.js — replace whole file
   ============================ */

/* small helper */
const elementToggleFunc = (elem) => elem && elem.classList.toggle('active');

/* ---------------------------
   Sidebar toggle (mobile)
   --------------------------- */
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
}

/* ---------------------------
   Testimonials modal
   --------------------------- */
const testimonialsItems = Array.from(document.querySelectorAll('[data-testimonials-item]'));
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const testimonialsModalFunc = () => {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
  }
};

if (testimonialsItems.length) {
  testimonialsItems.forEach(item => {
    item.addEventListener('click', function () {
      const avatar = this.querySelector('[data-testimonials-avatar]');
      if (modalImg) {
        modalImg.src = avatar ? avatar.src : '';
        modalImg.alt = avatar ? avatar.alt : '';
      }
      if (modalTitle) modalTitle.innerHTML = this.querySelector('[data-testimonials-title]')?.innerHTML || '';
      if (modalText) modalText.innerHTML = this.querySelector('[data-testimonials-text]')?.innerHTML || '';
      testimonialsModalFunc();
    });
  });
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', testimonialsModalFunc);
if (overlay) overlay.addEventListener('click', testimonialsModalFunc);

/* ---------------------------
   Custom select / filter
   --------------------------- */
const select = document.querySelector('[data-select]');
const selectItems = Array.from(document.querySelectorAll('[data-select-item]'));
const selectValue = document.querySelector('[data-selecct-value]'); // matches your HTML attribute
const filterBtn = Array.from(document.querySelectorAll('[data-filter-btn]'));
const filterItems = Array.from(document.querySelectorAll('[data-filter-item]'));

if (select) select.addEventListener('click', function () { elementToggleFunc(this); });

selectItems.forEach(item => {
  item.addEventListener('click', function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) select.classList.remove('active');
    filterFunc(selectedValue);
  });
});

const filterFunc = (selectedValue) => {
  filterItems.forEach(fi => {
    const cat = fi.dataset.category;
    if (selectedValue === 'all' || selectedValue === cat) {
      fi.classList.add('active');
    } else {
      fi.classList.remove('active');
    }
  });
};

/* filter buttons for wider screens */
let lastClickedBtn = filterBtn[0] || null;
if (lastClickedBtn) lastClickedBtn.classList.add('active');

filterBtn.forEach(btn => {
  btn.addEventListener('click', function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove('active');
    this.classList.add('active');
    lastClickedBtn = this;
  });
});

/* ---------------------------
   Contact form validation
   --------------------------- */
const form = document.querySelector('[data-form]');
const formInputs = Array.from(document.querySelectorAll('[data-form-input]'));
const formBtn = document.querySelector('[data-form-btn]');

if (form && formInputs.length && formBtn) {
  const validateForm = () => {
    if (form.checkValidity()) formBtn.removeAttribute('disabled');
    else formBtn.setAttribute('disabled', '');
  };
  formInputs.forEach(inp => inp.addEventListener('input', validateForm));
  validateForm(); // initial check
}

/* ---------------------------
   Page navigation + persistent active page
   --------------------------- */
const navigationLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
const pages = Array.from(document.querySelectorAll('[data-page]'));

/**
 * Activate a page by name (e.g. "resume")
 * Ensures pages and nav links are synced.
 */
const activatePage = (pageName) => {
  pages.forEach(page => {
    if (page.dataset.page === pageName) page.classList.add('active');
    else page.classList.remove('active');
  });
  navigationLinks.forEach(link => {
    const linkName = link.textContent.trim().toLowerCase();
    if (linkName === pageName) link.classList.add('active');
    else link.classList.remove('active');
  });
};

/* add click listeners to nav links and persist the selection */
navigationLinks.forEach(link => {
  link.addEventListener('click', function () {
    const pageName = this.textContent.trim().toLowerCase();
    activatePage(pageName);
    window.scrollTo(0, 0);
    try {
      localStorage.setItem('activePage', pageName);
    } catch (e) {
      // localStorage might be unavailable in some environments — do not break the page
      console.warn('Could not save active page to localStorage:', e);
    }
  });
});

/* restore the last active page (run after listeners set up) */
(() => {
  try {
    const savedPage = localStorage.getItem('activePage');
    if (savedPage && pages.some(p => p.dataset.page === savedPage)) {
      activatePage(savedPage);
    } else {
      // if none saved: ensure nav matches whatever page is currently active in DOM (fallback)
      const activeFromDOM = pages.find(p => p.classList.contains('active'));
      if (activeFromDOM) {
        const pName = activeFromDOM.dataset.page;
        navigationLinks.forEach(link => {
          if (link.textContent.trim().toLowerCase() === pName) link.classList.add('active');
          else link.classList.remove('active');
        });
      } else if (pages[0]) {
        // as last resort, activate the first page so there is always a consistent state
        activatePage(pages[0].dataset.page);
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
  }
})();

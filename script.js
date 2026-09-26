/**
 * RISHI SARKAR PORTFOLIO — INTERACTIVE JAVASCRIPT
 * Features: Scroll reveals, Mobile Drawer, Category Filtering,
 * Active Nav highlighting, Copy Email toast, Form handling, Back to Top.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC YEAR
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. SCROLL REVEAL OBSERVER
  const revealElements = document.querySelectorAll('.reveal-fade');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: once revealed, unobserve to save performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el, index) => {
    // Add subtle staggered transition delay for siblings in grids
    if (el.classList.contains('stack-item') || el.classList.contains('work-card') || el.classList.contains('insight-card')) {
      const staggerDelay = (index % 4) * 0.08;
      el.style.transitionDelay = `${staggerDelay}s`;
    }
    revealObserver.observe(el);
  });

  // 3. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background blur/shadow on scroll
    if (scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active link highlighting based on section position
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active-nav');
      }
    });
  });

  // 4. MOBILE NAVIGATION DRAWER
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function toggleDrawer() {
    const isOpen = mobileDrawer.classList.toggle('open');
    mobileToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', toggleDrawer);

  // Close drawer when clicking backdrop or navigation link
  mobileDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) {
      closeDrawer();
    }
  });

  mobileNavItems.forEach((item) => {
    item.addEventListener('click', closeDrawer);
  });

  // 5. TECH STACK FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const stackItems = document.querySelectorAll('.stack-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      stackItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 6. COPY EMAIL WITH TOAST NOTIFICATION
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('emailLink');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyBtn?.addEventListener('click', async () => {
    const emailToCopy = emailLink ? emailLink.textContent.trim() : 'your-email@example.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = emailToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast('Email copied to clipboard!');
    } catch (err) {
      showToast('Could not copy email');
    }
  });

  // 7. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName')?.value.trim();
    const email = document.getElementById('userEmail')?.value.trim();
    const subject = document.getElementById('userSubject')?.value.trim();
    const message = document.getElementById('userMessage')?.value.trim();

    if (!name || !email || !message) {
      if (formStatus) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'form-status error';
      }
      return;
    }

    // Visual button state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    // Simulate sending / open mailto client
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
      }

      if (formStatus) {
        formStatus.textContent = `Thank you, ${name}! Your message has been prepared.`;
        formStatus.className = 'form-status success';
      }

      showToast('Message ready! Opening email client...');

      // Open mailto with filled body
      const mailtoUrl = `mailto:sarkarrishi98@gmail.com?subject=${encodeURIComponent(
        subject || 'Portfolio Inquiry'
      )}&body=${encodeURIComponent(
        `Hi Rishi,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      
      window.location.href = mailtoUrl;

      // Reset form after 4 seconds
      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        }
        if (formStatus) {
          formStatus.textContent = '';
        }
      }, 4000);
    }, 600);
  });

  // 8. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById('backToTopBtn');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  console.log('🚀 Rishi Sarkar Portfolio loaded smoothly.');
});
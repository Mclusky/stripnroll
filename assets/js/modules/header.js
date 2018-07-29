const $ = require('jquery');

$.when($.ready).then(() => {
  // Get user's window size and adjust hero image height //
  // Start slider animation //
  const feeds = document.querySelectorAll('.sliders');
  const feedCtn = document.querySelector('#slide-feed');
  let i = 0;
  let started = false;
  let carousel;

  // Add smooth scrolling to all links
  function smoothScroll(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash === '#footer-sec') {
      $('html, body').animate(
        {
          scrollTop: (($('#gallery-sec').offset().top) + ($('#gallery-sec').height())),
        },
        2500, () => {
        // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = this.hash;
        },
      );
    } else if (this.hash !== '') {
    // Prevent default anchor click behavior
      event.preventDefault();
      // Store hash
      const { hash } = this;
      $('html, body').animate(
        {
          scrollTop: $(hash).offset().top,
        },
        2500, () => {
        // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        },
      );
    }
  }

  function getHeight() {
    $('.hero-container')[0].style.height = `${window.innerHeight}px`;
  }

  function toggleDots() {
    const slides = $('.sliders');
    const dots = $('.dot');
    $(dots).removeClass('active-dot');
    for (let j = 0; j < slides.length; j += 1) {
      if ($(slides[j]).hasClass('sliders-active')) {
        $(dots[j]).addClass('active-dot');
      }
    }
  }

  function slide(sliders, parent) {
    $(sliders).removeClass('sliders-out sliders-active');
    if (i === (sliders.length - 1)) {
      i = 0;
    } else {
      i += 1;
    }
    if (started === false) {
      sliders[0].classList.toggle('sliders-out');
      sliders[0].classList.remove('home-content-lp');
      sliders[1].classList.toggle('sliders-active');
    }
    if (started && sliders[i].previousElementSibling && sliders[i].nextElementSibling) {
      sliders[i].previousElementSibling.classList.toggle('sliders-out');
      sliders[i].classList.toggle('sliders-active');
    }
    if (started && (sliders[i] === parent.lastElementChild)) {
      sliders[i].classList.toggle('sliders-active');
      sliders[i].previousElementSibling.classList.toggle('sliders-out');
    }
    if (started && (sliders[i] === parent.firstElementChild)) {
      sliders[i].classList.toggle('sliders-active');
      parent.lastElementChild.classList.toggle('sliders-out');
    }
    started = true;
    toggleDots();
  }

  function loadSlides(par, ctnr) {
    const slideNav = () => slide(par, ctnr);
    carousel = setInterval(slideNav, 8000);
  }

  function toggleNav() {
    clearInterval(carousel);
    $('#nav-icon-button').removeClass('fade-out-nav');
    $('.sliders').removeClass('sliders-active sliders-out');
    $('.sliders').toggleClass('header-slide-out');
    if ($('#main-nav').hasClass('nav-wrapper-in')) {
      feeds[0].classList.add('sliders-active');
      started = false;
      i = 0;
      loadSlides(feeds, feedCtn);
    }
    $('#main-nav').toggleClass('nav-wrapper-in');
    $('span.nav-icon').toggleClass('show-nav');
    $('#dots').toggleClass('dots-out');
    $('.dot').removeClass('active-dot');
    $('.dot:first-child').addClass('active-dot');

    if (window.scrollY >= $('#hero-header').height()) {
      $('#nav-icon-button').toggleClass('icon-scrolled');
    }
    if (window.scrollY >= $('#hero-header').height() && !$('#main-nav').hasClass('nav-wrapper-in')) {
      $('#nav-icon-button').addClass('fade-out-nav');
    }
  }

  function fixNav() {
    let isScrolling;
    $('#nav-icon-button').removeClass('fade-out-nav');
    window.clearTimeout(isScrolling);
    if (window.scrollY >= $('#hero-header').height() && !$('#main-nav').hasClass('nav-wrapper-in')) {
      $('#nav-icon-button').addClass('icon-scrolled');
      isScrolling = setTimeout(() => $('#nav-icon-button').addClass('fade-out-nav'), 2000);
    } else {
      $('#nav-icon-button').removeClass('icon-scrolled');
    }
  }

  loadSlides(feeds, feedCtn);
  $('#nav-icon-button').on('click', toggleNav);
  getHeight();
  // **********Event Listeners************* //
  $('a').on('click', smoothScroll);
  $(window).on('resize', getHeight);
  $(window).on('scroll', fixNav);
});

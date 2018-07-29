const $ = require('jquery');
const debounce = require('lodash.debounce');
const jqueryBridget = require('jquery-bridget');
const flickity = require('flickity');
const lazysizes = require('lazysizes');
require('flickity-imagesloaded');

// **************FLICKITY SET UP****************** //
$.when($.ready).then(() => {
  const $carousel = $('#main-carousel');
  lazysizes.init();
  flickity.setJQuery($);
  jqueryBridget('flickity', flickity, $);
  $carousel.flickity({
    contain: true,
    pageDots: false,
    wrapAround: true,
    imagesLoaded: true,
    cellAlign: 'left',
    freeScroll: true,
    cellSelector: '.carousel-cell',
    initialIndex: 4,
    autoPlay: 5000,
  });

  function changeSize(e) {
    e.preventDefault();
    if ($('#switch-size span').text() === 'SMALL') {
      $('#switch-size span').text('LARGE');
    } else {
      $('#switch-size span').text('SMALL');
    }
    $('.carousel-cell').toggleClass('lgImg');
    $carousel.flickity('resize');
    $carousel.flickity('reposition');
  }

  function playSlide() {
    $carousel.flickity('playPlayer');
  }

  function stopSlide() {
    $carousel.flickity('stopPlayer');
  }

  function animHeading() {
    const fig = document.querySelectorAll('.heading-figs');
    const contnr = document.querySelector('#h-letters');
    // Just above heading
    const slideAt = (window.scrollY + window.innerHeight) - (contnr.clientHeight);
    // bottom of image
    const figBtm = contnr.offsetTop + contnr.clientHeight;
    const halfVisible = slideAt > contnr.offsetTop;
    const notScrollPast = window.scrollY < figBtm;
    if (halfVisible && notScrollPast) {
      fig.forEach(el => el.classList.add('anim-letters'));
    } else {
      fig.forEach(el => el.classList.remove('anim-letters'));
    }
  }
  // ************** Resize the carousel once all pictures are loaded ************ //
  $(document).one('lazyloaded', () => {
    $carousel.flickity('resize');
  });
  $('#switch-size').on('click', changeSize);
  $('#playFlick').on('click', playSlide);
  $('#stopFlick').on('click', stopSlide);
  $(window).on('scroll', debounce(animHeading, 20));
});

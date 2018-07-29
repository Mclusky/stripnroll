const $ = require('jquery');

function showGigs() {
  const gigs = $('.shows-list li').not('.gig-active');
  $(gigs).toggleClass('gig-hidden gig-anim');
  if ($('.more-shows p').text() === 'Show more') {
    $('.more-shows p').text('Show less');
    $('.more-shows .fa-arrow-down')
      .removeClass('fa-arrow-down')
      .addClass('fa-arrow-up');
  } else {
    $('.more-shows p').text('Show more');
    $('.more-shows .fa-arrow-up')
      .removeClass('fa-arrow-up')
      .addClass('fa-arrow-down');
  }
}

$('.more-shows').on('click', showGigs);

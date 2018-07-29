const debounce = require('lodash.debounce');
const $ = require('jquery');


const images = document.querySelectorAll('.img-wrap');

function checkSlide() {
  images.forEach((img) => {
    // half way through the image
    const slideAt = (window.scrollY + window.innerHeight) - (img.clientHeight / 2);
    // bottom of image
    const imgBtm = img.offsetTop + img.clientHeight;
    const halfVisible = slideAt > img.offsetTop;
    const notScrollPast = window.scrollY < imgBtm;
    if (halfVisible && notScrollPast) {
      img.classList.add('active');
    } else {
      img.classList.remove('active');
    }
  });
}

$(window).on('scroll', debounce(checkSlide, 20));

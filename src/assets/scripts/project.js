import Swiper, { EffectFade, Navigation, Pagination, FreeMode } from 'swiper';
import menu from './modules/menu';
import { lenis } from './modules/scroll/leniscroll';
import Headroom from 'headroom.js';
import './modules/form';
import "current-device";
import { gsap } from 'gsap/all';
Swiper.use([EffectFade, Navigation, Pagination, FreeMode]);

var myElement = document.querySelector("header");
// construct an instance of Headroom, passing the element
var headroom  = new Headroom(myElement);
headroom.init();


menu();

const sec1Slider = new Swiper('[data-project-slider]', {
    effect: 'fade',
    loop: true,
    speed: 500,
    freeMode: false,
    watchSlidesProgress: false,
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: document.querySelector('[data-project-slider-next]'),
      prevEl: document.querySelector('[data-project-slider-prev]'),
    },
    pagination: {
      el: '[data-project-slider] .thumbs',
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="thumbs__item ' + className + '"></span>';
      }, 
    },
    on: {
        init: (e) => {
          document.querySelector('[data-project-slider] .total').textContent = e.slides.length;
          console.log(e);
        }
    }
});

sec1Slider.on('activeIndexChange',  ({ activeIndex, realIndex }) => {
    document.querySelector('[data-project-slider] .current')
      .textContent = realIndex + 1;
})




function mobileAreaSlider() {
  if (!document.documentElement.classList.contains('mobile')) return
  const slider = new Swiper('[data-mobile-area-slider]', {
    slidesPerView: 1.5,
    spaceBetween: 32
  });
  document.querySelectorAll('.area-item__icons-row [preserveAspectRatio]').forEach(icon => {
    icon.setAttribute('preserveAspectRatio', 'none');
  })
}

mobileAreaSlider();


const items = document.querySelectorAll(".area-item__title");

gsap.timeline()
  .from(items, {
    textContent: 0,
    duration: 2,
    ease: 'Power1.easeIn',
    snap: { textContent: 1 },
    stagger: 0.2,
    // onUpdate: textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  })
    .add(() => {
      items.forEach(el => el.innerHTML = el.textContent+'&nbsp;');
    });
import Swiper, { EffectFade, Lazy, Navigation } from 'swiper';
import menu from './modules/menu';
import { lenis } from './modules/scroll/leniscroll';
import Headroom from 'headroom.js';
import 'current-device';
const { useState } = require("./modules/helpers/helpers");
import './modules/form';
import { sideSwitchArrow } from './modules/effects/sideSwitchArrow';
import { getGalleryList, getGallerySlider } from './modules/gallery/getGallerySlider';


menu();

new Headroom(document.querySelector('.header')).init();

Swiper.use([Navigation, EffectFade, Lazy]);

{

    const [ pending, setPending, usePendingEffect ] = useState(false);


    usePendingEffect(val => {
        if (val) {
            document.querySelector('.gallery-slider').classList.add('pending');
        } else {
            document.querySelector('.gallery-slider').classList.remove('pending');
        }
    })

    const $container = document.querySelector('[data-gallery-slider]')
    const gallerySlider = new Swiper($container, {
        loop: true,
        preloadImages: false,
        watchSlidesVisibility: true,
        prevNext: 2,
      slidesPerView: 'auto',
        lazy: {
            enabled: true,
            loadPrevNext: true,
            loadPrevNextAmount: 2,
            loadOnTransitionStart: false,
            threshold: 50,
        },
        // navigation: {
        //     nextEl: $container.querySelector('[class*="-next"'),
        //     prevEl: $container.querySelector('[class*="-prev"')
        // }
    });

    sideSwitchArrow(
        gallerySlider,
        $container.querySelector('[class*="-next"'),
        $container.querySelector('.swiper-wrapper')

    )
    const [ gallerySliderState, setGallerySlider, useGallerySliderEffect ] = useState({
        title: '',
        gallery: [],
        img: '',
    });
    
    
    //data-gallery-id
    
    useGallerySliderEffect((state) => {

        const $miniImage = document.querySelector('[data-gallery-mini-image]');
        if (state.miniFlatImage) {
            $miniImage.src = state.miniFlatImage;
            $miniImage.style.opacity = 1;
        } else {
            $miniImage.style.opacity = 0;
        }
        console.log(state);
        setPending(true);
        $container.querySelector('.swiper-wrapper').innerHTML = state.gallery.map(el => `
        <div class="swiper-slide" style="background-image: url(${el})">
        <img src="${el}" class="swiper-lazy" loading="lazy">
        </div>
        `).join('');
        
        gallerySlider.update();
        setTimeout(() => {
            setPending(false);
            if (document.querySelector('[data-active-style]')) {
                document.querySelector('[data-active-style]').innerHTML = `
                    [data-gallery-id="${state.type}"] {
                        background: white !important;
                        color: rgb(0, 26, 88);
                        border-radius: 12px;
                    }
                `;
            } else {
                document.body.insertAdjacentHTML('beforeend', `
                    <style data-active-style>
                        [data-gallery-id="${state.type}"] {
                            background: white !important;
                            color: rgb(0, 26, 88);
                            border-radius: 12px;
                        }
                    </style>
                `);
            }
        }, 1000);

        document.querySelectorAll('.gallery-slider__bottom .thefloors-custom-widget-link').forEach(el => {
            el.style.display = state.type_gallery === 'secret' ? '' : 'none';
        })
    })

    const [ galleryList, setgalleryList, useGalleryListEffect ] = useState([]);


    getGalleryList()
        .then(res => {
            setgalleryList(res.data.gallery_list);

            const data = res.data.gallery_list[0];
        if (data && document.documentElement.classList.contains('mobile')) {
            setGallerySlider({
                title: 'AAAAA',
                gallery: [ ...data.gallery.map(el => el.img_mob ? el.img_mob : el.img) ],
                miniFlatImage: data.img,
                type: data.type,
                type_gallery: data.type_gallery
            });
            return;
        }
        if (data) {
            setGallerySlider({
                title: 'AAAAA',
                gallery: [ ...data.gallery.map(el => el.img) ],
                miniFlatImage: data.img,
                type: data.type,
                type_gallery: data.type_gallery
            })
        }

        });
    
    
    document.querySelector('body').addEventListener('click',function(evt){
        const target = evt.target.closest('[data-gallery-id]');
        if (!target) return;
        const id = target.dataset.galleryId;

        const data = galleryList().find(el => el.type == id);

        if (data && document.documentElement.classList.contains('mobile')) {
            setGallerySlider({
                title: 'AAAAA',
                gallery: [ ...data.gallery.map(el => el.img_mob ? el.img_mob : el.img) ],
                miniFlatImage: data.img,
                type: data.type,
                type_gallery: data.type_gallery
            });
            return;
        }

        if (data) {
            setGallerySlider({
                title: 'AAAAA',
                gallery: [ ...data.gallery.map(el => el.img) ],
                miniFlatImage: data.img,
                type: data.type,
                type_gallery: data.type_gallery
            })
        }
    
        // getGallerySlider(id)
        //     .then(({ data }) => {
        //         setGallerySlider({
        //             ...data
        //         })
        //         console.log(res);
        //     })
    
    });
}

document.body.addEventListener('click',function(evt){
    // const target = evt.target.closest('[data-cloned]');
    // if (!target) {
    //     document.querySelectorAll('[data-cloned]').forEach(el => el.remove());
    // }

    const mini = evt.target.closest('[data-gallery-mini-image]');
    if (mini) {
        const clonedNode = mini.cloneNode(true);
        clonedNode.dataset.cloned = true;
        clonedNode.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            width: 85%;
            height: 85%;
            transform: translate(-50%,-50%);
            z-index: 10;
            object-fit: contain;
            max-width: none;
            
            border-radius: 12px;
            animation: fadeIn .25s ease-out 1;
            cursor: zoom-out;
        `;
        document.body.append(clonedNode);
        
        // document.documentElement.style.overflow = 'hidden';

        // clonedNode.setAttribute('data-lenis-prevent', true);
        clonedNode.removeAttribute('data-gallery-mini-image');
        clonedNode.addEventListener('click',function(evt){
            clonedNode.remove();
        }, {
            once: true
        });
    } else {
        // document.documentElement.style.overflow = '';
        document.querySelectorAll('[data-cloned]').forEach(el => el.remove());
    }
});


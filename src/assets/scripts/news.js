import Swiper, { EffectFade, Lazy, Navigation } from 'swiper';
import menu from './modules/menu';
import { lenis } from './modules/scroll/leniscroll';
import Headroom from 'headroom.js';
import 'current-device';
const { useState } = require("./modules/helpers/helpers");
import './modules/form';
import getNews from './modules/news/getNews';
import { newsCard } from './modules/news/newsCard';
import { gsap } from 'gsap/all';
menu();

new Headroom(document.querySelector('.header')).init();


const [tab,setTab,useTabEffect] = useState({
    selector: 'data-news-tabs',
    active: 0
});

const [ news, setNews, useNewsEffect ] = useState({
    pending: false,
    tabs: document.querySelector('[data-news-tabs]'),
    container: document.querySelector('.news-container'),
    data: []
});


useNewsEffect(({ data, container }) => {
    container.innerHTML = data.map(el => newsCard(el)).join('');
});
useNewsEffect(({ pending, container, tabs }) => {
    gsap.to(container, {
        autoAlpha: pending ? 0.5 : 1,
    });

    pending ? 
    container.classList.add('loading') :
    container.classList.remove('loading');
});



useTabEffect((e) => {
    const { selector, active } = e;
    document.querySelectorAll(`[${selector}] .tabs__tab`)
    .forEach((singleTab, index) => {
            if (index === active) {
                singleTab.classList.add('active');
                setNews({
                    ...news(),
                    pending: true
                })
                getNews(singleTab.dataset.type)
                    .then(el => {
                        setNews({
                            ...news(),
                            data: el.data
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        setNews({
                            ...news(),
                            pending: false
                        })
                    })
                return;
            }
            singleTab.classList.remove('active');
        });
});

document.querySelector(`[${tab().selector}]`).addEventListener('click', (evt) => {
    const target = evt.target.closest('.tabs__tab');
    if (!target) return;
    if (news().pending) return;
    document.querySelectorAll(`[${tab().selector}] .tabs__tab`).forEach((el,index) => {
        if (target === el) {
            setTab({
                ...tab(),
                active: index
            })
        }
    })
})

setTab({
    ...tab(),
    active: 0
});




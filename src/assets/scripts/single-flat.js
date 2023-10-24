import 'current-device';
const { default: createFloorSvg } = require("./modules/createFloorSvg");
import * as flats from './testData/flats.json';
import * as mockFloor from './testData/mockFloor.json';
import { useState } from './modules/helpers/helpers';
import Popup from './modules/popup/PopupView';

const flats1 = flats.default;
const floorInfo = mockFloor.default;


const [ floorData, setFloorData, usefloorDataEffect ] = useState({});


usefloorDataEffect(({ floor }) => {
    const a = createFloorSvg(false, './assets/images/genplan-img.jpg', flats1, floorInfo.size, 471, floorInfo.flatsIds);
    document.querySelector('[data-floor-container]').innerHTML = a;
    
    document.querySelectorAll('[data-current-floor]').forEach(el => el.textContent = floor);
    document.querySelectorAll('[data-floor_direction]').forEach(el => {
        if (el.dataset.floor_direction === 'prev') {
            el.dataset.floor_value = +floor - 1;
            if ((+floor - 1) <= 0) {
                el.setAttribute('disabled', true);
            } else {
                el.removeAttribute('disabled');

            }
        }
        if (el.dataset.floor_direction === 'next') {
            el.dataset.floor_value = +floor + 1
        }
    });

});


const params = new URLSearchParams(window.location.search);

const flatId = params.get('id');

const flatData = flats1.find(el => el.id == flatId);

if (flatData) {
    document.querySelector('[data-flat-img]').src = flatData.img_big;
}

setFloorData({
    ...floorData,
    floor: 1
})

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-floor_btn]');
    if (!target) return;
    setFloorData({
        ...floorData(),
        floor: target.dataset.floor_value
    })
})



function handleTooltip(params = {}) {
    const toolip = document.querySelector('.floor-tooltip');
    const selfWidth = toolip.getBoundingClientRect().width;
    const infoItems = document.querySelectorAll('[data-info-flat]');
    let state = 'off';
    
        

    return function(target, action) {
        if (action === 'off' && state === 'off') return;
        action === 'off' ? 
        toolip.classList.remove('active') : 
        toolip.classList.add('active');

        if (action === 'off') {
            state = action;
                return;
        }
        const { y  } = target.getBBox();
        const { left, top  } = target.getBoundingClientRect();

        const edgeX = Math.min(left - selfWidth / 2, window.innerWidth - selfWidth);
        params.dontPositionTooltip ? null : toolip.style.transform = `translate(${edgeX}px, ${top}px)`;

        infoItems.forEach(el => {
            el.textContent  = target.dataset[el.dataset.infoFlat]
        });
        if (typeof params.additionalAction === 'function') params.additionalAction(toolip, target.dataset.id);



        state = action;
    }

}

const tooltip = handleTooltip({
    dontPositionTooltip: !document.documentElement.classList.contains('desktop'),
    additionalAction: (tooltip, flatId) => {
        if (document.documentElement.classList.contains('desktop')) return;
        if (!tooltip.querySelector('[data-mobile-tooltip-link]')) {
            tooltip.insertAdjacentHTML('beforeend', `
                <a data-mobile-tooltip-link href="#">Перейти</a>
            `)
        }
        tooltip.querySelector('[data-mobile-tooltip-link]').setAttribute('href', `/single-flat?id=${flatId}`);
    }
});

if (document.documentElement.classList.contains('desktop')) {
    document.body.addEventListener('mousemove', (evt) => {
        if (!evt.target.closest('.js-s3d-flat__polygon')) {
            tooltip(evt.target.closest('.js-s3d-flat__polygon'), 'off');
            return;
        }
        tooltip(evt.target.closest('.js-s3d-flat__polygon'), 'on');
    })
} else {
    document.body.addEventListener('click', (evt) => {
        if (!evt.target.closest('.js-s3d-flat__polygon')) {
            tooltip(evt.target.closest('.js-s3d-flat__polygon'), 'off');
            return;
        }
        tooltip(evt.target.closest('.js-s3d-flat__polygon'), 'on');
    })
}



document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-flat-img]');
    if (!target) return;

    new Popup(target.getAttribute('src')).render();
})
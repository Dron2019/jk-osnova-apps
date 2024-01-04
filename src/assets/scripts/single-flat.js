import 'current-device';
const { default: createFloorSvg } = require("./modules/createFloorSvg");
import { useState } from './modules/helpers/helpers';
import Popup from './modules/popup/PopupView';

import './modules/form';





function handleTooltip(params = {}) {
    const toolip = document.querySelector('.floor-tooltip');
    const selfWidth = toolip.getBoundingClientRect().width;
    const selfHeight = toolip.getBoundingClientRect().height;
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
        params.dontPositionTooltip ? null : toolip.style.transform = `translate(${edgeX}px, ${top - selfHeight}px)`;

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
        tooltip.querySelector('[data-mobile-tooltip-link]').setAttribute('href', `/single-flat-smarto?id=${flatId}`);
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


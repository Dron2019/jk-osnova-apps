import 'current-device';

function handleTooltip(evt) {
    const infoItems = document.querySelectorAll('[data-info-flat]');

    return function(evt) {
        infoItems.forEach(el => {
            el.textContent  = evt.target.dataset[el.dataset.infoFlat]
        })
    }

}

const tooltip = handleTooltip();


document.querySelectorAll('svg [data-id]').forEach(el => {
  el.addEventListener(document.documentElement.classList.contains('desktop') ? 'mouseenter' : 'click',function(evt){
    console.log(evt.target);
    tooltip(evt);
  });
})


function handleMobileFloorClick() {
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
                <a data-mobile-tooltip-link href="#">Перейти до квартири</a>
            `)
        }
        tooltip.querySelector('[data-mobile-tooltip-link]').setAttribute('href', `/single-flat?id=${flatId}`);
    }
  });
  
  if (!document.documentElement.classList.contains('desktop')) {
    document.body.addEventListener('click', (evt) => {
        if (!evt.target.closest('.js-s3d-flat__polygon')) {
            tooltip(evt.target.closest('.js-s3d-flat__polygon'), 'off');
            return;
        }
        if (evt.target.closest('.floor-tooltip__close')) {
          tooltip(evt.target.closest('.js-s3d-flat__polygon'), 'off');
          return;
        }
        evt.preventDefault();
        tooltip(evt.target.closest('.js-s3d-flat__polygon'), 'on');
    })
  }
}

handleMobileFloorClick();

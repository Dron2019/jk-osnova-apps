import 'current-device';


if (document.documentElement.classList.contains('desktop')) {
  function handleTooltip(evt, action) {
    const toolip = document.querySelector('[data-genplan-tooltip]');
    const selfWidth = toolip.getBoundingClientRect().width;
    const text = toolip.querySelector('[data-genplan-tooltip-text]');

    
    return function(evt, action) {
      action === 'off' ? 
      toolip.classList.remove('active') : 
      toolip.classList.add('active');
      const { y  } = evt.target.getBBox();
      console.log(toolip.getBoundingClientRect());
      const { left, top  } = evt.target.getBoundingClientRect();
      toolip.style.transform = `translate(${Math.max(left- toolip.getBoundingClientRect().width, 0)}px, ${evt.pageY - toolip.getBoundingClientRect().width / 2}px)`;
      text.textContent = evt.target.dataset.floor;
    }

  }
  
  const tooltip = handleTooltip();
  
  
  document.querySelectorAll('svg [data-floor]').forEach(el => {
    el.addEventListener('mouseenter',function(evt){
      tooltip(evt, 'on');
    });
  })
  
  document.querySelectorAll('svg [data-floor]').forEach(el => {
    el.addEventListener('mouseleave',function(evt){
      tooltip(evt, 'off');
    
    });
  })
} else {
  
  const toolip = document.querySelector('[data-genplan-tooltip]');
  const text = toolip.querySelector('[data-genplan-tooltip-text]');
  toolip.insertAdjacentHTML('beforeend', `
    <a class="genplan-floor-tooltip__mob-link" href="" data-mobile-floor-link>Перейти до поверху</a>
  `);
  const link = toolip.querySelector('[data-mobile-floor-link]');

  document.body.addEventListener('click',function(evt){
    const target = evt.target.closest('path[data-floor]');
    const isTooltip = evt.target.closest('[data-genplan-tooltip]');
    if (!target && !isTooltip) {
      toolip.classList.remove('active');
      return;
    }
    
    if (evt.target.closest('.genplan-floor-tooltip__close')) {
      toolip.classList.remove('active');
      return;
    }

    // if (!isTooltip) return;
    toolip.classList.add('active');
    
    if (isTooltip) return;
    evt.preventDefault();
    text.textContent = evt.target.dataset.floor;
    link.setAttribute('href', `/single-floor?floor=${evt.target.dataset.floor}`);
  });
}


if (!document.documentElement.classList.contains('desktop')) {
  document.querySelector(".genplan-svg").scrollTo(document.querySelector(".genplan-svg").scrollWidth / 2, 0)
}
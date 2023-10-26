document.body.addEventListener('click',function(evt){
    const target = evt.target.closest('.js-popup-open');
    if (!target) return;
    document.querySelector('.formContacts_input').scrollIntoView({ 
        behavior: 'smooth'
    });
    setTimeout(() => {
        document.querySelector('.formContacts_input').focus();
    }, 1000);

});
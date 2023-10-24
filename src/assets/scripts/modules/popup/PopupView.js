import gsap from "gsap";

export default class Popup {
    constructor(href) {
      this.href = href;
      this.containerClassName = 'vr-popup';
    }
  
    render() {
      const layout = `
        <div class="${this.containerClassName}">
          <div class="${this.containerClassName}__content">
            <img src="${this.href}"></img>
          </div>
          <div class="vr-popup__close">
            <span>Закрити</span>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="white"/>
                <path d="M37.826 37.826L22.1738 22.1738M22.1738 37.826L37.826 22.1738L22.1738 37.826Z" stroke="#555568"/>
            </svg>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', layout);
      document.querySelector(`.${this.containerClassName} .${this.containerClassName}__close`)
        .addEventListener('click', () => {
          document.querySelector(`.${this.containerClassName}`).remove();
        }, { once: true });
      // this.mobMenuHandle(document.querySelector(`.${this.containerClassName}`))
    }

    mobileClosingAnimation(cb = () => {}) {
      gsap.timeline()
          .to(this.$wrapper, {
            y: '50%',
            clearProps: 'all'
          })
          .add(() => {
            document.querySelector(`.${this.containerClassName}`).remove();
            cb();
          })
    }
  
    mobMenuHandle(menu){
      if (!menu) return;
      const moveCords = {
        y: 0,
        swipeDistance: 0,
        locked: true,
        percentForClosing: 37.5, 
      }
  
  
      document.body.addEventListener('touchstart', (e) => {
        if (!menu.classList.contains(this.containerClassName)) return;
        moveCords.y = e.changedTouches[0].clientY;
        moveCords.locked = false;
        menu.style.transition = 'none';
      });
      document.body.addEventListener('touchmove', (e) => {
        if (moveCords.locked === false && e.changedTouches[0].clientY > moveCords.y && menu.classList.contains(this.containerClassName))  {
          moveCords.swipeDistance = (moveCords.y - e.changedTouches[0].clientY) * -1;
          menu.style.transform = `translateY(${(moveCords.y - e.changedTouches[0].clientY) * -1}px)`;
          // menu.style.opacity =  gsap.utils.mapRange(0, menu.getBoundingClientRect().height, 1, 0, moveCords.swipeDistance) ;
        }
      });
      document.body.addEventListener('touchend', (e) => {
        console.log(moveCords.swipeDistance);
        if (!menu.classList.contains(this.containerClassName)) return;
        if (moveCords.swipeDistance > menu.getBoundingClientRect().height * (moveCords.percentForClosing / 100)) {
          this.mobileClosingAnimation(() => {
            menu.style.transform = '';
            moveCords.swipeDistance = 0;
            moveCords.y = 0;
            moveCords.locked = true;
            menu.style.transition = '';
          });
        } else {
          gsap.to(
            `.${this.containerClassName}`, {
              y: 0,
              opacity: 1,
              clearProps: 'all'
            }
          )
        }
  
      });
    }
}



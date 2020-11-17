/* eslint-disable no-underscore-dangle */
export default class TinyCarousel {
  constructor(el, speed = 2000) {
    this.el = el;
    this.slides = el.querySelectorAll('img');
    this.interval = null;
    this.cycle = 1;
    this.speed = speed;
    this.animEl = null;
    this.mount();
  }

  mount() {
    this.el.addEventListener('mouseenter', () => {
      this.play();
    });
    this.el.addEventListener('mouseleave', () => {
      this.stop();
    });
    this._addLoadingAnimation();
  }

  play() {
    this.animEl.classList.add('slide-load');
    this.interval = setInterval(() => {
      this._toNextSlide();
    }, this.speed);
  }

  stop() {
    this.animEl.classList.remove('slide-load');
    clearInterval(this.interval);
  }

  _toNextSlide() {
    this.slides.forEach((slide) => slide.classList.remove('active'));
    this.slides[this.cycle].classList.add('active');
    this.cycle = this.cycle < this.slides.length - 1 ? this.cycle + 1 : 0;
  }

  _addLoadingAnimation() {
    this.animEl = document.createElement('div');
    this.animEl.style.cssText = `
            height: 5px;
            position: absolute;
            bottom: 0;
            width: 0%;
            background: #B6AA68;
            z-index: 100;
        `;
    this.el.appendChild(this.animEl);
  }
}

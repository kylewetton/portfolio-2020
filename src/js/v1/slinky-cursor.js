/* eslint-disable no-underscore-dangle */

const diff = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

export default class SlinkyCursor {
  constructor(settings) {
    const defaults = {
      size: 31,
      growSize: 31 * 2.5,
      laziness: 5,
      stiffness: 2.5,
    };
    this.settings = Object.assign(defaults, settings);
    this.mouse = { x: 0, y: 0 };
    this.deltaPos = { x: 0, y: 0 };
    this.scrollDiff = 0;
    this.scrollDelta = 0;
    this.pos = { x: 0, y: 0 };
    this.hover = false;
    this._animate = this._animate.bind(this);
  }

  init() {
    this._createPest();
    this._createDot();
    this._addEventListener();
    this._animate();
  }

  _createPest() {
    this.pest = document.createElement('div');
    this.pest.classList.add('cursor-pest');
    this.pest.style.height = `${this.settings.size}px`;
    document.body.appendChild(this.pest);
  }

  _createDot() {
    this.dot = document.createElement('div');
    this.dot.classList.add('cursor-dot');
    const dotSpinner = document.createElement('div');
    dotSpinner.classList.add('cursor-dot--spinner');
    const dotInner = document.createElement('div');
    dotInner.classList.add('cursor-dot--inner');
    dotSpinner.appendChild(dotInner);
    this.dot.appendChild(dotSpinner);
    document.body.appendChild(this.dot);
  }

  _addEventListener() {
    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      this.mouse = { x, y };
    });

    document.addEventListener('mouseover', (e) => {
      if (Object.prototype.hasOwnProperty.call(e.target.dataset, 'cursor')) {
        this.dot.classList.add('hover');
        this.pest.classList.add('hover');
      } else if (Object.prototype.hasOwnProperty.call(e.target.dataset, 'cursorload')) {
        this.dot.classList.add('loading');
        this.pest.classList.add('loading');
      } else if (Object.prototype.hasOwnProperty.call(e.target.dataset, 'cursorhide')) {
        this.dot.classList.add('cursor-hidden');
        this.pest.classList.add('cursor-hidden');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (Object.prototype.hasOwnProperty.call(e.target.dataset, 'cursor')) {
        this.dot.classList.remove('hover');
        this.pest.classList.remove('hover');
      } else if (Object.prototype.hasOwnProperty.call(e.target.dataset, 'cursorload')) {
        this.dot.classList.remove('loading');
        this.pest.classList.remove('loading');
      } else if (Object.prototype.hasOwnProperty.call(e.target.dataset, 'cursorhide')) {
        this.dot.classList.remove('cursor-hidden');
        this.pest.classList.remove('cursor-hidden');
      }
    });
  }

  _animate() {
    const { x: xMouse, y: yMouse } = this.mouse;
    const { x: xPos, y: yPos } = this.pos;
    const { x: xDelta, y: yDelta } = this.deltaPos;
    const { laziness, stiffness, size } = this.settings;
    this.deltaPos = { x: xMouse - xPos, y: yMouse - yPos };

    this.pos = { x: xPos + xDelta / laziness, y: yPos + yDelta / laziness };
    this.dot.style.cssText = `width: ${size}px; height: ${size}px; transform: translate(${xMouse - size / 2}px, ${yMouse - size / 2}px)`;

    // Slinky

    const angleDeg = (Math.atan2(yMouse - this.pos.y, xMouse - this.pos.x) * 180) / Math.PI;

    const stretchWidth = size
        + diff(this.pos.x, this.pos.y, this.mouse.x, this.mouse.y)
          / stiffness;
    this.pest.style.cssText += `width: ${stretchWidth}px`;

    this.pest.style.cssText += `transform: translate(
        ${this.pos.x - size / 2}px,
        ${this.pos.y - size / 2}px) rotate(${Math.floor(angleDeg)}deg)`;

    requestAnimationFrame(this._animate);
  }
}

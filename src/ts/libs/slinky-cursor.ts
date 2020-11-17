/* eslint-disable no-underscore-dangle */

const diff = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1);

export default class SlinkyCursor {

  settings: SlinkySettings;
  mouse: Point;
  deltaPos: Point;
  scrollDiff: number;
  scrollDelta: number;
  pos: Point;
  hover: boolean;
  pest: HTMLElement | null;
  dot: HTMLElement | null;

  constructor(settings: SlinkySettings) {
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
    this.pest = null;
    this.dot = null;
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

    const handleCursorState = (e: Event, method: 'add' | 'remove') => {
      const target = e.target as HTMLElement;

      if (Object.keys(target.dataset).length === 0 && target.dataset.constructor === Object) return;

      const checkCursorProperty = (element: HTMLElement, cursorType: string) => (
        Object.prototype.hasOwnProperty.call(element.dataset, cursorType)
      );

      const modifyCursorState = (method: 'add' | 'remove' , className: string) => {
        if (method === 'add') {
          this.dot && this.dot.classList.add(className);
          this.pest && this.pest.classList.add(className);
        } else {
          this.dot && this.dot.classList.remove(className);
          this.pest && this.pest.classList.remove(className);
        }
      }

      switch(true) {
        case (checkCursorProperty(target, 'cursor')) :
          modifyCursorState(method, 'hover');
        break;
        case (checkCursorProperty(target, 'cursorload')) :
          modifyCursorState(method, 'loading');
        break;
        case (checkCursorProperty(target, 'cursorhide')) :
          modifyCursorState(method, 'cursor-hidden');
        break;
      }
    };

    document.addEventListener('mouseover', (e) => handleCursorState(e, 'add'));

    document.addEventListener('mouseout', (e) => handleCursorState(e, 'remove'));

    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      this.mouse = { x, y };
    });
  }

  _animate() {
    const { x: xMouse, y: yMouse } = this.mouse;
    const { x: xPos, y: yPos } = this.pos;
    const { x: xDelta, y: yDelta } = this.deltaPos;
    const { laziness, stiffness, size } = this.settings;
    this.deltaPos = { x: xMouse - xPos, y: yMouse - yPos };

    this.pos = { x: xPos + xDelta / laziness, y: yPos + yDelta / laziness };
    if (this.dot) {
      this.dot.style.cssText = `width: ${size}px; height: ${size}px; transform: translate(${xMouse - size / 2}px, ${yMouse - size / 2}px)`;
    }

    // Slinky

    const angleDeg = (Math.atan2(yMouse - this.pos.y, xMouse - this.pos.x) * 180) / Math.PI;

    const stretchWidth = size
        + diff(this.pos.x, this.pos.y, this.mouse.x, this.mouse.y)
          / stiffness;
    if (this.pest) {
      this.pest.style.cssText += `width: ${stretchWidth}px`;

      this.pest.style.cssText += `transform: translate(
          ${this.pos.x - size / 2}px,
          ${this.pos.y - size / 2}px) rotate(${Math.floor(angleDeg)}deg)`;
    }
    requestAnimationFrame(this._animate);
  }
}

/* eslint-disable no-underscore-dangle */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var diff = function (x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); };
    var SlinkyCursor = /** @class */ (function () {
        function SlinkyCursor(settings) {
            var defaults = {
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
        SlinkyCursor.prototype.init = function () {
            this._createPest();
            this._createDot();
            this._addEventListener();
            this._animate();
        };
        SlinkyCursor.prototype._createPest = function () {
            this.pest = document.createElement('div');
            this.pest.classList.add('cursor-pest');
            this.pest.style.height = this.settings.size + "px";
            document.body.appendChild(this.pest);
        };
        SlinkyCursor.prototype._createDot = function () {
            this.dot = document.createElement('div');
            this.dot.classList.add('cursor-dot');
            var dotSpinner = document.createElement('div');
            dotSpinner.classList.add('cursor-dot--spinner');
            var dotInner = document.createElement('div');
            dotInner.classList.add('cursor-dot--inner');
            dotSpinner.appendChild(dotInner);
            this.dot.appendChild(dotSpinner);
            document.body.appendChild(this.dot);
        };
        SlinkyCursor.prototype._addEventListener = function () {
            var _this = this;
            var handleCursorState = function (e, method) {
                var target = e.target;
                if (Object.keys(target.dataset).length === 0 && target.dataset.constructor === Object)
                    return;
                var checkCursorProperty = function (element, cursorType) { return (Object.prototype.hasOwnProperty.call(element.dataset, cursorType)); };
                var modifyCursorState = function (method, className) {
                    if (method === 'add') {
                        _this.dot && _this.dot.classList.add(className);
                        _this.pest && _this.pest.classList.add(className);
                    }
                    else {
                        _this.dot && _this.dot.classList.remove(className);
                        _this.pest && _this.pest.classList.remove(className);
                    }
                };
                switch (true) {
                    case (checkCursorProperty(target, 'cursor')):
                        modifyCursorState(method, 'hover');
                        break;
                    case (checkCursorProperty(target, 'cursorload')):
                        modifyCursorState(method, 'loading');
                        break;
                    case (checkCursorProperty(target, 'cursorhide')):
                        modifyCursorState(method, 'cursor-hidden');
                        break;
                }
            };
            document.addEventListener('mouseover', function (e) { return handleCursorState(e, 'add'); });
            document.addEventListener('mouseout', function (e) { return handleCursorState(e, 'remove'); });
            window.addEventListener('mousemove', function (e) {
                var x = e.clientX, y = e.clientY;
                _this.mouse = { x: x, y: y };
            });
        };
        SlinkyCursor.prototype._animate = function () {
            var _a = this.mouse, xMouse = _a.x, yMouse = _a.y;
            var _b = this.pos, xPos = _b.x, yPos = _b.y;
            var _c = this.deltaPos, xDelta = _c.x, yDelta = _c.y;
            var _d = this.settings, laziness = _d.laziness, stiffness = _d.stiffness, size = _d.size;
            this.deltaPos = { x: xMouse - xPos, y: yMouse - yPos };
            this.pos = { x: xPos + xDelta / laziness, y: yPos + yDelta / laziness };
            if (this.dot) {
                this.dot.style.cssText = "width: " + size + "px; height: " + size + "px; transform: translate(" + (xMouse - size / 2) + "px, " + (yMouse - size / 2) + "px)";
            }
            // Slinky
            var angleDeg = (Math.atan2(yMouse - this.pos.y, xMouse - this.pos.x) * 180) / Math.PI;
            var stretchWidth = size
                + diff(this.pos.x, this.pos.y, this.mouse.x, this.mouse.y)
                    / stiffness;
            if (this.pest) {
                this.pest.style.cssText += "width: " + stretchWidth + "px";
                this.pest.style.cssText += "transform: translate(\n          " + (this.pos.x - size / 2) + "px,\n          " + (this.pos.y - size / 2) + "px) rotate(" + Math.floor(angleDeg) + "deg)";
            }
            requestAnimationFrame(this._animate);
        };
        return SlinkyCursor;
    }());
    exports.default = SlinkyCursor;
});

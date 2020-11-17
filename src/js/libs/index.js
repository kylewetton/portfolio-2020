var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./slinky-cursor", "./vidya", "./tiny-carousel"], function (require, exports, slinky_cursor_1, vidya_1, tiny_carousel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TinyCarousel = exports.Vidya = exports.SlinkyCursor = void 0;
    slinky_cursor_1 = __importDefault(slinky_cursor_1);
    vidya_1 = __importDefault(vidya_1);
    tiny_carousel_1 = __importDefault(tiny_carousel_1);
    exports.SlinkyCursor = slinky_cursor_1.default;
    exports.Vidya = vidya_1.default;
    exports.TinyCarousel = tiny_carousel_1.default;
});

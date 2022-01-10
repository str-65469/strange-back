"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCompressedSprite = void 0;
const avatars_1 = require("@dicebear/avatars");
const GridyStyle = require("@dicebear/avatars-gridy-sprites");
const BottsStyle = require("@dicebear/avatars-bottts-sprites");
const config_1 = require("../../configs/config");
function generateSprite(options) {
    const AvatarStyle = Math.round(Math.random()) % 2 === 0 ? GridyStyle : BottsStyle;
    const svg = (0, avatars_1.createAvatar)(AvatarStyle, options);
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function generateRandomSprite() {
    return generateSprite({
        seed: Math.random() + 'random sprite svg',
        size: config_1.configs.general.DICEBEAR_MAX_SIZE,
    });
}
function generateCompressedSprite(benchmark = false) {
    let sprite = generateRandomSprite();
    let buffer = Buffer.from(sprite);
    let tried = 0;
    let size = buffer.length;
    while (!(size > config_1.configs.general.DICEBEAR_MIN_SIZE && size < config_1.configs.general.DICEBEAR_MAX_SIZE)) {
        sprite = generateRandomSprite();
        buffer = Buffer.from(sprite);
        size = buffer.length;
        tried++;
    }
    if (benchmark) {
        return tried;
    }
    return sprite;
}
exports.generateCompressedSprite = generateCompressedSprite;
//# sourceMappingURL=dicebear.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralHelper = void 0;
class GeneralHelper {
    static round(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    static range(start, end, step = 1) {
        if (step <= 0) {
            return [];
        }
        const len = Math.floor((end - start) / step) + 1;
        return Array(len)
            .fill(null)
            .map((_, idx) => this.round(start + idx * step));
    }
    static random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
exports.GeneralHelper = GeneralHelper;
//# sourceMappingURL=general.helper.js.map
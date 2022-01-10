"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomGenerator = void 0;
class RandomGenerator {
    static randomString(length = 40) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ^%&$&^%*$abcdefghijklmnopq^%&$rstuvwxyz01234^%&$56789';
        const charactersLength = characters.length;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static randomIntInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static randomArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
exports.RandomGenerator = RandomGenerator;
//# sourceMappingURL=random_generator.js.map
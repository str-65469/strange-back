export class RandomGenerator {
    public static randomString(length = 40) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ^%&$&^%*$abcdefghijklmnopq^%&$rstuvwxyz01234^%&$56789';
        const charactersLength = characters.length;
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static randomIntInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static randomArray(array: Array<any>) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

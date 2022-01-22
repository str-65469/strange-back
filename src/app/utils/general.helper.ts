import { DateHelper } from './general/dater.helper';

export class GeneralHelper {
    public static readonly dater = new DateHelper();

    /**
     * @example
     * 10		= 10
     * 1.777	= 1.78
     * 9.1	= 9.1
     */
    public static round(num: number): number {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    public static range(start: number, end: number, step: number = 1): Array<number> {
        if (step <= 0) {
            return [];
        }

        const len = Math.floor((end - start) / step) + 1;

        return Array(len)
            .fill(null)
            .map((_, idx) => this.round(start + idx * step));
    }

    public static random(arr: Array<any>) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public static isFloatingNumbersEqual(n1, n2) {
        return Math.abs(n1 - n2) < Number.EPSILON;
    }
}

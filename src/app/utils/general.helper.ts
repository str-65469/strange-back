class DateHelper {
    addMinutes(minutesToAdd: number = 1) {
        var startingTimeStamp = new Date();
        var endingTimeStamp = new Date(startingTimeStamp.getTime() + minutesToAdd * 60 * 1000);

        return {
            startingTimeStamp,
            endingTimeStamp,
        };
    }

    timeDifferenceMinutes(date1: string | Date, date2: string | Date) {
        const tempDate1 = new Date(date1);
        const tempDate2 = new Date(date2);
        const diffTime = Math.abs(tempDate2.getTime() - tempDate1.getTime());

        const sec = Math.ceil(diffTime / 1000);
        const min = sec / 60;
        const hour = min / 60;
        const day = hour / 24;

        return {
            sec: Math.trunc(sec),
            min: Math.trunc(min),
            hour: Math.trunc(hour),
            day: Math.trunc(day),
        };

        // return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // day
    }
}

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
}

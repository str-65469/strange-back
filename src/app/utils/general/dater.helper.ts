interface TimeDifference {
    sec: number;
    min: number;
    hour: number;
    day: number;
}

export class DateHelper {
    timeDifference(date1: string | Date, date2?: string | Date): TimeDifference | null {
        const tempDate2OrNow = date2 ?? new Date();

        const tempDate1 = new Date(date1);
        const tempDate2 = new Date(tempDate2OrNow);

        if (tempDate1.getTime() > tempDate2.getTime()) {
            return null;
        }

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
    }

    timeLeft(dates: TimeDifference, maxSeconds: number): TimeDifference {
        const leftSec = Math.ceil(maxSeconds - dates.sec);
        const leftMin = leftSec / 60;
        const leftHour = leftMin / 60;
        const leftDay = leftHour / 24;

        return {
            sec: Math.trunc(leftSec),
            min: Math.trunc(leftMin),
            hour: Math.trunc(leftHour),
            day: Math.trunc(leftDay),
        };
    }

    minuteToSecond(min: number) {
        return min * 60;
    }
}

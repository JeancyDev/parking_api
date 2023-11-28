import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";

export class SimpleDateDto {

    @ApiProperty({ type: Number, description: 'El año de la fecha', example: 2023 })
    year: number;

    @ApiProperty({ type: Number, description: 'El mes de la fecha', example: 10, minimum: 0, maximum: 11 })
    @Min(0)
    @Max(11)
    month: number;

    @ApiProperty({ type: Number, description: 'El día de la fecha', example: 15, minimum: 1, maximum: 31 })
    @Min(1)
    @Max(31)
    day: number;
}

export class SimpleTimeDto {
    @ApiProperty({ type: Number, description: 'La hora de la fecha', example: 10, minimum: 0, maximum: 23 })
    @Min(0)
    @Max(23)
    hour: number;

    @ApiProperty({ type: Number, description: 'Los minutos de la fecha', example: 0, minimum: 0, maximum: 59, required: false, default: 0 })
    @Min(0)
    @Max(59)
    minute?: number;
}

export class SimpleTimeSpan {
    years: number;
    months: number;
    days: number;
    hours: number;
}

export function getSimpleDate(date: Date): SimpleDateDto {
    const simple: SimpleDateDto = {
        day: date.getDate(),
        year: date.getFullYear(),
        month: date.getMonth() + 1
    }
    return simple;
}

export function getSimpleTime(date: Date): SimpleTimeDto {
    const simple: SimpleTimeDto = {
        hour: date.getHours(),
        minute: date.getMinutes()
    }
    return simple;
}

export function getDateForDate(date: Date, time?: Date): Date {
    if (!time) {
        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );
    } else {
        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            time.getHours(),
            time.getMinutes()
        )
    }
}

export function getDateForSimple(simpleDate: SimpleDateDto, simpleTime?: SimpleTimeDto): Date {
    if (!simpleTime) {
        return new Date(
            simpleDate.year,
            simpleDate.month - 1,
            simpleDate.day
        );
    } else {
        return new Date(
            simpleDate.year,
            simpleDate.month - 1,
            simpleDate.day,
            simpleTime.hour,
            simpleTime.minute
        );
    }
}

export function getTimeBetween(startDate: Date, endDate?: Date) {
    if (!endDate)
        return endDate.valueOf() - startDate.valueOf();
    else
        return new Date().valueOf() - startDate.valueOf();
}

export function getDateAfterTime(date: Date, time: number) {
    return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours() + time, date.getMinutes());
}

export function isDateBetween(start: Date, end: Date, date: Date): boolean {
    return isDateAfter(start, date) && isDateAfter(date, end);
}

export function isDateAfter(start: Date, date: Date): boolean {
    if (start.getFullYear() <= date.getFullYear()) {
        if (start.getFullYear() < date.getFullYear()) {
            return true;
        }
        else {
            if (start.getMonth() <= date.getMonth()) {
                if (start.getMonth() < date.getMonth()) {
                    return true;
                } else {
                    if (start.getDate() <= date.getDate()) {
                        if (start.getDate() < date.getDate()) {
                            return true;
                        } else {
                            if (start.getHours() <= date.getHours()) {
                                if (start.getHours() < date.getHours()) {
                                    return true;
                                } else {
                                    if (start.getMinutes() <= date.getMinutes()) {
                                        if (start.getMinutes() < date.getMinutes()) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    } else {
                                        return false;
                                    }
                                }
                            } else {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
    }
    else {
        return false;
    }
}
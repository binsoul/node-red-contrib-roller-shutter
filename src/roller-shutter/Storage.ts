import { Configuration } from './Configuration';

function parseTime(time: string, timestamp: Date): Date | null {
    let hour, minute;
    const pm = time.match(/p/i) !== null;
    const num = time.replace(/[^0-9]/g, '');

    // Parse for hour and minute
    switch (num.length) {
        case 4:
            hour = parseInt(num[0] + num[1], 10);
            minute = parseInt(num[2] + num[3], 10);
            break;
        case 3:
            hour = parseInt(num[0], 10);
            minute = parseInt(num[1] + num[2], 10);
            break;
        case 2:
        case 1:
            hour = parseInt(num[0] + (num[1] || ''), 10);
            minute = 0;
            break;
        default:
            return null;
    }

    // Make sure hour is in 24-hour format
    if (pm && hour > 0 && hour < 12) {
        hour += 12;
    }

    // Keep within range
    if (hour <= 0 || hour >= 24) {
        hour = 0;
    }
    if (minute < 0 || minute > 59) {
        minute = 0;
    }

    const result = new Date(timestamp.getTime());
    result.setHours(hour, minute, 0);

    return result;
}

function selectTime(timestamp: Date, workdayTime: string | null, weekendTime: string | null): number | null {
    const dayOfWeek = timestamp.getDay();
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

    if (!isWeekend) {
        if (workdayTime === null) {
            return null;
        }

        const parsedTimeWorkday = parseTime(workdayTime, timestamp);
        return parsedTimeWorkday !== null ? parsedTimeWorkday.getTime() : null;
    }

    if (weekendTime === null) {
        return null;
    }

    const parsedTimeWeekend = parseTime(weekendTime, timestamp);

    return parsedTimeWeekend !== null ? parsedTimeWeekend.getTime() : null;
}

function formatTime(timestamp: number) {
    const date = new Date(timestamp);

    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

function remap(value: number, fromMinimum: number, fromMaximum: number, toMinimum: number, toMaximum: number) {
    const fromRange = fromMaximum - fromMinimum;
    const toRange = toMaximum - toMinimum;

    return ((value - fromMinimum) * toRange) / fromRange + toMinimum;
}

export class Storage {
    private configuration: Configuration;

    private mode = '';
    private modeReason = '';
    private special = '';
    private specialReason = '';
    private fixedTime: number | null = null;
    private position: number | null = null;

    private outsideIlluminance: number | null = null;
    private outsideTemperature: number | null = null;
    private insideTemperature: number | null = null;
    private window: 'open' | 'closed' | 'tilted' | null = null;
    private sunAzimuth: number | null = null;
    private sunAltitude: number | null = null;
    private manualPosition: number | null = null;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    getOutsideIlluminance(): number | null {
        return this.outsideIlluminance;
    }

    setOutsideIlluminance(value: number | null) {
        this.outsideIlluminance = value;
    }

    getOutsideTemperature(): number | null {
        return this.outsideTemperature;
    }

    setOutsideTemperature(value: number | null) {
        this.outsideTemperature = value;
    }

    getInsideTemperature(): number | null {
        return this.insideTemperature;
    }

    setInsideTemperature(value: number | null) {
        this.insideTemperature = value;
    }

    getWindow(): string | null {
        return this.window;
    }

    setWindow(value: string) {
        if (value === 'open' || value === 'closed' || value === 'tilted') {
            this.window = value;
        } else {
            this.window = null;
        }
    }

    getSunAzimuth(): number | null {
        return this.sunAzimuth;
    }

    setSunAzimuth(value: number | null) {
        this.sunAzimuth = value;
    }

    getSunAltitude(): number | null {
        return this.sunAltitude;
    }

    setSunAltitude(value: number | null) {
        this.sunAltitude = value;
    }

    getManualPosition(): number | null {
        return this.manualPosition;
    }

    setManualPosition(value: number | null) {
        if (value === null) {
            this.manualPosition = null;
            return;
        }

        let result = remap(value, this.configuration.controllerValueClosed, this.configuration.controllerValueOpen, 0, 100);
        result = Math.round(result);

        this.manualPosition = result;
    }

    setFixedTime(time: number): void {
        this.fixedTime = time;
    }

    unsetFixedTime(): void {
        this.fixedTime = null;
    }

    getMode(): string {
        return this.mode || 'unknown';
    }

    setMode(mode: string, reason: string): void {
        this.mode = mode;
        this.modeReason = reason;
    }

    getSpecial(): string {
        return this.special;
    }

    setSpecial(special: string, reason: string): void {
        this.special = special;
        this.specialReason = reason;
    }

    getModeReason(): string {
        return this.modeReason;
    }

    getSpecialReason(): string {
        return this.specialReason;
    }

    getPosition(): number | null {
        return this.position;
    }

    update(timestamp: number): number | null {
        if (this.fixedTime !== null) {
            timestamp = this.fixedTime;
        }

        const dayStartFrom = selectTime(new Date(timestamp), this.configuration.dayStartTimeFromWorkday, this.configuration.dayStartTimeFromWeekend);
        const dayStartTo = selectTime(new Date(timestamp), this.configuration.dayStartTimeToWorkday, this.configuration.dayStartTimeToWeekend);
        const dayEndFrom = selectTime(new Date(timestamp), this.configuration.dayEndTimeFromWorkday, this.configuration.dayEndTimeFromWeekend);
        const dayEndTo = selectTime(new Date(timestamp), this.configuration.dayEndTimeToWorkday, this.configuration.dayEndTimeToWeekend);

        let mode = this.mode;
        let reason = '';

        let isFixedRange = false;
        if (dayStartFrom !== null && timestamp < dayStartFrom) {
            mode = 'night';
            reason = 'time < ' + formatTime(dayStartFrom);
            isFixedRange = true;
        } else if (dayEndTo !== null && timestamp >= dayEndTo) {
            mode = 'night';
            reason = 'time > ' + formatTime(dayEndTo);
            isFixedRange = true;
        } else if (dayStartTo !== null && timestamp >= dayStartTo && dayEndFrom !== null && timestamp < dayEndFrom) {
            mode = 'day';
            reason = formatTime(dayStartTo) + ' < time < ' + formatTime(dayEndFrom);
            isFixedRange = true;
        }

        if (!isFixedRange && this.outsideIlluminance !== null) {
            if (this.outsideIlluminance >= this.configuration.dayStartIlluminance && (dayStartFrom === null || timestamp >= dayStartFrom)) {
                mode = 'day';
                reason = 'illuminance > ' + this.configuration.dayStartIlluminance;
            } else if (this.outsideIlluminance <= this.configuration.dayEndIlluminance && (dayEndFrom === null || timestamp >= dayEndFrom)) {
                mode = 'night';
                reason = 'illuminance < ' + this.configuration.dayEndIlluminance;
            } else if (this.outsideIlluminance <= this.configuration.dayStartIlluminance && (dayStartTo === null || timestamp < dayStartTo)) {
                mode = 'night';
                reason = 'illuminance < ' + this.configuration.dayStartIlluminance;
            } else if (this.outsideIlluminance >= this.configuration.dayEndIlluminance && (dayEndTo === null || timestamp < dayEndTo)) {
                mode = 'day';
                reason = 'illuminance > ' + this.configuration.dayEndIlluminance;
            } else if (this.mode === '') {
                if (this.outsideIlluminance >= this.configuration.dayStartIlluminance) {
                    mode = 'day';
                    reason = 'illuminance > ' + this.configuration.dayStartIlluminance;
                } else {
                    mode = 'night';
                    reason = 'illuminance < ' + this.configuration.dayStartIlluminance;
                }
            }
        }

        const modeChanged = mode !== this.mode;
        this.setMode(mode, reason);

        let position = null;
        if (this.mode === 'day') {
            position = this.handleDay();
        } else if (this.mode === 'night') {
            position = this.handleNight(modeChanged);
        }

        if (position === null || position === this.position) {
            return null;
        }

        this.position = position;

        let result = remap(position, 0, 100, this.configuration.controllerValueClosed, this.configuration.controllerValueOpen);

        if (this.configuration.controllerValueStep >= 1) {
            result = Math.round(result * this.configuration.controllerValueStep) / this.configuration.controllerValueStep;
        } else {
            result = Math.round(result / this.configuration.controllerValueStep) * this.configuration.controllerValueStep;
        }

        return result;
    }

    private handleDay(): number {
        this.specialReason = '';
        let position = this.configuration.positionDayOpen;

        const startIlluminance = this.configuration.shadingStartIlluminance || this.configuration.shadingEndIlluminance;
        const endIlluminance = this.configuration.shadingEndIlluminance || this.configuration.shadingStartIlluminance;
        const startAzimuth = this.configuration.shadingStartAzimuth || this.configuration.shadingEndAzimuth;
        const endAzimuth = this.configuration.shadingEndAzimuth || this.configuration.shadingStartAzimuth;
        const startAltitude = this.configuration.shadingStartAltitude || this.configuration.shadingEndAltitude;
        const endAltitude = this.configuration.shadingEndAltitude || this.configuration.shadingStartAltitude;

        if (startIlluminance === null && endIlluminance === null && startAzimuth === null && endAzimuth === null && startAltitude === null && endAltitude === null) {
            this.setSpecial('', '');
            return position;
        }

        if (this.outsideIlluminance === null && this.sunAzimuth === null && this.sunAltitude === null) {
            this.setSpecial('', '');
            return position;
        }

        let reason = '';
        let notReason = '';

        let isAltitudeInRange = true;
        if (startAltitude !== null && endAltitude !== null && this.sunAltitude !== null) {
            isAltitudeInRange = false;

            if (this.special !== 'shade') {
                if (this.sunAltitude > startAltitude) {
                    isAltitudeInRange = true;
                    reason = 'altitude > ' + startAltitude;
                } else {
                    notReason = 'altitude ≤ ' + startAltitude;
                }
            } else if (this.special === 'shade') {
                if (this.sunAltitude >= endAltitude) {
                    isAltitudeInRange = true;
                    reason = 'altitude ≥ ' + endAltitude;
                } else {
                    notReason = 'altitude < ' + endAltitude;
                }
            }
        }

        let isAzimuthInRange = true;
        if (startAzimuth !== null && endAzimuth !== null && this.sunAzimuth !== null) {
            isAzimuthInRange = false;

            if (this.sunAzimuth <= startAzimuth) {
                notReason = 'azimuth ≤ ' + startAzimuth;
            } else if (this.sunAzimuth > endAzimuth) {
                notReason = 'azimuth > ' + endAzimuth;
            } else if (this.sunAzimuth > startAzimuth && this.sunAzimuth <= endAzimuth) {
                isAzimuthInRange = true;
                reason = startAzimuth + ' < azimuth ≤ ' + endAzimuth;
            }
        }

        let isIlluminanceInRange = true;
        if (startIlluminance !== null && endIlluminance !== null && this.outsideIlluminance !== null) {
            isIlluminanceInRange = false;

            if (this.special !== 'shade') {
                if (this.outsideIlluminance >= startIlluminance) {
                    isIlluminanceInRange = true;
                    reason = 'illuminance > ' + startIlluminance;
                } else {
                    notReason = 'illuminance ≤ ' + startIlluminance;
                }
            } else if (this.special === 'shade') {
                if (this.outsideIlluminance >= endIlluminance) {
                    isIlluminanceInRange = true;
                    reason = 'illuminance ≥ ' + endIlluminance;
                } else {
                    notReason = 'illuminance < ' + endIlluminance;
                }
            }
        }

        if (isIlluminanceInRange && isAzimuthInRange && isAltitudeInRange) {
            this.setSpecial('shade', reason);

            if (this.outsideTemperature !== null) {
                if (this.configuration.dayTemperatureDesired !== null && this.outsideTemperature < this.configuration.dayTemperatureDesired) {
                    this.setSpecial('', 'outside temp < ' + this.configuration.dayTemperatureDesired);
                    return position;
                } else if (this.configuration.dayTemperatureMax !== null && this.outsideTemperature < this.configuration.dayTemperatureMax) {
                    this.setSpecial('', 'outside temp < ' + this.configuration.dayTemperatureMax);
                    return position;
                }
            }

            if (this.insideTemperature !== null) {
                if (this.configuration.dayTemperatureDesired !== null && this.insideTemperature < this.configuration.dayTemperatureDesired) {
                    this.setSpecial('', 'inside temp < ' + this.configuration.dayTemperatureDesired);
                    return position;
                } else if (this.configuration.dayTemperatureMax !== null && this.insideTemperature < this.configuration.dayTemperatureMax) {
                    this.setSpecial('', 'inside temp < ' + this.configuration.dayTemperatureMax);
                    return position;
                }
            }

            position = this.configuration.positionShadingClosed;
        } else {
            this.setSpecial('', notReason);
            position = this.configuration.positionDayOpen;
        }

        return position;
    }

    private handleNight(modeChanged: boolean): number | null {
        if (!modeChanged && !this.configuration.allowNightChange) {
            this.special = 'silence';

            return this.position;
        }

        this.specialReason = '';
        let position = this.configuration.positionNightClosed;

        let special = '';
        let reason = '';
        let notReason = '';

        let isWindowOpenOrTilted = false;
        if (this.window !== null) {
            if (this.window === 'open') {
                isWindowOpenOrTilted = true;
                position = this.configuration.positionNightOpen;
                reason = 'window open';
                special = 'window';
            } else if (this.window === 'tilted') {
                isWindowOpenOrTilted = true;
                position = this.configuration.positionNightTilted;
                reason = 'window tilted';
                special = 'window';
            } else {
                notReason = 'window closed';
            }
        }

        let isTemperature = false;
        if (this.insideTemperature !== null && isWindowOpenOrTilted) {
            if (this.configuration.nightTemperatureMax !== null && this.insideTemperature > this.configuration.nightTemperatureMax) {
                isTemperature = true;
                position = this.configuration.positionNightOpen;
                special = 'cool';
                reason = 'temperature > ' + this.configuration.nightTemperatureMax;
            } else if (this.configuration.nightTemperatureDesired !== null && this.insideTemperature > this.configuration.nightTemperatureDesired) {
                isTemperature = true;
                position = this.configuration.positionNightOpen;
                special = 'cool';
                reason = 'temperature > ' + this.configuration.nightTemperatureDesired;
            }
        }

        if (isWindowOpenOrTilted || isTemperature) {
            this.setSpecial(special, reason);

            return position;
        } else {
            this.setSpecial('', notReason);

            return this.configuration.positionNightClosed;
        }
    }
}

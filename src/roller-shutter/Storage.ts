import { Configuration } from './Configuration';

interface ModeConfiguration {
    positionOpen: number | null;
    positionClosed: number | null;
    temperatureMin: number | null;
    temperatureDesired: number | null;
    temperatureMax: number | null;
}

/**
 * Parses the given time string and return a modified Date object for the given timestamp.
 */
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

/**
 * Returns either the time for workdays or the time for weekends depending on the day of the week.
 */
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

/**
 * Outputs a formated time string.
 */
function formatTime(timestamp: number) {
    const date = new Date(timestamp);

    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

/**
 * Maps a value from one number range to another number range.
 */
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
    private windowChanged = false;
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
            this.windowChanged = this.window !== value;
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

        let result = remap(value, this.configuration.outputPositionClosed, this.configuration.outputPositionOpen, 0, 100);
        result = Math.round(result);

        this.manualPosition = result;

        if (this.manualPosition === this.position) {
            this.manualPosition = null;
        }
    }

    setFixedTime(time: number): void {
        this.fixedTime = time;
    }

    unsetFixedTime(): void {
        this.fixedTime = null;
    }

    getMode(): string {
        if (this.manualPosition !== null) {
            return 'manual';
        }

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
        if (this.manualPosition !== null) {
            return this.manualPosition;
        }

        return this.position;
    }

    update(timestamp: number): number | null {
        if (this.fixedTime !== null) {
            timestamp = this.fixedTime;
        }

        const dayStartTime = selectTime(new Date(timestamp), this.configuration.dayStartTimeWorkday, this.configuration.dayStartTimeWeekend);
        const dayStopTime = selectTime(new Date(timestamp), this.configuration.dayStopTimeWorkday, this.configuration.dayStopTimeWeekend);
        const nightStartTime = selectTime(new Date(timestamp), this.configuration.nightStartTimeWorkday, this.configuration.nightStartTimeWeekend);
        const nightStopTime = selectTime(new Date(timestamp), this.configuration.nightStopTimeWorkday, this.configuration.nightStopTimeWeekend);

        let mode = this.mode;
        let reason = '';

        let isFixedRange = false;
        const isMorning = new Date(timestamp).getHours() < 12;

        if (isMorning) {
            if (nightStopTime !== null && timestamp < nightStopTime) {
                mode = 'night';
                reason = 'time < ' + formatTime(nightStopTime);
                isFixedRange = true;
            } else if (dayStartTime !== null && timestamp >= dayStartTime) {
                mode = 'day';
                reason = 'time ≥ ' + formatTime(dayStartTime);
                isFixedRange = true;
            } else if (nightStopTime !== null && timestamp >= nightStopTime) {
                mode = 'morning';
                reason = 'time ≥ ' + formatTime(nightStopTime);
            }
        } else {
            if (nightStartTime !== null && timestamp >= nightStartTime) {
                mode = 'night';
                reason = 'time ≥ ' + formatTime(nightStartTime);
                isFixedRange = true;
            } else if (dayStopTime !== null && timestamp < dayStopTime) {
                mode = 'day';
                reason = 'time < ' + formatTime(dayStopTime);
                isFixedRange = true;
            } else if (nightStartTime !== null && timestamp < nightStartTime) {
                mode = 'evening';
                reason = 'time < ' + formatTime(nightStartTime);
            }
        }

        if (!isFixedRange && this.outsideIlluminance !== null) {
            if (isMorning) {
                if (this.outsideIlluminance < this.configuration.morningStartIlluminance) {
                    mode = 'night';
                    reason = 'illuminance < ' + this.configuration.morningStartIlluminance;
                } else if (this.outsideIlluminance < this.configuration.dayStartIlluminance) {
                    mode = 'morning';
                    reason = 'illuminance < ' + this.configuration.dayStartIlluminance;
                } else {
                    mode = 'day';
                    reason = 'illuminance ≥ ' + this.configuration.dayStartIlluminance;
                }
            } else {
                if (this.outsideIlluminance <= this.configuration.nightStartIlluminance) {
                    mode = 'night';
                    reason = 'illuminance ≤ ' + this.configuration.nightStartIlluminance;
                } else if (this.outsideIlluminance <= this.configuration.eveningStartIlluminance) {
                    mode = 'evening';
                    reason = 'illuminance ≤ ' + this.configuration.eveningStartIlluminance;
                } else {
                    mode = 'day';
                    reason = 'illuminance ≥ ' + this.configuration.dayStartIlluminance;
                }
            }
        }

        const modeChanged = mode !== this.mode;
        this.setMode(mode, reason);

        let position = null;
        if (this.mode === 'day') {
            position = this.handleDay();
        } else if (this.mode === 'night' || this.mode === 'morning' || this.mode === 'evening') {
            position = this.handleNight(modeChanged);
        }

        if (modeChanged) {
            this.manualPosition = null;
        }

        if (position === this.manualPosition) {
            this.manualPosition = null;
        }

        if (this.manualPosition !== null) {
            this.setMode(mode, '');
            this.setSpecial('', '');

            position = this.manualPosition;
        }

        if (position === null || position === this.position) {
            return null;
        }

        this.position = position;

        let result = remap(position, 0, 100, this.configuration.outputPositionClosed, this.configuration.outputPositionOpen);

        if (this.configuration.outputPositionStep >= 1) {
            result = Math.round(result * this.configuration.outputPositionStep) / this.configuration.outputPositionStep;
        } else {
            result = Math.round(result / this.configuration.outputPositionStep) * this.configuration.outputPositionStep;
        }

        return result;
    }

    private handleDay(): number {
        this.specialReason = '';
        let position = this.configuration.dayPositionOpen;

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

            position = this.configuration.shadingPositionClosed;
        } else {
            this.setSpecial('', notReason);
            position = this.configuration.dayPositionOpen;
        }

        return position;
    }

    private handleNight(modeChanged: boolean): number | null {
        const configuration = this.getConfiguration(this.mode);

        this.specialReason = '';
        let position = configuration.positionClosed;

        let special = '';
        let reason = '';
        let notReason = '';

        let isWindowOpenOrTilted = false;
        if (this.window !== null) {
            if (this.window === 'open') {
                isWindowOpenOrTilted = true;
                position = configuration.positionOpen;
                reason = 'window open';
                special = 'window';
            } else if (this.window === 'tilted') {
                isWindowOpenOrTilted = true;
                position = this.configuration.nightPositionTilted;
                reason = 'window tilted';
                special = 'window';
            } else {
                notReason = this.windowChanged ? 'window closed' : '';
            }
        }

        let isSilence = false;
        if (!this.windowChanged && !modeChanged && !this.configuration.allowNightChange && this.mode === 'night') {
            // if disallowed don't change the position at night except if the mode changes from evening to night
            special = this.special;
            reason = 'silence';
            position = this.position ?? configuration.positionClosed;
            isSilence = true;
        }

        let isTemperature = false;
        if (this.insideTemperature !== null && !isSilence) {
            if (configuration.temperatureMax !== null && this.insideTemperature > configuration.temperatureMax) {
                isTemperature = true;
                position = configuration.positionOpen;
                special = 'cool';
                reason = 'temperature > ' + configuration.temperatureMax;
            } else if (configuration.temperatureDesired !== null && this.insideTemperature > configuration.temperatureDesired) {
                isTemperature = true;
                position = configuration.positionOpen;
                special = 'cool';
                reason = 'temperature > ' + configuration.temperatureDesired;
            }
        }

        this.windowChanged = false;

        if (isWindowOpenOrTilted || isSilence || isTemperature) {
            this.setSpecial(special, reason);

            return position;
        } else {
            this.setSpecial('', notReason);

            return configuration.positionClosed;
        }
    }

    /**
     * Returns the configuration for the given mode.
     */
    private getConfiguration(mode: string): ModeConfiguration {
        if (mode === 'morning') {
            return {
                positionOpen: this.configuration.morningPositionOpen,
                positionClosed: this.configuration.morningPositionClosed,
                temperatureMin: this.configuration.morningTemperatureMin,
                temperatureDesired: this.configuration.morningTemperatureDesired,
                temperatureMax: this.configuration.morningTemperatureMax,
            };
        } else if (mode === 'evening') {
            return {
                positionOpen: this.configuration.eveningPositionOpen,
                positionClosed: this.configuration.eveningPositionClosed,
                temperatureMin: this.configuration.eveningTemperatureMin,
                temperatureDesired: this.configuration.eveningTemperatureDesired,
                temperatureMax: this.configuration.eveningTemperatureMax,
            };
        } else if (mode === 'night') {
            return {
                positionOpen: this.configuration.nightPositionOpen,
                positionClosed: this.configuration.nightPositionClosed,
                temperatureMin: this.configuration.nightTemperatureMin,
                temperatureDesired: this.configuration.nightTemperatureDesired,
                temperatureMax: this.configuration.nightTemperatureMax,
            };
        }

        return {
            positionOpen: this.configuration.dayPositionOpen,
            positionClosed: this.configuration.dayPositionClosed,
            temperatureMin: this.configuration.dayTemperatureMin,
            temperatureDesired: this.configuration.dayTemperatureDesired,
            temperatureMax: this.configuration.dayTemperatureMax,
        };
    }
}

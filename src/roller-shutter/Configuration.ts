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
function selectTime(timestamp: Date, workdayTime: string | null, weekendTime: string | null, isWeekend: boolean): number | null {
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

interface ModeConfiguration {
    positionOpen: number | null;
    positionClosed: number | null;
    temperatureMin: number | null;
    temperatureDesired: number | null;
    temperatureMax: number | null;
}

/**
 * Sanitized configuration generated from user input.
 */
export class Configuration {
    inputOutsideIlluminanceProperty: string;
    inputOutsideIlluminanceSource: string;
    outputValueProperty: string;
    outputValueTarget: string;
    outputTopic: string | null = null;
    inputOutsideIlluminanceTopic = 'outsideIlluminance';
    inputOutsideTemperatureSource = 'msg';
    inputOutsideTemperatureProperty = 'payload';
    inputOutsideTemperatureTopic = 'outsideTemperature';
    inputInsideTemperatureSource = 'msg';
    inputInsideTemperatureProperty = 'payload';
    inputInsideTemperatureTopic = 'insideTemperature';
    inputWindowSource = 'msg';
    inputWindowProperty = 'payload';
    inputWindowTopic = 'window';
    inputSunAzimuthSource = 'msg';
    inputSunAzimuthProperty = 'payload';
    inputSunAzimuthTopic = 'sunAzimuth';
    inputSunAltitudeSource = 'msg';
    inputSunAltitudeProperty = 'payload';
    inputSunAltitudeTopic = 'sunAltitude';
    inputPositionSource = 'msg';
    inputPositionProperty = 'payload';
    inputPositionTopic = 'position';
    inputWeekendSource = 'msg';
    inputWeekendProperty = 'payload';
    inputWeekendTopic = 'weekend';

    outputPositionOpen = 100;
    outputPositionClosed = 0;
    outputPositionStep = 1;

    outputDelayMinimum: number | null = null;
    outputDelayMaximum: number | null = null;
    outputDriveTime = 60;
    output2Frequency = 'never';

    morningPositionOpen = 100;
    morningPositionClosed = 0;
    dayPositionOpen = 100;
    dayPositionClosed = 0;
    eveningPositionOpen = 100;
    eveningPositionClosed = 0;
    nightPositionOpen = 100;
    nightPositionClosed = 0;
    nightPositionTilted = 50;
    shadingPositionOpen = 100;
    shadingPositionClosed = 25;

    morningTemperatureMin: number | null = null;
    morningTemperatureDesired: number | null = null;
    morningTemperatureMax: number | null = null;
    dayTemperatureMin: number | null = null;
    dayTemperatureDesired: number | null = null;
    dayTemperatureMax: number | null = null;
    eveningTemperatureMin: number | null = null;
    eveningTemperatureDesired: number | null = null;
    eveningTemperatureMax: number | null = null;
    nightTemperatureMin: number | null = null;
    nightTemperatureDesired: number | null = null;
    nightTemperatureMax: number | null = null;

    morningStartIlluminance = 25;
    dayStartIlluminance = 50;
    eveningStartIlluminance = 50;
    nightStartIlluminance = 25;
    shadingStartIlluminance: number | null = null;
    shadingStartAzimuth: number | null = null;
    shadingStartAltitude: number | null = null;
    shadingEndIlluminance: number | null = null;
    shadingEndAzimuth: number | null = null;
    shadingEndAltitude: number | null = null;
    allowNightChange = true;

    private readonly _dayStartTimeWorkday: string | null = null;
    private readonly _dayStartTimeWeekend: string | null = null;
    private readonly _dayStopTimeWorkday: string | null = null;
    private readonly _dayStopTimeWeekend: string | null = null;
    private readonly _nightStartTimeWorkday: string | null = null;
    private readonly _nightStartTimeWeekend: string | null = null;
    private readonly _nightStopTimeWorkday: string | null = null;
    private readonly _nightStopTimeWeekend: string | null = null;

    private fixedTime: number | null = null;
    private weekend: boolean | null = null;
    private runtime: Map<string, string | number | null>;

    constructor(
        inputOutsideIlluminanceSource = 'msg',
        inputOutsideIlluminanceProperty = 'payload',
        inputOutsideIlluminanceTopic = '',
        inputOutsideTemperatureSource = 'msg',
        inputOutsideTemperatureProperty = 'payload',
        inputOutsideTemperatureTopic = '',
        inputInsideTemperatureSource = 'msg',
        inputInsideTemperatureProperty = 'payload',
        inputInsideTemperatureTopic = '',
        inputWindowSource = 'msg',
        inputWindowProperty = 'payload',
        inputWindowTopic = '',
        inputSunAzimuthSource = 'msg',
        inputSunAzimuthProperty = 'payload',
        inputSunAzimuthTopic = '',
        inputSunAltitudeSource = 'msg',
        inputSunAltitudeProperty = 'payload',
        inputSunAltitudeTopic = '',
        inputPositionSource = 'msg',
        inputPositionProperty = 'payload',
        inputPositionTopic = '',
        inputWeekendSource = 'msg',
        inputWeekendProperty = 'payload',
        inputWeekendTopic = '',
        outputValueProperty = 'payload',
        outputValueTarget = 'msg',
        outputTopic: string | null = null,
        outputPositionOpen = 100,
        outputPositionClosed = 0,
        outputPositionStep = 1,
        outputDelayMinimum: number | null = null,
        outputDelayMaximum: number | null = null,
        outputDriveTime = 60,
        output2Frequency = 'never',
        morningPositionOpen = 100,
        morningPositionClosed = 0,
        dayPositionOpen = 100,
        dayPositionClosed = 0,
        eveningPositionOpen = 100,
        eveningPositionClosed = 0,
        nightPositionOpen = 100,
        nightPositionClosed = 0,
        nightPositionTilted = 50,
        shadingPositionOpen = 100,
        shadingPositionClosed = 25,
        morningTemperatureMin: number | null = null,
        morningTemperatureDesired: number | null = null,
        morningTemperatureMax: number | null = null,
        dayTemperatureMin: number | null = null,
        dayTemperatureDesired: number | null = null,
        dayTemperatureMax: number | null = null,
        eveningTemperatureMin: number | null = null,
        eveningTemperatureDesired: number | null = null,
        eveningTemperatureMax: number | null = null,
        nightTemperatureMin: number | null = null,
        nightTemperatureDesired: number | null = null,
        nightTemperatureMax: number | null = null,
        morningStartIlluminance = 25,
        dayStartIlluminance = 50,
        nightStopTimeWorkday: string | null = null,
        nightStopTimeWeekend: string | null = null,
        dayStartTimeWorkday: string | null = null,
        dayStartTimeWeekend: string | null = null,
        eveningStartIlluminance = 50,
        nightStartIlluminance = 25,
        dayStopTimeWorkday: string | null = null,
        dayStopTimeWeekend: string | null = null,
        nightStartTimeWorkday: string | null = null,
        nightStartTimeWeekend: string | null = null,
        shadingStartIlluminance: number | null = null,
        shadingStartAzimuth: number | null = null,
        shadingStartAltitude: number | null = null,
        shadingEndIlluminance: number | null = null,
        shadingEndAzimuth: number | null = null,
        shadingEndAltitude: number | null = null,
        allowNightChange = true,
    ) {
        this.inputOutsideIlluminanceTopic = inputOutsideIlluminanceTopic;
        this.inputOutsideIlluminanceProperty = inputOutsideIlluminanceProperty;
        this.inputOutsideIlluminanceSource = inputOutsideIlluminanceSource;
        this.inputOutsideTemperatureSource = inputOutsideTemperatureSource;
        this.inputOutsideTemperatureProperty = inputOutsideTemperatureProperty;
        this.inputOutsideTemperatureTopic = inputOutsideTemperatureTopic;
        this.inputInsideTemperatureSource = inputInsideTemperatureSource;
        this.inputInsideTemperatureProperty = inputInsideTemperatureProperty;
        this.inputInsideTemperatureTopic = inputInsideTemperatureTopic;
        this.inputWindowSource = inputWindowSource;
        this.inputWindowProperty = inputWindowProperty;
        this.inputWindowTopic = inputWindowTopic;
        this.inputSunAzimuthSource = inputSunAzimuthSource;
        this.inputSunAzimuthProperty = inputSunAzimuthProperty;
        this.inputSunAzimuthTopic = inputSunAzimuthTopic;
        this.inputSunAltitudeSource = inputSunAltitudeSource;
        this.inputSunAltitudeProperty = inputSunAltitudeProperty;
        this.inputSunAltitudeTopic = inputSunAltitudeTopic;
        this.inputPositionSource = inputPositionSource;
        this.inputPositionProperty = inputPositionProperty;
        this.inputPositionTopic = inputPositionTopic;
        this.inputWeekendSource = inputWeekendSource;
        this.inputWeekendProperty = inputWeekendProperty;
        this.inputWeekendTopic = inputWeekendTopic;
        this.outputValueProperty = outputValueProperty;
        this.outputValueTarget = outputValueTarget;
        this.outputTopic = outputTopic;
        this.outputPositionOpen = outputPositionOpen;
        this.outputPositionClosed = outputPositionClosed;
        this.outputPositionStep = outputPositionStep;
        this.outputDelayMinimum = outputDelayMinimum;
        this.outputDelayMaximum = outputDelayMaximum;
        this.outputDriveTime = outputDriveTime;
        this.output2Frequency = output2Frequency;
        this.morningPositionOpen = morningPositionOpen;
        this.morningPositionClosed = morningPositionClosed;
        this.dayPositionOpen = dayPositionOpen;
        this.dayPositionClosed = dayPositionClosed;
        this.eveningPositionOpen = eveningPositionOpen;
        this.eveningPositionClosed = eveningPositionClosed;
        this.nightPositionOpen = nightPositionOpen;
        this.nightPositionClosed = nightPositionClosed;
        this.nightPositionTilted = nightPositionTilted;
        this.shadingPositionOpen = shadingPositionOpen;
        this.shadingPositionClosed = shadingPositionClosed;
        this.morningTemperatureMin = morningTemperatureMin;
        this.morningTemperatureDesired = morningTemperatureDesired;
        this.morningTemperatureMax = morningTemperatureMax;
        this.dayTemperatureMin = dayTemperatureMin;
        this.dayTemperatureDesired = dayTemperatureDesired;
        this.dayTemperatureMax = dayTemperatureMax;
        this.eveningTemperatureMin = eveningTemperatureMin;
        this.eveningTemperatureDesired = eveningTemperatureDesired;
        this.eveningTemperatureMax = eveningTemperatureMax;
        this.nightTemperatureMin = nightTemperatureMin;
        this.nightTemperatureDesired = nightTemperatureDesired;
        this.nightTemperatureMax = nightTemperatureMax;
        this.morningStartIlluminance = morningStartIlluminance;
        this.dayStartIlluminance = dayStartIlluminance;
        this._nightStopTimeWorkday = nightStopTimeWorkday;
        this._nightStopTimeWeekend = nightStopTimeWeekend;
        this._dayStartTimeWorkday = dayStartTimeWorkday;
        this._dayStartTimeWeekend = dayStartTimeWeekend;
        this.eveningStartIlluminance = eveningStartIlluminance;
        this.nightStartIlluminance = nightStartIlluminance;
        this._dayStopTimeWorkday = dayStopTimeWorkday;
        this._dayStopTimeWeekend = dayStopTimeWeekend;
        this._nightStartTimeWorkday = nightStartTimeWorkday;
        this._nightStartTimeWeekend = nightStartTimeWeekend;
        this.shadingStartIlluminance = shadingStartIlluminance;
        this.shadingStartAzimuth = shadingStartAzimuth;
        this.shadingStartAltitude = shadingStartAltitude;
        this.shadingEndIlluminance = shadingEndIlluminance;
        this.shadingEndAzimuth = shadingEndAzimuth;
        this.shadingEndAltitude = shadingEndAltitude;
        this.allowNightChange = allowNightChange;

        this.runtime = new Map();
    }

    get dayStartTimeWorkday(): string | null {
        return this.runtime.has('dayStartTimeWorkday') ? '' + this.runtime.get('dayStartTimeWorkday') : this._dayStartTimeWorkday;
    }

    get dayStartTimeWeekend(): string | null {
        return this.runtime.has('dayStartTimeWeekend') ? '' + this.runtime.get('dayStartTimeWeekend') : this._dayStartTimeWeekend;
    }

    get dayStopTimeWorkday(): string | null {
        return this.runtime.has('dayStopTimeWorkday') ? '' + this.runtime.get('dayStopTimeWorkday') : this._dayStopTimeWorkday;
    }

    get dayStopTimeWeekend(): string | null {
        return this.runtime.has('dayStopTimeWorkday') ? '' + this.runtime.get('dayStopTimeWeekend') : this._dayStopTimeWeekend;
    }

    get nightStartTimeWorkday(): string | null {
        return this.runtime.has('nightStartTimeWorkday') ? '' + this.runtime.get('nightStartTimeWorkday') : this._nightStartTimeWorkday;
    }

    get nightStartTimeWeekend(): string | null {
        return this.runtime.has('nightStartTimeWeekend') ? '' + this.runtime.get('nightStartTimeWeekend') : this._nightStartTimeWeekend;
    }

    get nightStopTimeWorkday(): string | null {
        return this.runtime.has('nightStopTimeWorkday') ? '' + this.runtime.get('nightStopTimeWorkday') : this._nightStopTimeWorkday;
    }

    get nightStopTimeWeekend(): string | null {
        return this.runtime.has('nightStopTimeWeekend') ? '' + this.runtime.get('nightStopTimeWeekend') : this._nightStopTimeWeekend;
    }

    //--------------------------------------
    setFixedTime(value: number | null): void {
        this.fixedTime = value;
    }

    setWeekend(value: boolean | null) {
        this.weekend = value;
    }

    isWeekend(dateTime: Date): boolean {
        if (this.fixedTime !== null) {
            dateTime = new Date(this.fixedTime);
        }

        let result;

        if (this.weekend !== null) {
            result = this.weekend;
        } else {
            const dayOfWeek = dateTime.getDay();
            result = dayOfWeek === 6 || dayOfWeek === 0;
        }

        return result;
    }

    getDayStartTime(dateTime: Date): number | null {
        if (this.fixedTime !== null) {
            dateTime = new Date(this.fixedTime);
        }

        return selectTime(dateTime, this.dayStartTimeWorkday, this.dayStartTimeWeekend, this.isWeekend(dateTime));
    }

    getDayStopTime(dateTime: Date): number | null {
        if (this.fixedTime !== null) {
            dateTime = new Date(this.fixedTime);
        }

        return selectTime(dateTime, this.dayStopTimeWorkday, this.dayStopTimeWeekend, this.isWeekend(dateTime));
    }

    getNightStartTime(dateTime: Date): number | null {
        if (this.fixedTime !== null) {
            dateTime = new Date(this.fixedTime);
        }

        return selectTime(dateTime, this.nightStartTimeWorkday, this.nightStartTimeWeekend, this.isWeekend(dateTime));
    }

    getNightStopTime(dateTime: Date): number | null {
        if (this.fixedTime !== null) {
            dateTime = new Date(this.fixedTime);
        }

        return selectTime(dateTime, this.nightStopTimeWorkday, this.nightStopTimeWeekend, this.isWeekend(dateTime));
    }

    /**
     * Returns the configuration for the given mode.
     */
    getModeConfiguration(mode: string): ModeConfiguration {
        if (mode === 'morning') {
            return {
                positionOpen: this.morningPositionOpen,
                positionClosed: this.morningPositionClosed,
                temperatureMin: this.morningTemperatureMin,
                temperatureDesired: this.morningTemperatureDesired,
                temperatureMax: this.morningTemperatureMax,
            };
        } else if (mode === 'evening') {
            return {
                positionOpen: this.eveningPositionOpen,
                positionClosed: this.eveningPositionClosed,
                temperatureMin: this.eveningTemperatureMin,
                temperatureDesired: this.eveningTemperatureDesired,
                temperatureMax: this.eveningTemperatureMax,
            };
        } else if (mode === 'night') {
            return {
                positionOpen: this.nightPositionOpen,
                positionClosed: this.nightPositionClosed,
                temperatureMin: this.nightTemperatureMin,
                temperatureDesired: this.nightTemperatureDesired,
                temperatureMax: this.nightTemperatureMax,
            };
        }

        return {
            positionOpen: this.dayPositionOpen,
            positionClosed: this.dayPositionClosed,
            temperatureMin: this.dayTemperatureMin,
            temperatureDesired: this.dayTemperatureDesired,
            temperatureMax: this.dayTemperatureMax,
        };
    }

    setProperty(key: string, value: string | number | null) {
        if (value === null) {
            this.runtime.delete(key);
        } else {
            this.runtime.set(key, value);
        }
    }
}

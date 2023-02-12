/**
 * Sanitized configuration generated from user input.
 */
export class Configuration {
    inputOutsideIlluminanceProperty: string;
    inputOutsideIlluminanceSource: string;
    outputValueProperty: string;
    outputValueTarget: string;
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

    outputPositionOpen = 100;
    outputPositionClosed = 0;
    outputPositionStep = 1;

    outputDelayMinimum: number | null = null;
    outputDelayMaximum: number | null = null;

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
    nightStopTimeWorkday: string | null = null;
    nightStopTimeWeekend: string | null = null;
    dayStartTimeWorkday: string | null = null;
    dayStartTimeWeekend: string | null = null;

    eveningStartIlluminance = 50;
    nightStartIlluminance = 25;
    dayStopTimeWorkday: string | null = null;
    dayStopTimeWeekend: string | null = null;
    nightStartTimeWorkday: string | null = null;
    nightStartTimeWeekend: string | null = null;

    shadingStartIlluminance: number | null = null;
    shadingStartAzimuth: number | null = null;
    shadingStartAltitude: number | null = null;

    shadingEndIlluminance: number | null = null;
    shadingEndAzimuth: number | null = null;
    shadingEndAltitude: number | null = null;

    allowNightChange = true;

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
        outputValueProperty = 'payload',
        outputValueTarget = 'msg',
        outputPositionOpen = 100,
        outputPositionClosed = 0,
        outputPositionStep = 1,
        outputDelayMinimum: number | null = null,
        outputDelayMaximum: number | null = null,
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
        this.inputOutsideIlluminanceProperty = inputOutsideIlluminanceProperty;
        this.inputOutsideIlluminanceSource = inputOutsideIlluminanceSource;
        this.outputValueProperty = outputValueProperty;
        this.outputValueTarget = outputValueTarget;
        this.outputPositionOpen = outputPositionOpen;
        this.outputPositionClosed = outputPositionClosed;
        this.outputPositionStep = outputPositionStep;
        this.outputDelayMinimum = outputDelayMinimum;
        this.outputDelayMaximum = outputDelayMaximum;
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
        this.nightStopTimeWorkday = nightStopTimeWorkday;
        this.nightStopTimeWeekend = nightStopTimeWeekend;
        this.dayStartTimeWorkday = dayStartTimeWorkday;
        this.dayStartTimeWeekend = dayStartTimeWeekend;
        this.eveningStartIlluminance = eveningStartIlluminance;
        this.nightStartIlluminance = nightStartIlluminance;
        this.dayStopTimeWorkday = dayStopTimeWorkday;
        this.dayStopTimeWeekend = dayStopTimeWeekend;
        this.nightStartTimeWorkday = nightStartTimeWorkday;
        this.nightStartTimeWeekend = nightStartTimeWeekend;
        this.shadingStartIlluminance = shadingStartIlluminance;
        this.shadingStartAzimuth = shadingStartAzimuth;
        this.shadingStartAltitude = shadingStartAltitude;
        this.shadingEndIlluminance = shadingEndIlluminance;
        this.shadingEndAzimuth = shadingEndAzimuth;
        this.shadingEndAltitude = shadingEndAltitude;
        this.allowNightChange = allowNightChange;
    }
}

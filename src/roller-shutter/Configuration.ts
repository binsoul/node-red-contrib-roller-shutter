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

    controllerValueOpen = 100;
    controllerValueClosed = 0;
    controllerValueStep = 1;

    positionDayOpen = 100;
    positionDayClosed = 0;
    positionNightOpen = 100;
    positionNightClosed = 0;
    positionNightTilted = 50;
    positionShadingOpen = 100;
    positionShadingClosed = 25;

    dayTemperatureMin: number | null = null;
    dayTemperatureDesired: number | null = null;
    dayTemperatureMax: number | null = null;

    nightTemperatureMin: number | null = null;
    nightTemperatureDesired: number | null = null;
    nightTemperatureMax: number | null = null;

    dayStartIlluminance = 25;
    dayStartTimeFromWorkday: string | null = null;
    dayStartTimeFromWeekend: string | null = null;
    dayStartTimeToWorkday: string | null = null;
    dayStartTimeToWeekend: string | null = null;

    dayEndIlluminance = 50;
    dayEndTimeFromWorkday: string | null = null;
    dayEndTimeFromWeekend: string | null = null;
    dayEndTimeToWorkday: string | null = null;
    dayEndTimeToWeekend: string | null = null;

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
        controllerValueOpen = 100,
        controllerValueClosed = 0,
        controllerValueStep = 1,
        positionDayOpen = 100,
        positionDayClosed = 0,
        positionNightOpen = 100,
        positionNightClosed = 0,
        positionNightTilted = 50,
        positionShadingOpen = 100,
        positionShadingClosed = 25,
        dayTemperatureMin: number | null = null,
        dayTemperatureDesired: number | null = null,
        dayTemperatureMax: number | null = null,
        nightTemperatureMin: number | null = null,
        nightTemperatureDesired: number | null = null,
        nightTemperatureMax: number | null = null,
        dayStartIlluminance = 25,
        dayStartTimeFromWorkday: string | null = null,
        dayStartTimeFromWeekend: string | null = null,
        dayStartTimeToWorkday: string | null = null,
        dayStartTimeToWeekend: string | null = null,
        dayEndIlluminance = 50,
        dayEndTimeFromWorkday: string | null = null,
        dayEndTimeFromWeekend: string | null = null,
        dayEndTimeToWorkday: string | null = null,
        dayEndTimeToWeekend: string | null = null,
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
        this.controllerValueOpen = controllerValueOpen;
        this.controllerValueClosed = controllerValueClosed;
        this.controllerValueStep = controllerValueStep;
        this.positionDayOpen = positionDayOpen;
        this.positionNightOpen = positionNightOpen;
        this.positionNightClosed = positionNightClosed;
        this.positionNightTilted = positionNightTilted;
        this.positionDayClosed = positionDayClosed;
        this.positionShadingOpen = positionShadingOpen;
        this.positionShadingClosed = positionShadingClosed;
        this.dayTemperatureMin = dayTemperatureMin;
        this.dayTemperatureDesired = dayTemperatureDesired;
        this.dayTemperatureMax = dayTemperatureMax;
        this.nightTemperatureMin = nightTemperatureMin;
        this.nightTemperatureDesired = nightTemperatureDesired;
        this.nightTemperatureMax = nightTemperatureMax;
        this.dayStartIlluminance = dayStartIlluminance;
        this.dayStartTimeFromWorkday = dayStartTimeFromWorkday;
        this.dayStartTimeFromWeekend = dayStartTimeFromWeekend;
        this.dayStartTimeToWorkday = dayStartTimeToWorkday;
        this.dayStartTimeToWeekend = dayStartTimeToWeekend;
        this.dayEndIlluminance = dayEndIlluminance;
        this.dayEndTimeFromWorkday = dayEndTimeFromWorkday;
        this.dayEndTimeFromWeekend = dayEndTimeFromWeekend;
        this.dayEndTimeToWorkday = dayEndTimeToWorkday;
        this.dayEndTimeToWeekend = dayEndTimeToWeekend;
        this.shadingStartIlluminance = shadingStartIlluminance;
        this.shadingStartAzimuth = shadingStartAzimuth;
        this.shadingStartAltitude = shadingStartAltitude;
        this.shadingEndIlluminance = shadingEndIlluminance;
        this.shadingEndAzimuth = shadingEndAzimuth;
        this.shadingEndAltitude = shadingEndAltitude;
        this.allowNightChange = allowNightChange;
    }
}

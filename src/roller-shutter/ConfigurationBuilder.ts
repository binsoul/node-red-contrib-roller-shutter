import { Configuration } from './Configuration';
import type { UserConfiguration } from './UserConfiguration';

const getString = function <T>(value: unknown, defaultValue: T): T | string {
    const result = value || defaultValue;

    if (!result) {
        return defaultValue;
    }

    const stringValue = '' + result;
    if (stringValue.trim() === '') {
        return defaultValue;
    }

    return stringValue;
};

const getNumber = function <T>(value: unknown, defaultValue: T): T | number {
    const result = value || defaultValue;

    if (!result) {
        return defaultValue;
    }

    const stringValue = '' + result;
    if (stringValue.trim() === '') {
        return defaultValue;
    }

    return Number(result);
};

/**
 * Creates a sanitized configuration from user input.
 */
export function buildConfiguration(config: UserConfiguration): Configuration {
    const inputOutsideIlluminanceProperty = getString(config.inputOutsideIlluminanceProperty, 'payload');
    const inputOutsideIlluminanceSource = getString(config.inputOutsideIlluminanceSource, 'msg');
    const inputOutsideIlluminanceTopic = getString(config.inputOutsideIlluminanceTopic, 'outsideIlluminance');
    const inputOutsideTemperatureProperty = getString(config.inputOutsideTemperatureProperty, 'payload');
    const inputOutsideTemperatureSource = getString(config.inputOutsideTemperatureSource, 'msg');
    const inputOutsideTemperatureTopic = getString(config.inputOutsideTemperatureTopic, 'outsideTemperature');
    const inputInsideTemperatureProperty = getString(config.inputInsideTemperatureProperty, 'payload');
    const inputInsideTemperatureSource = getString(config.inputInsideTemperatureSource, 'msg');
    const inputInsideTemperatureTopic = getString(config.inputInsideTemperatureTopic, 'insideTemperature');
    const inputWindowProperty = getString(config.inputWindowProperty, 'payload');
    const inputWindowSource = getString(config.inputWindowSource, 'msg');
    const inputWindowTopic = getString(config.inputWindowTopic, 'window');
    const inputSunAzimuthProperty = getString(config.inputSunAzimuthProperty, 'payload');
    const inputSunAzimuthSource = getString(config.inputSunAzimuthSource, 'msg');
    const inputSunAzimuthTopic = getString(config.inputSunAzimuthTopic, 'sunAzimuth');
    const inputSunAltitudeProperty = getString(config.inputSunAltitudeProperty, 'payload');
    const inputSunAltitudeSource = getString(config.inputSunAltitudeSource, 'msg');
    const inputSunAltitudeTopic = getString(config.inputSunAltitudeTopic, 'sunAltitude');
    const inputPositionProperty = getString(config.inputPositionProperty, 'payload');
    const inputPositionSource = getString(config.inputPositionSource, 'msg');
    const inputPositionTopic = getString(config.inputPositionTopic, 'position');
    const outputValueProperty = getString(config.inputOutsideIlluminanceProperty, 'payload');
    const outputValueTarget = getString(config.inputOutsideIlluminanceSource, 'msg');

    const outputPositionOpen = getNumber(config.outputPositionOpen, 100);
    const outputPositionClosed = getNumber(config.outputPositionClosed, 0);
    const outputPositionStep = getNumber(config.outputPositionStep, 1);
    const outputDelayMinimum = getNumber(config.outputDelayMinimum, null);
    const outputDelayMaximum = getNumber(config.outputDelayMaximum, null);
    const morningPositionOpen = getNumber(config.morningPositionOpen, 100);
    const morningPositionClosed = getNumber(config.morningPositionClosed, 0);
    const dayPositionOpen = getNumber(config.dayPositionOpen, 100);
    const dayPositionClosed = getNumber(config.dayPositionClosed, 0);
    const eveningPositionOpen = getNumber(config.eveningPositionOpen, 100);
    const eveningPositionClosed = getNumber(config.eveningPositionClosed, 0);
    const nightPositionOpen = getNumber(config.nightPositionOpen, 100);
    const nightPositionClosed = getNumber(config.nightPositionClosed, 0);
    const nightPositionTilted = getNumber(config.nightPositionTilted, 50);
    const shadingPositionOpen = getNumber(config.shadingPositionOpen, 100);
    const shadingPositionClosed = getNumber(config.shadingPositionClosed, 25);
    const morningTemperatureMin = getNumber(config.morningTemperatureMin, null);
    const morningTemperatureDesired = getNumber(config.morningTemperatureDesired, null);
    const morningTemperatureMax = getNumber(config.morningTemperatureMax, null);
    const dayTemperatureMin = getNumber(config.dayTemperatureMin, null);
    const dayTemperatureDesired = getNumber(config.dayTemperatureDesired, null);
    const dayTemperatureMax = getNumber(config.dayTemperatureMax, null);
    const eveningTemperatureMin = getNumber(config.eveningTemperatureMin, null);
    const eveningTemperatureDesired = getNumber(config.eveningTemperatureDesired, null);
    const eveningTemperatureMax = getNumber(config.eveningTemperatureMax, null);
    const nightTemperatureMin = getNumber(config.nightTemperatureMin, null);
    const nightTemperatureDesired = getNumber(config.nightTemperatureDesired, null);
    const nightTemperatureMax = getNumber(config.nightTemperatureMax, null);
    const morningStartIlluminance = getNumber(config.morningStartIlluminance, 25);
    const dayStartIlluminance = getNumber(config.dayStartIlluminance, 50);
    const nightStopTimeWorkday = getString(config.nightStopTimeWorkday, null);
    const nightStopTimeWeekend = getString(config.nightStopTimeWeekend, null);
    const dayStartTimeWorkday = getString(config.dayStartTimeWorkday, null);
    const dayStartTimeWeekend = getString(config.dayStartTimeWeekend, null);
    const eveningStartIlluminance = getNumber(config.eveningStartIlluminance, 50);
    const nightStartIlluminance = getNumber(config.nightStartIlluminance, 25);
    const dayStopTimeWorkday = getString(config.dayStopTimeWorkday, null);
    const dayStopTimeWeekend = getString(config.dayStopTimeWeekend, null);
    const nightStartTimeWorkday = getString(config.nightStartTimeWorkday, null);
    const nightStartTimeWeekend = getString(config.nightStartTimeWeekend, null);
    const shadingStartIlluminance = getNumber(config.shadingStartIlluminance, null);
    const shadingStartAzimuth = getNumber(config.shadingStartAzimuth, null);
    const shadingStartAltitude = getNumber(config.shadingStartAltitude, null);
    const shadingEndIlluminance = getNumber(config.shadingEndIlluminance, null);
    const shadingEndAzimuth = getNumber(config.shadingEndAzimuth, null);
    const shadingEndAltitude = getNumber(config.shadingEndAltitude, null);
    const allowNightChange = !!config.allowNightChange;

    return new Configuration(
        inputOutsideIlluminanceSource,
        inputOutsideIlluminanceProperty,
        inputOutsideIlluminanceTopic.toLowerCase(),
        inputOutsideTemperatureSource,
        inputOutsideTemperatureProperty,
        inputOutsideTemperatureTopic.toLowerCase(),
        inputInsideTemperatureSource,
        inputInsideTemperatureProperty,
        inputInsideTemperatureTopic.toLowerCase(),
        inputWindowSource,
        inputWindowProperty,
        inputWindowTopic.toLowerCase(),
        inputSunAzimuthSource,
        inputSunAzimuthProperty,
        inputSunAzimuthTopic.toLowerCase(),
        inputSunAltitudeSource,
        inputSunAltitudeProperty,
        inputSunAltitudeTopic.toLowerCase(),
        inputPositionSource,
        inputPositionProperty,
        inputPositionTopic.toLowerCase(),
        outputValueProperty,
        outputValueTarget,
        outputPositionOpen,
        outputPositionClosed,
        outputPositionStep,
        outputDelayMinimum,
        outputDelayMaximum,
        morningPositionOpen,
        morningPositionClosed,
        dayPositionOpen,
        dayPositionClosed,
        eveningPositionOpen,
        eveningPositionClosed,
        nightPositionOpen,
        nightPositionClosed,
        nightPositionTilted,
        shadingPositionOpen,
        shadingPositionClosed,
        morningTemperatureMin,
        morningTemperatureDesired,
        morningTemperatureMax,
        dayTemperatureMin,
        dayTemperatureDesired,
        dayTemperatureMax,
        eveningTemperatureMin,
        eveningTemperatureDesired,
        eveningTemperatureMax,
        nightTemperatureMin,
        nightTemperatureDesired,
        nightTemperatureMax,
        morningStartIlluminance,
        dayStartIlluminance,
        nightStopTimeWorkday,
        nightStopTimeWeekend,
        dayStartTimeWorkday,
        dayStartTimeWeekend,
        eveningStartIlluminance,
        nightStartIlluminance,
        dayStopTimeWorkday,
        dayStopTimeWeekend,
        nightStartTimeWorkday,
        nightStartTimeWeekend,
        shadingStartIlluminance,
        shadingStartAzimuth,
        shadingStartAltitude,
        shadingEndIlluminance,
        shadingEndAzimuth,
        shadingEndAltitude,
        allowNightChange,
    );
}

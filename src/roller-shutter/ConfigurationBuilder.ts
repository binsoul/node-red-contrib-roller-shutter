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

    const controllerValueOpen = getNumber(config.controllerValueOpen, 100);
    const controllerValueClosed = getNumber(config.controllerValueClosed, 0);
    const controllerValueStep = getNumber(config.controllerValueStep, 1);
    const positionDayOpen = getNumber(config.positionDayOpen, 100);
    const positionNightOpen = getNumber(config.positionNightOpen, 100);
    const positionNightClosed = getNumber(config.positionNightClosed, 0);
    const positionNightTilted = getNumber(config.positionNightTilted, 50);
    const positionDayClosed = getNumber(config.positionDayClosed, 0);
    const positionShadingOpen = getNumber(config.positionShadingOpen, 100);
    const positionShadingClosed = getNumber(config.positionShadingClosed, 25);
    const dayTemperatureMin = getNumber(config.dayTemperatureMin, null);
    const dayTemperatureDesired = getNumber(config.dayTemperatureDesired, null);
    const dayTemperatureMax = getNumber(config.dayTemperatureMax, null);
    const nightTemperatureMin = getNumber(config.nightTemperatureMin, null);
    const nightTemperatureDesired = getNumber(config.nightTemperatureDesired, null);
    const nightTemperatureMax = getNumber(config.nightTemperatureMax, null);
    const dayStartIlluminance = getNumber(config.dayStartIlluminance, 25);
    const dayStartTimeFromWorkday = getString(config.dayStartTimeFromWorkday, null);
    const dayStartTimeFromWeekend = getString(config.dayStartTimeFromWeekend, null);
    const dayStartTimeToWorkday = getString(config.dayStartTimeToWorkday, null);
    const dayStartTimeToWeekend = getString(config.dayStartTimeToWeekend, null);
    const dayEndIlluminance = getNumber(config.dayEndIlluminance, 25);
    const dayEndTimeFromWorkday = getString(config.dayEndTimeFromWorkday, null);
    const dayEndTimeFromWeekend = getString(config.dayEndTimeFromWeekend, null);
    const dayEndTimeToWorkday = getString(config.dayEndTimeToWorkday, null);
    const dayEndTimeToWeekend = getString(config.dayEndTimeToWeekend, null);
    const shadingStartIlluminance = getNumber(config.shadingStartIlluminance, null);
    const shadingStartAzimuth = getNumber(config.shadingStartAzimuth, null);
    const shadingStartAltitude = getNumber(config.shadingStartAltitude, null);
    const shadingEndIlluminance = getNumber(config.shadingEndIlluminance, null);
    const shadingEndAzimuth = getNumber(config.shadingEndAzimuth, null);
    const shadingEndAltitude = getNumber(config.shadingEndAltitude, null);

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
        controllerValueOpen,
        controllerValueClosed,
        controllerValueStep,
        positionDayOpen,
        positionDayClosed,
        positionNightOpen,
        positionNightClosed,
        positionNightTilted,
        positionShadingOpen,
        positionShadingClosed,
        dayTemperatureMin,
        dayTemperatureDesired,
        dayTemperatureMax,
        nightTemperatureMin,
        nightTemperatureDesired,
        nightTemperatureMax,
        dayStartIlluminance,
        dayStartTimeFromWorkday,
        dayStartTimeFromWeekend,
        dayStartTimeToWorkday,
        dayStartTimeToWeekend,
        dayEndIlluminance,
        dayEndTimeFromWorkday,
        dayEndTimeFromWeekend,
        dayEndTimeToWorkday,
        dayEndTimeToWeekend,
        shadingStartIlluminance,
        shadingStartAzimuth,
        shadingStartAltitude,
        shadingEndIlluminance,
        shadingEndAzimuth,
        shadingEndAltitude,
    );
}

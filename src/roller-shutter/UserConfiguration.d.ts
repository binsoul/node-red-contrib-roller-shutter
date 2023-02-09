import type { NodeDef } from 'node-red';

/**
 * Configuration options available to users.
 */
export interface UserConfigurationOptions {
    inputOutsideIlluminanceSource: string;
    inputOutsideIlluminanceProperty: string;
    inputOutsideIlluminanceTopic: string;
    inputOutsideTemperatureSource?: string | null;
    inputOutsideTemperatureProperty?: string | null;
    inputOutsideTemperatureTopic?: string | null;
    inputInsideTemperatureSource?: string | null;
    inputInsideTemperatureProperty?: string | null;
    inputInsideTemperatureTopic?: string | null;
    inputWindowSource?: string | null;
    inputWindowProperty?: string | null;
    inputWindowTopic?: string | null;
    inputSunAzimuthSource?: string | null;
    inputSunAzimuthProperty?: string | null;
    inputSunAzimuthTopic?: string | null;
    inputSunAltitudeSource?: string | null;
    inputSunAltitudeProperty?: string | null;
    inputSunAltitudeTopic?: string | null;
    inputPositionSource?: string | null;
    inputPositionProperty?: string | null;
    inputPositionTopic?: string | null;

    outputValueProperty: string;
    outputValueTarget: string;

    controllerValueOpen: number;
    controllerValueClosed: number;
    controllerValueStep: number;

    positionDayOpen: number;
    positionNightOpen: number;
    positionNightClosed: number;
    positionNightTilted: number;
    positionDayClosed: number;
    positionShadingOpen: number;
    positionShadingClosed: number;

    dayTemperatureMin?: number | null;
    dayTemperatureDesired?: number | null;
    dayTemperatureMax?: number | null;

    nightTemperatureMin?: number | null;
    nightTemperatureDesired?: number | null;
    nightTemperatureMax?: number | null;

    dayStartIlluminance: number;
    dayStartTimeFromWorkday?: string | null;
    dayStartTimeFromWeekend?: string | null;
    dayStartTimeToWorkday?: string | null;
    dayStartTimeToWeekend?: string | null;

    dayEndIlluminance: number;
    dayEndTimeFromWorkday?: string | null;
    dayEndTimeFromWeekend?: string | null;
    dayEndTimeToWorkday?: string | null;
    dayEndTimeToWeekend?: string | null;

    shadingStartIlluminance?: number | null;
    shadingStartAzimuth?: number | null;
    shadingStartAltitude?: number | null;

    shadingEndIlluminance?: number | null;
    shadingEndAzimuth?: number | null;
    shadingEndAltitude?: number | null;

    allowNightChange: boolean;
}

/**
 * Configuration generated by the user in the editor.
 */
export interface UserConfiguration extends NodeDef, UserConfigurationOptions {}

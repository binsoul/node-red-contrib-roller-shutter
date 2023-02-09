import type { EditorNodeProperties, EditorRED } from 'node-red';
import type { UserConfigurationOptions } from '../UserConfiguration';

declare const RED: EditorRED;

interface NodeEditorProperties extends EditorNodeProperties, UserConfigurationOptions {}

RED.nodes.registerType<NodeEditorProperties>('binsoul-roller-shutter', {
    category: 'function',
    color: '#A6BBCF',
    defaults: {
        inputOutsideIlluminanceSource: {
            value: 'msg',
            required: true,
        },
        inputOutsideIlluminanceProperty: {
            value: 'payload',
            required: true,
        },
        inputOutsideIlluminanceTopic: {
            value: 'outsideIlluminance',
            required: true,
        },
        inputOutsideTemperatureSource: {
            value: 'msg',
            required: false,
        },
        inputOutsideTemperatureProperty: {
            value: 'payload',
            required: false,
        },
        inputOutsideTemperatureTopic: {
            value: 'outsideTemperature',
            required: false,
        },
        inputInsideTemperatureSource: {
            value: 'msg',
            required: false,
        },
        inputInsideTemperatureProperty: {
            value: 'payload',
            required: false,
        },
        inputInsideTemperatureTopic: {
            value: 'insideTemperature',
            required: true,
        },
        inputWindowSource: {
            value: 'msg',
            required: false,
        },
        inputWindowProperty: {
            value: 'payload',
            required: false,
        },
        inputWindowTopic: {
            value: 'window',
            required: false,
        },
        inputSunAzimuthProperty: {
            value: 'payload',
            required: false,
        },
        inputSunAzimuthTopic: {
            value: 'sunAzimuth',
            required: false,
        },
        inputSunAltitudeProperty: {
            value: 'payload',
            required: false,
        },
        inputSunAltitudeTopic: {
            value: 'sunAltitude',
            required: false,
        },
        inputPositionProperty: {
            value: 'payload',
            required: false,
        },
        inputPositionTopic: {
            value: 'position',
            required: false,
        },
        outputValueProperty: {
            value: 'payload',
            required: true,
        },
        outputValueTarget: {
            value: 'msg',
            required: true,
        },
        controllerValueStep: {
            value: 1,
            required: true,
            validate: RED.validators.number(false),
        },
        controllerValueOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(false),
        },
        controllerValueClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(false),
        },
        dayTemperatureMin: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        dayTemperatureDesired: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        dayTemperatureMax: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        nightTemperatureMin: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        nightTemperatureDesired: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        nightTemperatureMax: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        dayStartIlluminance: {
            value: 25,
            required: true,
            validate: RED.validators.number(true),
        },
        dayStartTimeFromWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayStartTimeFromWeekend: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayStartTimeToWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayStartTimeToWeekend: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayEndIlluminance: {
            value: 50,
            required: true,
            validate: RED.validators.number(true),
        },
        dayEndTimeFromWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayEndTimeFromWeekend: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayEndTimeToWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayEndTimeToWeekend: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        shadingStartIlluminance: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        shadingStartAzimuth: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        shadingStartAltitude: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        shadingEndIlluminance: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        shadingEndAzimuth: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        shadingEndAltitude: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        positionDayOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        positionDayClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(true),
        },
        positionNightOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        positionNightClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(true),
        },
        positionNightTilted: {
            value: 50,
            required: true,
            validate: RED.validators.number(true),
        },
        positionShadingOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        positionShadingClosed: {
            value: 25,
            required: true,
            validate: RED.validators.number(true),
        },
        allowNightChange: {
            value: true,
            required: false,
        },
        name: { value: '' },
    },
    inputs: 1,
    outputs: 1,
    icon: 'font-awesome/fa-window-maximize',
    label: function () {
        return this.name || 'Roller shutter';
    },
    labelStyle: function () {
        return this.name ? 'node_label_italic' : '';
    },
    paletteLabel: 'Roller shutter',
    inputLabels: 'Incoming message',
    outputLabels: ['Outgoing message'],
    oneditprepare: function () {
        setTimeout(() => {
            $('.binsoul-roller-shutter-wrapper').css('width', '100%');
            $('.binsoul-roller-shutter-wrapper .red-ui-typedInput-container').css({
                width: 'auto',
                display: 'flex',
            });
        });

        $('.binsoul-roller-shutter-wrapper').accordion({
            heightStyle: 'content',
        });

        $('#node-input-inputOutsideIlluminanceProperty').typedInput({
            typeField: '#node-input-inputOutsideIlluminanceSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });

        $('#node-input-inputOutsideTemperatureProperty').typedInput({
            typeField: '#node-input-inputOutsideTemperatureSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });

        $('#node-input-inputInsideTemperatureProperty').typedInput({
            typeField: '#node-input-inputInsideTemperatureSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });

        $('#node-input-inputWindowProperty').typedInput({
            typeField: '#node-input-inputWindowSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });

        $('#node-input-inputSunAzimuthProperty').typedInput({
            typeField: '#node-input-inputSunAzimuthSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });

        $('#node-input-inputSunAltitudeProperty').typedInput({
            typeField: '#node-input-inputSunAltitudeSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });

        $('#node-input-inputPositionProperty').typedInput({
            typeField: '#node-input-inputPositionSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });

        $('#node-input-outputValueProperty').typedInput({
            typeField: '#node-input-outputValueSource',
            types: ['msg', 'flow', 'global'],
            default: 'msg',
        });
    },
});

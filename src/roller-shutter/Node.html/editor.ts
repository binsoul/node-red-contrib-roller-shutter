import type { EditorNodeProperties, EditorRED } from 'node-red';
import type { UserConfigurationOptions } from '../UserConfiguration';

declare const RED: EditorRED;

interface NodeEditorProperties extends EditorNodeProperties, UserConfigurationOptions {
    outputs: number;
}

RED.nodes.registerType<NodeEditorProperties>('binsoul-roller-shutter', {
    category: 'function',
    color: '#97BF41',
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
        inputWeekendProperty: {
            value: 'payload',
            required: false,
        },
        inputWeekendTopic: {
            value: 'weekend',
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
        outputTopic: {
            value: null,
            required: false,
        },
        outputPositionOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(false),
        },
        outputPositionClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(false),
        },
        outputPositionStep: {
            value: 1,
            required: true,
            validate: RED.validators.number(false),
        },
        outputDelayMinimum: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        outputDelayMaximum: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        outputDriveTime: {
            value: 60,
            required: true,
            validate: RED.validators.number(true),
        },
        output2Frequency: {
            value: 'never',
            required: true,
        },
        morningTemperatureMin: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        morningTemperatureDesired: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        morningTemperatureMax: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
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
        eveningTemperatureMin: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        eveningTemperatureDesired: {
            value: null,
            required: false,
            validate: RED.validators.number(true),
        },
        eveningTemperatureMax: {
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
        morningStartIlluminance: {
            value: 25,
            required: true,
            validate: RED.validators.number(true),
        },
        dayStartIlluminance: {
            value: 50,
            required: true,
            validate: RED.validators.number(true),
        },
        eveningStartIlluminance: {
            value: 50,
            required: true,
            validate: RED.validators.number(true),
        },
        nightStartIlluminance: {
            value: 25,
            required: true,
            validate: RED.validators.number(true),
        },
        nightStopTimeWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        nightStopTimeWeekend: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayStartTimeWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayStartTimeWeekend: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayStopTimeWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        dayStopTimeWeekend: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        nightStartTimeWorkday: {
            value: null,
            required: false,
            validate: RED.validators.regex(new RegExp('([0-9](2):[0-9](2))?')),
        },
        nightStartTimeWeekend: {
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
        morningPositionOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        morningPositionClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(true),
        },
        dayPositionOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        dayPositionClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(true),
        },
        eveningPositionOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        eveningPositionClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(true),
        },
        nightPositionOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        nightPositionClosed: {
            value: 0,
            required: true,
            validate: RED.validators.number(true),
        },
        nightPositionTilted: {
            value: 50,
            required: true,
            validate: RED.validators.number(true),
        },
        shadingPositionOpen: {
            value: 100,
            required: true,
            validate: RED.validators.number(true),
        },
        shadingPositionClosed: {
            value: 25,
            required: true,
            validate: RED.validators.number(true),
        },
        allowNightChange: {
            value: true,
            required: false,
        },
        name: { value: '' },
        outputs: { value: 1 },
    },
    inputs: 1,
    icon: 'font-awesome/fa-window-maximize',
    label: function () {
        return this.name || 'roller shutter';
    },
    labelStyle: function () {
        return this.name ? 'node_label_italic' : '';
    },
    paletteLabel: 'roller shutter',
    inputLabels: 'Incoming message',
    outputLabels: ['Position output', 'Object output'],
    oneditprepare: function () {
        setTimeout(() => {
            $('.binsoul-roller-shutter-wrapper').css('width', '100%');
            $('.binsoul-roller-shutter-wrapper .red-ui-typedInput-container').css({
                width: 'auto',
                display: 'flex',
            });
        });

        const output2FrequencyInput = $('#node-input-output2Frequency');
        this.outputs = output2FrequencyInput.val() !== 'never' ? 2 : 1;
        output2FrequencyInput.on('change', (e: JQuery.TriggeredEvent) => (this.outputs = e.currentTarget.value !== 'never' ? 2 : 1));

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

        $('#node-input-inputWeekendProperty').typedInput({
            typeField: '#node-input-inputWeekendSource',
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

import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import type { Configuration } from '../Configuration';
import { Storage } from '../Storage';

export class SensorAction implements Action {
    private readonly configuration: Configuration;
    private storage: Storage;

    constructor(configuration: Configuration, storage: Storage) {
        this.configuration = configuration;
        this.storage = storage;
    }

    defineInput(): InputDefinition {
        const result = new InputDefinition();

        result.set('payloadOutsideIlluminance', {
            source: this.configuration.inputOutsideIlluminanceSource,
            property: this.configuration.inputOutsideIlluminanceProperty,
            type: 'number',
            required: false,
        });

        result.set('payloadOutsideTemperature', {
            source: this.configuration.inputOutsideTemperatureSource,
            property: this.configuration.inputOutsideTemperatureProperty,
            type: 'number',
            required: false,
        });

        result.set('payloadInsideTemperature', {
            source: this.configuration.inputInsideTemperatureSource,
            property: this.configuration.inputInsideTemperatureProperty,
            type: 'number',
            required: false,
        });

        result.set('payloadWindow', {
            source: this.configuration.inputWindowSource,
            property: this.configuration.inputWindowProperty,
            type: 'string',
            required: false,
        });

        result.set('payloadSunAzimuth', {
            source: this.configuration.inputSunAzimuthSource,
            property: this.configuration.inputSunAzimuthProperty,
            type: 'number',
            required: false,
        });

        result.set('payloadSunAltitude', {
            source: this.configuration.inputSunAltitudeSource,
            property: this.configuration.inputSunAltitudeProperty,
            type: 'number',
            required: false,
        });

        result.set('payloadPosition', {
            source: this.configuration.inputPositionSource,
            property: this.configuration.inputPositionProperty,
            type: 'number',
            required: false,
        });

        result.set('payloadWeekend', {
            source: this.configuration.inputWeekendSource,
            property: this.configuration.inputWeekendProperty,
            type: 'boolean',
            required: false,
        });

        return result;
    }

    defineOutput(): OutputDefinition {
        return new OutputDefinition();
    }

    execute(input: Input): Output {
        const topic = input.getMessage().data.topic?.toLowerCase();

        if (topic === this.configuration.inputOutsideIlluminanceTopic) {
            this.storage.setOutsideIlluminance(input.getRequiredValue<number>('payloadOutsideIlluminance'));
        }

        if (topic === this.configuration.inputOutsideTemperatureTopic) {
            this.storage.setOutsideTemperature(input.getRequiredValue<number>('payloadOutsideTemperature'));
        }

        if (topic === this.configuration.inputInsideTemperatureTopic) {
            this.storage.setInsideTemperature(input.getRequiredValue<number>('payloadInsideTemperature'));
        }

        if (topic === this.configuration.inputWindowTopic) {
            this.storage.setWindow(input.getRequiredValue<string>('payloadWindow'));
        }

        if (topic === this.configuration.inputSunAzimuthTopic) {
            this.storage.setSunAzimuth(input.getRequiredValue<number>('payloadSunAzimuth'));
        }

        if (topic === this.configuration.inputSunAltitudeTopic) {
            this.storage.setSunAltitude(input.getRequiredValue<number>('payloadSunAltitude'));
        }

        if (topic === this.configuration.inputPositionTopic) {
            this.storage.setManualPosition(input.getRequiredValue<number>('payloadPosition'));
        }

        if (topic === this.configuration.inputWeekendTopic) {
            this.configuration.setWeekend(input.getRequiredValue<boolean>('payloadWeekend'));
        }

        return new Output();
    }
}

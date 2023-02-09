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

        return result;
    }

    defineOutput(): OutputDefinition {
        return new OutputDefinition();
    }

    execute(input: Input): Output {
        switch (input.getMessage().data.topic?.toLowerCase()) {
            case this.configuration.inputOutsideIlluminanceTopic:
                this.storage.setOutsideIlluminance(input.getRequiredValue<number>('payloadOutsideIlluminance'));

                break;
            case this.configuration.inputOutsideTemperatureTopic:
                this.storage.setOutsideTemperature(input.getRequiredValue<number>('payloadOutsideTemperature'));

                break;
            case this.configuration.inputInsideTemperatureTopic:
                this.storage.setInsideTemperature(input.getRequiredValue<number>('payloadInsideTemperature'));

                break;
            case this.configuration.inputWindowTopic:
                this.storage.setWindow(input.getRequiredValue<string>('payloadWindow'));

                break;
            case this.configuration.inputSunAzimuthTopic:
                this.storage.setSunAzimuth(input.getRequiredValue<number>('payloadSunAzimuth'));

                break;
            case this.configuration.inputSunAltitudeTopic:
                this.storage.setSunAltitude(input.getRequiredValue<number>('payloadSunAltitude'));

                break;
            case this.configuration.inputPositionTopic:
                this.storage.setManualPosition(input.getRequiredValue<number>('payloadPosition'));

                break;
        }

        return new Output();
    }
}

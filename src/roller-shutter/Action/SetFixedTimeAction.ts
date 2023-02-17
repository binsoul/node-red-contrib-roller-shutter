import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Configuration } from '../Configuration';
import { Storage } from '../Storage';

export class SetFixedTimeAction implements Action {
    private readonly configuration: Configuration;
    private readonly storage: Storage;

    constructor(configuration: Configuration, storage: Storage) {
        this.configuration = configuration;
        this.storage = storage;
    }

    defineOutput() {
        return new OutputDefinition();
    }

    defineInput(): InputDefinition {
        const result = new InputDefinition();

        result.set('timestamp', {
            source: 'msg',
            property: 'payload',
            type: 'number',
            required: true,
        });

        return result;
    }

    execute(input: Input): Output {
        const timestamp = input.getRequiredValue<number>('timestamp');
        this.configuration.setFixedTime(timestamp);
        this.storage.setFixedTime(timestamp);

        return new Output();
    }
}

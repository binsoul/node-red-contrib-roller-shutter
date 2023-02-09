import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Storage } from '../Storage';

export class SetFixedTimeAction implements Action {
    protected readonly storage: Storage;

    constructor(storage: Storage) {
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
        this.storage.setFixedTime(timestamp);

        return new Output();
    }
}

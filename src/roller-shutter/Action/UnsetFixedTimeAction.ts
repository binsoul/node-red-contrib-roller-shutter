import { Action, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Configuration } from '../Configuration';
import { Storage } from '../Storage';

export class UnsetFixedTimeAction implements Action {
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
        return new InputDefinition();
    }

    execute(): Output {
        this.configuration.setFixedTime(null);
        this.storage.setFixedTime(null);

        return new Output();
    }
}

import { Action, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Storage } from '../Storage';

export class UnsetFixedTimeAction implements Action {
    protected readonly storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    defineOutput() {
        return new OutputDefinition();
    }

    defineInput(): InputDefinition {
        return new InputDefinition();
    }

    execute(): Output {
        this.storage.unsetFixedTime();

        return new Output();
    }
}

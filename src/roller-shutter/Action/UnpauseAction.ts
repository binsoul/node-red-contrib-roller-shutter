import { Action, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Storage } from '../Storage';

export class UnpauseAction implements Action {
    private storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    defineInput(): InputDefinition {
        return new InputDefinition();
    }

    defineOutput(): OutputDefinition {
        return new OutputDefinition();
    }

    execute(): Output {
        this.storage.unpause();

        return new Output();
    }
}

import { Action, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Storage } from '../Storage';

/**
 * Clears the storage.
 */
export class ClearAction implements Action {
    private readonly storage: Storage;

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
        this.storage.clear();

        return new Output();
    }
}

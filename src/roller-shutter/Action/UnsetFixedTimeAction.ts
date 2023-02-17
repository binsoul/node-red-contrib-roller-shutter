import { Action, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Configuration } from '../Configuration';
import { Storage } from '../Storage';
import { TimerHandler } from '../TimerHandler';

export class UnsetFixedTimeAction implements Action {
    private readonly configuration: Configuration;
    private readonly storage: Storage;
    private readonly timerHandler: TimerHandler;

    constructor(configuration: Configuration, storage: Storage, timerHandler: TimerHandler) {
        this.configuration = configuration;
        this.storage = storage;
        this.timerHandler = timerHandler;
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
        this.timerHandler.scheduleStartAndStopTimes();

        return new Output();
    }
}

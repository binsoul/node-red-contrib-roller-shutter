import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Configuration } from '../Configuration';
import { Storage } from '../Storage';
import { TimerHandler } from '../TimerHandler';

export class SetFixedTimeAction implements Action {
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
        this.timerHandler.scheduleStartAndStopTimes();

        return new Output();
    }
}

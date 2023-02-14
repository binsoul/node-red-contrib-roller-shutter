import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import type { Configuration } from '../Configuration';
import { Storage } from '../Storage';
import { TimerHandler } from '../TimerHandler';

export class OutputAction implements Action {
    private readonly configuration: Configuration;
    private readonly storage: Storage;
    private readonly timerHandler: TimerHandler;

    constructor(configuration: Configuration, storage: Storage, timerHandler: TimerHandler) {
        this.configuration = configuration;
        this.storage = storage;
        this.timerHandler = timerHandler;
    }

    defineInput(): InputDefinition {
        const result = new InputDefinition();

        result.set('output', {
            source: 'msg',
            property: 'payload',
            type: 'number',
            required: true,
        });

        result.set('oldPosition', {
            source: 'msg',
            property: 'oldPosition',
            type: 'number',
            required: false,
        });

        result.set('newPosition', {
            source: 'msg',
            property: 'newPosition',
            type: 'number',
            required: false,
        });

        return result;
    }

    defineOutput(): OutputDefinition {
        const result = new OutputDefinition();

        result.set('output', {
            target: this.configuration.outputValueTarget,
            property: this.configuration.outputValueProperty,
            type: 'number',
            channel: 0,
        });

        return result;
    }

    execute(input: Input): Output {
        const result = new Output();

        const oldPositionStatus = input.getOptionalValue<number | null>('oldPosition') ?? '?';
        const newPositionStatus = input.getOptionalValue<number | null>('newPosition') ?? '?';

        result.setValue('output', input.getRequiredValue<number>('output'));
        result.setNodeStatus(`[drive⇒${newPositionStatus}] ${oldPositionStatus} ⇒ ${newPositionStatus}`);

        this.storage.pause();
        this.timerHandler.scheduleUnpause(this.configuration.outputDriveTime);

        return result;
    }
}

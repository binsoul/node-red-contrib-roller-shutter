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

        result.set('output1', {
            target: this.configuration.outputValueTarget,
            property: this.configuration.outputValueProperty,
            type: 'number',
            channel: 0,
        });

        if (this.configuration.output2Frequency !== 'never') {
            result.set('output2', {
                target: 'msg',
                property: 'payload',
                type: 'object',
                channel: 1,
            });
        }

        if (this.configuration.outputTopic !== null && ('' + this.configuration.outputTopic).trim() !== '') {
            result.set('topic', {
                target: 'msg',
                property: 'topic',
                type: 'string',
                channel: 0,
            });
        }

        return result;
    }

    execute(input: Input): Output {
        const result = new Output();

        const oldPositionStatus = input.getOptionalValue<number | null>('oldPosition') ?? '?';
        const newPositionStatus = input.getOptionalValue<number | null>('newPosition') ?? '?';

        result.setValue('output1', input.getRequiredValue<number>('output'));

        const state = this.storage.getState();

        if (this.configuration.output2Frequency === 'always') {
            result.setValue('output2', state);
        } else if (this.configuration.output2Frequency === 'changes' && oldPositionStatus !== newPositionStatus) {
            result.setValue('output2', state);
        }

        result.setNodeStatus(`[drive⇒${newPositionStatus}] ${oldPositionStatus} ⇒ ${newPositionStatus}`);

        if (this.configuration.outputTopic !== null && ('' + this.configuration.outputTopic).trim() !== '') {
            result.setValue('topic', this.configuration.outputTopic);
        }

        this.storage.pause();
        this.timerHandler.scheduleUnpause(this.configuration.outputDriveTime);

        return result;
    }
}

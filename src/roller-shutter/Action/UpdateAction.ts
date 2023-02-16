import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import type { Configuration } from '../Configuration';
import { Storage } from '../Storage';
import { TimerHandler } from '../TimerHandler';

export class UpdateAction implements Action {
    private readonly configuration: Configuration;
    private readonly storage: Storage;
    private readonly ignoreTimestamp: boolean;
    private timerHandler: TimerHandler;

    constructor(configuration: Configuration, storage: Storage, ignoreTimestamp: boolean, timerHandler: TimerHandler) {
        this.configuration = configuration;
        this.storage = storage;
        this.ignoreTimestamp = ignoreTimestamp;
        this.timerHandler = timerHandler;
    }

    defineInput(): InputDefinition {
        const result = new InputDefinition();

        result.set('timestamp', {
            source: 'msg',
            property: 'payload',
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
            result.set('topic1', {
                target: 'msg',
                property: 'topic',
                type: 'string',
                channel: 0,
            });

            result.set('topic2', {
                target: 'msg',
                property: 'topic',
                type: 'string',
                channel: 1,
            });
        }

        return result;
    }

    execute(input: Input): Output {
        const result = new Output();

        if (this.storage.isPaused()) {
            return result;
        }

        let timestamp = input.getOptionalValue<number>('timestamp');
        if (typeof timestamp === 'undefined' || this.ignoreTimestamp) {
            timestamp = input.getMessage().timestamp;
        }

        const oldMode = this.storage.getMode();
        const oldPosition = this.storage.getPosition();
        const oldPositionStatus = this.storage.getPosition() !== null ? this.storage.getPosition() : '?';

        const output = this.storage.update(timestamp);

        const newPosition = this.storage.getPosition();
        const newPositionStatus = newPosition !== null ? newPosition : '?';

        const state = this.storage.getState();
        if (this.configuration.output2Frequency === 'always') {
            result.setValue('output2', state);

            if (this.configuration.outputTopic !== null && ('' + this.configuration.outputTopic).trim() !== '') {
                result.setValue('topic2', this.configuration.outputTopic);
            }
        }

        if (output !== null) {
            if (this.storage.getMode() !== oldMode && this.configuration.outputDelayMinimum !== null && this.configuration.outputDelayMaximum !== null) {
                result.setNodeStatus(`[delay⇒${newPositionStatus}] ${oldMode} ⇒ ${this.storage.getMode()}`);

                const delay = Math.round(this.configuration.outputDelayMinimum + Math.random() * (this.configuration.outputDelayMaximum - this.configuration.outputDelayMinimum));
                this.storage.pause();
                this.timerHandler.scheduleOutput(delay, output, oldPosition, newPosition);

                return result;
            } else {
                result.setValue('output1', output);
                if (this.configuration.outputTopic !== null && ('' + this.configuration.outputTopic).trim() !== '') {
                    result.setValue('topic1', this.configuration.outputTopic);
                }

                if (this.configuration.output2Frequency === 'changes') {
                    result.setValue('output2', state);

                    if (this.configuration.outputTopic !== null && ('' + this.configuration.outputTopic).trim() !== '') {
                        result.setValue('topic2', this.configuration.outputTopic);
                    }
                }

                result.setNodeStatus(`[drive⇒${newPositionStatus}] ${oldPositionStatus} ⇒ ${newPositionStatus}`);

                this.storage.pause();
                this.timerHandler.scheduleUnpause(this.configuration.outputDriveTime);

                return result;
            }
        }

        let mode = this.storage.getMode();
        const special = this.storage.getSpecial();
        if (special !== '') {
            mode += '+' + special;
        }

        let reason = '';
        const modeReason = this.storage.getModeReason();
        if (modeReason !== '') {
            reason += modeReason;
        }

        const specialReason = this.storage.getSpecialReason();
        if (specialReason !== '') {
            if (reason === '') {
                reason = specialReason;
            } else {
                reason += ' & ' + specialReason;
            }
        }

        if (reason !== '') {
            result.setNodeStatus(`[${mode}⇒${newPositionStatus}] ${reason}`);
        } else {
            result.setNodeStatus(`[${mode}⇒${newPositionStatus}]`);
        }

        return result;
    }
}

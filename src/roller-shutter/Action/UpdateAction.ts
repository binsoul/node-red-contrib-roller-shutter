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

        if (this.storage.isPaused()) {
            return result;
        }

        let timestamp = input.getOptionalValue<number>('timestamp');
        if (typeof timestamp === 'undefined' || this.ignoreTimestamp) {
            timestamp = input.getMessage().timestamp;
        }

        const previousMode = this.storage.getMode();
        const previousPosition = this.storage.getPosition();
        const previousPositionStatus = this.storage.getPosition() !== null ? this.storage.getPosition() : '?';

        const output = this.storage.update(timestamp);

        const position = this.storage.getPosition();
        const positionStatus = position !== null ? position : '?';

        if (output !== null) {
            if (this.storage.getMode() !== previousMode && this.configuration.outputDelayMinimum !== null && this.configuration.outputDelayMaximum !== null) {
                result.setNodeStatus(`[delay⇒${positionStatus}] ${previousMode} ⇒ ${this.storage.getMode()}`);

                const delay = Math.round(this.configuration.outputDelayMinimum + Math.random() * (this.configuration.outputDelayMaximum - this.configuration.outputDelayMinimum));
                this.storage.pause();
                this.timerHandler.scheduleOutput(delay, output, previousPosition, position);

                return result;
            } else {
                result.setValue('output', output);
                result.setNodeStatus(`[drive⇒${positionStatus}] ${previousPositionStatus} ⇒ ${positionStatus}`);

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
            result.setNodeStatus(`[${mode}⇒${positionStatus}] ${reason}`);
        } else {
            result.setNodeStatus(`[${mode}⇒${positionStatus}]`);
        }

        return result;
    }
}

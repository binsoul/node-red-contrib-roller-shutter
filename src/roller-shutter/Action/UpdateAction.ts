import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import type { Configuration } from '../Configuration';
import { Storage } from '../Storage';

export class UpdateAction implements Action {
    private readonly configuration: Configuration;
    private readonly storage: Storage;
    private readonly ignoreTimestamp: boolean;

    constructor(configuration: Configuration, storage: Storage, ignoreTimestamp: boolean) {
        this.configuration = configuration;
        this.storage = storage;
        this.ignoreTimestamp = ignoreTimestamp;
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

        let timestamp = input.getOptionalValue<number>('timestamp');
        if (typeof timestamp === 'undefined' || this.ignoreTimestamp) {
            timestamp = input.getMessage().timestamp;
        }

        const position = this.storage.update(timestamp);
        if (position !== null) {
            result.setValue('output', position);
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
            result.setNodeStatus(`[${mode}⇒${this.storage.getPosition()}] ${reason}`);
        } else {
            result.setNodeStatus(`[${mode}⇒${this.storage.getPosition()}]`);
        }

        return result;
    }
}

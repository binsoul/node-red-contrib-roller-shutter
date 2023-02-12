import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import type { Configuration } from '../Configuration';

export class OutputAction implements Action {
    private readonly configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    defineInput(): InputDefinition {
        const result = new InputDefinition();

        result.set('output', {
            source: 'msg',
            property: 'payload',
            type: 'number',
            required: true,
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

        result.setValue('output', input.getRequiredValue<number>('output'));

        return result;
    }
}

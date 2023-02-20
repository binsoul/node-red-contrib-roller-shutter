import { Action, Input, InputDefinition, Output, OutputDefinition } from '@binsoul/node-red-bundle-processing';
import { Configuration } from '../Configuration';

/**
 * Changes the configuration.
 */
export class ConfigureAction implements Action {
    private configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    defineInput(): InputDefinition {
        const result = new InputDefinition();

        result.set('key', {
            source: 'msg',
            property: 'key',
            type: 'string',
            required: true,
        });

        result.set('value', {
            source: 'msg',
            property: 'payload',
            type: 'any',
            required: false,
        });

        return result;
    }

    defineOutput(): OutputDefinition {
        return new OutputDefinition();
    }

    execute(input: Input): Output {
        const key = input.getRequiredValue<string>('key');
        let value = input.getOptionalValue<string | number | null>('value');
        if (typeof value === 'undefined') {
            value = null;
        }

        this.configuration.setProperty(key, value);

        return new Output();
    }
}

import { Action, ActionFactory as ActionFactoryInterface } from '@binsoul/node-red-bundle-processing';
import { Message } from '@binsoul/node-red-bundle-processing/dist/Message';
import type { Node, NodeAPI } from '@node-red/registry';
import { NodeMessageInFlow } from 'node-red';
import { SensorAction } from './Action/SensorAction';
import { SetFixedTimeAction } from './Action/SetFixedTimeAction';
import { UnsetFixedTimeAction } from './Action/UnsetFixedTimeAction';
import { UpdateAction } from './Action/UpdateAction';
import type { Configuration } from './Configuration';
import { Storage } from './Storage';

interface MessageData extends NodeMessageInFlow {
    command?: string;
    timestamp?: number;
}

/**
 * Generates actions.
 */
export class ActionFactory implements ActionFactoryInterface {
    private readonly configuration: Configuration;
    private readonly RED: NodeAPI;
    private readonly node: Node;
    private readonly storage: Storage;

    constructor(RED: NodeAPI, node: Node, configuration: Configuration) {
        this.RED = RED;
        this.node = node;
        this.configuration = configuration;
        this.storage = new Storage(configuration);
    }

    build(message: Message): Action | Array<Action> | null {
        const data: MessageData = message.data;
        const command = data.command;

        if (typeof command !== 'undefined' && ('' + command).trim() !== '') {
            switch (command.toLowerCase()) {
                case 'setfixedtime':
                    return [new SetFixedTimeAction(this.storage), new UpdateAction(this.configuration, this.storage, true)];
                case 'unsetfixedtime':
                    return [new UnsetFixedTimeAction(this.storage), new UpdateAction(this.configuration, this.storage, true)];
                case 'update':
                    return new UpdateAction(this.configuration, this.storage, false);
            }

            return null;
        }

        if (typeof data.topic !== 'string' || data.topic.trim() === '') {
            return null;
        }

        switch (data.topic.toLowerCase()) {
            case this.configuration.inputOutsideIlluminanceTopic.toLowerCase():
            case this.configuration.inputOutsideTemperatureTopic.toLowerCase():
            case this.configuration.inputInsideTemperatureTopic.toLowerCase():
            case this.configuration.inputWindowTopic.toLowerCase():
            case this.configuration.inputSunAzimuthTopic.toLowerCase():
            case this.configuration.inputSunAltitudeTopic.toLowerCase():
            case this.configuration.inputPositionTopic.toLowerCase():
                return [new SensorAction(this.configuration, this.storage), new UpdateAction(this.configuration, this.storage, true)];
        }

        return null;
    }
}

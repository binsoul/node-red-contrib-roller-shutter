import { Action, ActionFactory as ActionFactoryInterface } from '@binsoul/node-red-bundle-processing';
import { Message } from '@binsoul/node-red-bundle-processing/dist/Message';
import type { Node, NodeAPI } from '@node-red/registry';
import { NodeMessageInFlow } from 'node-red';
import { ClearAction } from './Action/ClearAction';
import { OutputAction } from './Action/OutputAction';
import { SensorAction } from './Action/SensorAction';
import { SetFixedTimeAction } from './Action/SetFixedTimeAction';
import { UnpauseAction } from './Action/UnpauseAction';
import { UnsetFixedTimeAction } from './Action/UnsetFixedTimeAction';
import { UnsetManualPositionAction } from './Action/UnsetManualPositionAction';
import { UpdateAction } from './Action/UpdateAction';
import type { Configuration } from './Configuration';
import { Storage } from './Storage';
import { TimerHandler } from './TimerHandler';

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
    private readonly timerHandler: TimerHandler;

    constructor(RED: NodeAPI, node: Node, configuration: Configuration) {
        this.RED = RED;
        this.node = node;
        this.configuration = configuration;
        this.storage = new Storage(configuration);
        this.timerHandler = new TimerHandler(node);
    }

    build(message: Message): Action | Array<Action> | null {
        const data: MessageData = message.data;
        const command = data.command;

        if (typeof command !== 'undefined' && ('' + command).trim() !== '') {
            switch (command.toLowerCase()) {
                case 'setfixedtime':
                    return [new SetFixedTimeAction(this.storage), new UpdateAction(this.configuration, this.storage, true, this.timerHandler)];
                case 'unsetfixedtime':
                    return [new UnsetFixedTimeAction(this.storage), new UpdateAction(this.configuration, this.storage, true, this.timerHandler)];
                case 'unsetmanualposition':
                    return [new UnsetManualPositionAction(this.storage), new UpdateAction(this.configuration, this.storage, true, this.timerHandler)];
                case 'update':
                    return new UpdateAction(this.configuration, this.storage, false, this.timerHandler);
                case 'output':
                    return new OutputAction(this.configuration, this.storage, this.timerHandler);
                case 'unpause':
                    return [new UnpauseAction(this.storage), new UpdateAction(this.configuration, this.storage, true, this.timerHandler)];
                case 'clear':
                    return [new ClearAction(this.storage), new UpdateAction(this.configuration, this.storage, true, this.timerHandler)];
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
                return [new SensorAction(this.configuration, this.storage), new UpdateAction(this.configuration, this.storage, true, this.timerHandler)];
        }

        return null;
    }
}

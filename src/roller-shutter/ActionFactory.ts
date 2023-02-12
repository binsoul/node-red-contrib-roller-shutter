import { Action, ActionFactory as ActionFactoryInterface } from '@binsoul/node-red-bundle-processing';
import { Message } from '@binsoul/node-red-bundle-processing/dist/Message';
import type { Node, NodeAPI } from '@node-red/registry';
import { NodeMessageInFlow } from 'node-red';
import { clearTimeout, setTimeout } from 'timers';
import { OutputAction } from './Action/OutputAction';
import { SensorAction } from './Action/SensorAction';
import { SetFixedTimeAction } from './Action/SetFixedTimeAction';
import { UnsetFixedTimeAction } from './Action/UnsetFixedTimeAction';
import { UnsetManualPositionAction } from './Action/UnsetManualPositionAction';
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
    private updateTimer: Array<NodeJS.Timeout> = [];

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
                    this.clearTimer();
                    return [new SetFixedTimeAction(this.storage), new UpdateAction(this.configuration, this.storage, true, null)];
                case 'unsetfixedtime':
                    this.clearTimer();
                    return [new UnsetFixedTimeAction(this.storage), new UpdateAction(this.configuration, this.storage, true, null)];
                case 'unsetmanualposition':
                    this.clearTimer();
                    return [new UnsetManualPositionAction(this.storage), new UpdateAction(this.configuration, this.storage, true, null)];
                case 'update':
                    this.clearTimer();
                    return new UpdateAction(this.configuration, this.storage, false, null);
                case 'output':
                    return new OutputAction(this.configuration);
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
                return [new SensorAction(this.configuration, this.storage), new UpdateAction(this.configuration, this.storage, true, (delay, output) => this.scheduleUpdate(delay, output))];
        }

        return null;
    }

    private clearTimer(): void {
        while (this.updateTimer.length) {
            const timer = this.updateTimer.shift();
            clearTimeout(timer);
        }
    }

    private scheduleUpdate(delay: number, output: number): void {
        const timer = setTimeout(() => {
            for (let n = 0; n < this.updateTimer.length; n++) {
                if (this.updateTimer[n] === timer) {
                    this.updateTimer.splice(n, 1);
                    break;
                }
            }

            this.node.receive(<MessageData>{
                topic: 'delayed output',
                command: 'output',
                payload: output,
            });
        }, delay * 1000);

        this.updateTimer.push(timer);
    }
}

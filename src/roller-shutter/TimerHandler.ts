import { Node } from '@node-red/registry';
import { NodeMessageInFlow } from 'node-red';
import { clearTimeout, setTimeout } from 'timers';
import { Configuration } from './Configuration';

interface MessageData extends NodeMessageInFlow {
    command?: string;
    timestamp?: number;
    oldPosition?: number | null;
    newPosition?: number | null;
}

export class TimerHandler {
    private configuration: Configuration;
    private node: Node;
    private timers: Array<NodeJS.Timeout> = [];

    constructor(configuration: Configuration, node: Node) {
        this.configuration = configuration;
        this.node = node;

        this.scheduleDailyUpdate();
        this.scheduleStartAndStopTimes();
    }

    public clearTimer(): void {
        while (this.timers.length) {
            const timer = this.timers.shift();
            clearTimeout(timer);
        }
    }

    public scheduleUnpause(delayInSeconds: number): void {
        const timer = setTimeout(() => {
            for (let n = 0; n < this.timers.length; n++) {
                if (this.timers[n] === timer) {
                    this.timers.splice(n, 1);
                    break;
                }
            }

            this.node.receive(<MessageData>{
                topic: 'unpause',
                command: 'unpause',
            });
        }, Math.round(delayInSeconds * 1000));

        this.timers.push(timer);
    }

    public scheduleOutput(delayInSeconds: number, output: number, oldPosition: number | null, newPosition: number | null): void {
        const timer = setTimeout(() => {
            for (let n = 0; n < this.timers.length; n++) {
                if (this.timers[n] === timer) {
                    this.timers.splice(n, 1);
                    break;
                }
            }

            this.node.receive(<MessageData>{
                topic: 'delayed output',
                command: 'output',
                payload: output,
                oldPosition: oldPosition,
                newPosition: newPosition,
            });
        }, Math.round(delayInSeconds * 1000));

        this.timers.push(timer);
    }

    public scheduleUpdate(delayInSeconds: number): void {
        const timer = setTimeout(() => {
            for (let n = 0; n < this.timers.length; n++) {
                if (this.timers[n] === timer) {
                    this.timers.splice(n, 1);
                    break;
                }
            }

            this.node.receive(<MessageData>{
                topic: 'delayed update',
                command: 'update',
            });
        }, Math.round(delayInSeconds * 1000));

        this.timers.push(timer);
    }

    public scheduleStartAndStopTimes(): void {
        const now = new Date();

        const times = [this.configuration.getDayStartTime(now), this.configuration.getNightStartTime(now), this.configuration.getDayStopTime(now), this.configuration.getNightStopTime(now)];

        for (const time of times) {
            if (time !== null) {
                const dateTime = new Date(time);
                dateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
                const delay = time - dateTime.getTime();

                if (delay >= 0) {
                    this.scheduleUpdate(delay / 1000 + 1);
                }
            }
        }
    }

    private scheduleDailyUpdate(): void {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 4, 20, 0);
        const delay = tomorrow.getTime() - now.getTime();

        const timer = setTimeout(() => {
            for (let n = 0; n < this.timers.length; n++) {
                if (this.timers[n] === timer) {
                    this.timers.splice(n, 1);
                    break;
                }
            }

            this.scheduleStartAndStopTimes();
            this.scheduleDailyUpdate();
        }, delay);

        this.timers.push(timer);
    }
}

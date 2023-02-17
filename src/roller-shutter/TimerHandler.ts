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
    private dailyTimer: NodeJS.Timeout | null = null;
    private messageTimers: Array<NodeJS.Timeout> = [];
    private startAndStopTimers: Array<NodeJS.Timeout> = [];

    constructor(configuration: Configuration, node: Node) {
        this.configuration = configuration;
        this.node = node;

        this.scheduleDailyUpdate();
        this.scheduleStartAndStopTimes();
    }

    public clearTimers(): void {
        if (this.dailyTimer !== null) {
            clearTimeout(this.dailyTimer);
            this.dailyTimer = null;
        }

        while (this.messageTimers.length) {
            const timer = this.messageTimers.shift();
            clearTimeout(timer);
        }

        while (this.startAndStopTimers.length) {
            const timer = this.startAndStopTimers.shift();
            clearTimeout(timer);
        }
    }

    public scheduleUnpause(delayInSeconds: number): void {
        const timer = setTimeout(() => {
            this.removeTimer(timer);

            this.node.receive(<MessageData>{
                topic: 'unpause',
                command: 'unpause',
            });
        }, Math.round(delayInSeconds * 1000));

        this.messageTimers.push(timer);
    }

    public scheduleOutput(delayInSeconds: number, output: number, oldPosition: number | null, newPosition: number | null): void {
        const timer = setTimeout(() => {
            this.removeTimer(timer);

            this.node.receive(<MessageData>{
                topic: 'delayed output',
                command: 'output',
                payload: output,
                oldPosition: oldPosition,
                newPosition: newPosition,
            });
        }, Math.round(delayInSeconds * 1000));

        this.messageTimers.push(timer);
    }

    public scheduleUpdate(delayInSeconds: number): void {
        const timer = setTimeout(() => {
            this.removeTimer(timer);

            this.node.receive(<MessageData>{
                topic: 'delayed update',
                command: 'update',
            });
        }, Math.round(delayInSeconds * 1000));

        this.messageTimers.push(timer);
    }

    public scheduleStartAndStopTimes(): void {
        while (this.startAndStopTimers.length) {
            const timer = this.startAndStopTimers.shift();
            clearTimeout(timer);
        }

        const now = new Date();

        const times = [this.configuration.getDayStartTime(now), this.configuration.getNightStartTime(now), this.configuration.getDayStopTime(now), this.configuration.getNightStopTime(now)];

        for (const time of times) {
            if (time !== null) {
                const dateTime = new Date(time);
                dateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
                const delay = time - dateTime.getTime();

                if (delay >= 0) {
                    this.scheduleUpdate(delay / 1000 + 1);
                    const timer = this.messageTimers.pop();
                    if (typeof timer !== 'undefined') {
                        this.startAndStopTimers.push(timer);
                    }
                }
            }
        }
    }

    private scheduleDailyUpdate(): void {
        if (this.dailyTimer !== null) {
            clearTimeout(this.dailyTimer);
        }

        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 4, 20, 0);
        const delay = tomorrow.getTime() - now.getTime();

        this.dailyTimer = setTimeout(() => {
            this.dailyTimer = null;
            this.scheduleStartAndStopTimes();
            this.scheduleDailyUpdate();
        }, delay);
    }

    private removeTimer(timer: NodeJS.Timeout): void {
        for (let n = 0; n < this.messageTimers.length; n++) {
            if (this.messageTimers[n] === timer) {
                this.messageTimers.splice(n, 1);
                break;
            }
        }

        for (let n = 0; n < this.startAndStopTimers.length; n++) {
            if (this.startAndStopTimers[n] === timer) {
                this.startAndStopTimers.splice(n, 1);
                break;
            }
        }
    }
}

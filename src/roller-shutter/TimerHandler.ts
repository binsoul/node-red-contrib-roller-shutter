import { Node } from '@node-red/registry';
import { NodeMessageInFlow } from 'node-red';
import { clearTimeout, setTimeout } from 'timers';

interface MessageData extends NodeMessageInFlow {
    command?: string;
    timestamp?: number;
    oldPosition?: number | null;
    newPosition?: number | null;
}

export class TimerHandler {
    private node: Node;
    private timers: Array<NodeJS.Timeout> = [];

    constructor(node: Node) {
        this.node = node;
    }

    public clearTimer(): void {
        while (this.timers.length) {
            const timer = this.timers.shift();
            clearTimeout(timer);
        }
    }

    public scheduleUnpause(delay: number): void {
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
        }, delay * 1000);

        this.timers.push(timer);
    }

    public scheduleOutput(delay: number, output: number, oldPosition: number | null, newPosition: number | null): void {
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
        }, delay * 1000);

        this.timers.push(timer);
    }
}

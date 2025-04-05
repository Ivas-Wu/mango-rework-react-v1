import EventEmitter from "events";
import { TimeBroadcastConstants } from "../constants/EventConstants";

export class TimerService {
    private timerId!: any;
    private interval: number;
    private startTime!: number;
    private remainingTime!: number;
    
    private eventHandler: EventEmitter;

    public static instance: TimerService;

    private constructor() {
        this.timerId = null;
        this.interval = 15000;
        this.remainingTime = this.interval;
        this.eventHandler = new EventEmitter();
    }

    public static getInstance(): TimerService {
        if (!TimerService.instance) {
            TimerService.instance = new TimerService();
        }
        return TimerService.instance;
    }

    public setInterval(interval: number) {
        this.interval = interval * 1000;
    }

    public on(event: TimeBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }

    public off(event: TimeBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.off(event, listener);
    }

    public startTimer(callback: () => void): void {
        if (this.timerId !== null) return;

        const tick = () => {
            this.startTime = Date.now();
            callback();
            this.eventHandler.emit(TimeBroadcastConstants.TIMER_STARTED, this.interval);

            this.timerId = setTimeout(() => {
                tick();
            }, this.interval);

            this.updateTimeRemaining();
        };

        tick();
    }

    private updateTimeRemaining() {
        const intervalCheck = setInterval(() => {
            if (this.timerId === null) {
                clearInterval(intervalCheck);
                return;
            }

            const elapsed = Date.now() - this.startTime;
            this.remainingTime = Math.max(this.interval - elapsed, 0);
            this.eventHandler.emit(TimeBroadcastConstants.TIME_REMAINING, this.remainingTime);

            if (this.remainingTime <= 0) {
                clearInterval(intervalCheck);
            }
        }, 1000);
    }

    public stopTimer(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
}
export class TimerService {
    private timerId!: any;
    private interval: number;
    private startTime!: number;
    private remainingTime!: number;
    private paused: boolean;
    private callback: () => void = () => {};

    private tick = () => {
        this.startTime = Date.now();
        this.callback();

        this.timerId = setTimeout(() => {
            this.tick();
        }, this.interval);

        this.updateTimeRemaining(this.interval);
    };

    public constructor(interval: number, callback: () => void) {
        this.timerId = null;
        this.interval = interval * 1000;
        this.remainingTime = this.interval;
        this.paused = false;
        this.callback = callback;
    }

    public reset() {
        this.stopTimer();
    }

    public setInterval(interval: number) {
        this.interval = interval * 1000;
    }

    public startTimer(): void {
        if (this.timerId !== null) return;
        this.tick();
    }

    private updateTimeRemaining(interval: number) {
        const intervalCheck = setInterval(() => {
            if (this.timerId === null) {
                clearInterval(intervalCheck);
                return;
            }

            const elapsed = Date.now() - this.startTime;
            this.remainingTime = Math.max(interval - elapsed, 0);

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

    public pauseTimer(): void {
        if (this.timerId !== null && !this.paused) {
            clearTimeout(this.timerId);
            this.timerId = null;
            this.paused = true;
            const elapsed = Date.now() - this.startTime;
            this.remainingTime = Math.max(this.interval - elapsed, 0);
        }
    }

    public resumeTimer(): void {
        if (this.paused && this.timerId === null) {
            this.paused = false;
            this.startTime = Date.now();

            this.timerId = setTimeout(() => {
                this.tick();
            }, this.remainingTime);

            this.updateTimeRemaining(this.remainingTime);
        }
    }
}
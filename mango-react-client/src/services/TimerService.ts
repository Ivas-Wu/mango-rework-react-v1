export class TimerService {
    private timerId: any = null;
    private interval: number = 15000;

    public setInterval(interval: number) {
        this.interval = interval * 1000;
    }

    public startTimer(callback: () => void): void {
        if (this.timerId !== null) return;

        const tick = () => {
            callback();
            this.timerId = setTimeout(tick, this.interval);
        };

        tick();
    }

    public stopTimer(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
}

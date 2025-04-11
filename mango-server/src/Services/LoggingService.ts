export class LoggingService { //todo stub
    private static instance: LoggingService;

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }
    
    public logMessage(message: string): void {
        console.log(message); 
    }
}
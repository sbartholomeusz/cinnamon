import { Injectable } from '@angular/core';

export interface ILogger {
    Info(message: string): void;

    Warning(message: string): void;

    Error(message: string): void;
}

@Injectable({
    providedIn: 'root'
})
export class LoggingService implements ILogger {
    /**
     * Log information message
     * @param message String message
     */
    Info(message: string): void {
        console.log(message);
    }

    /**
     * Log warning message
     * @param message String message
     */
    Warning(message: string): void {
        console.warn(message);
    }

    /**
     * Log error message
     * @param message String message
     */
    Error(message: string): void {
        console.error(message);
    }
}
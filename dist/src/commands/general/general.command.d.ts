import { Connection } from 'typeorm';
export declare class GeneralCommand {
    private readonly connection;
    constructor(connection: Connection);
    cleanall(): Promise<void>;
    private deleteAllBuilder;
    private setEmptyBuilder;
    private perfectLog;
    private areYouSure;
}

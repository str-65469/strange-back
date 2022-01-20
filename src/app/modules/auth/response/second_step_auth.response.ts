import { LolAuthStatus } from 'src/app/common/enum/lol_auth_statuses.enum';

export class FirstStepAuthResponse {
    public uuid: string;
    public timeLeft?: Object | null = null;
}

export class SecondStepAuthResponse {
    public status: LolAuthStatus | null = null;
    public timeLeft?: Object | null = null;
}

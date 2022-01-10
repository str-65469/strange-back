export declare const configs: {
    tokens: {
        access_token: string;
        refresh_token: string;
        user_register_token: string;
        user_forgot_password: string;
    };
    messages: {
        exceptions: {
            generalMessage: string;
            accessTokenMissing: string;
            refreshTokenMissing: string;
            registerTokenMissing: string;
            forgotPasswordTokenExpired: string;
            forgotPasswordTokenMissing: string;
            forgotPasswordTokenMissMatch: string;
            forgotPasswordTokenPayloadIdMissing: string;
            summonerDivisionCheck: string;
        };
    };
    socket: {
        duomatchConnect: string;
        duomatchFind: string;
        chat: string;
    };
    general: {
        routes: {
            APP_URL: string;
            DASHBOARD_URL: string;
            MARKUP_URL: string;
            CHECKED_SERVER_URL: string;
        };
        frontMarkupRoutes: {
            notFound: string;
            registerTimeout: string;
        };
        dashboardRoutes: {
            userProfile: string;
        };
        DICEBEAR_MAX_SIZE: number;
        DICEBEAR_MIN_SIZE: number;
        PROFILE_UPLOAD_FILE_SIZE_MAX: number;
    };
};

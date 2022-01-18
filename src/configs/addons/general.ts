import * as dotenv from 'dotenv';
dotenv.config();

export default Object.freeze({
    // routes
    routes: {
        APP_URL: process.env.APP_URL,
        DASHBOARD_URL: process.env.DASHBOARD_URL,
        MARKUP_URL: process.env.MARKUP_URL,
    },

    frontMarkupRoutes: {
        notFound: '/not_found',
        registerTimeout: '/registration_timeout',
    },

    dashboardRoutes: {
        userProfile: '/profile',
    },

    // throttling, rate limitins
    REGISTER_TIMESTAMP_DURATION: 10, // 10 min

    AUTH_FIRST_STEP_THROTTLE: 15, // first step retrieves api
    AUTH_GENERAL_THROTTLE: 200, // 120 req in min from single ip

    DICEBEAR_MAX_SIZE: 12000, //~ 12kb
    DICEBEAR_MIN_SIZE: 10, //~ 0.01kb
    PROFILE_UPLOAD_FILE_SIZE_MAX: 1150000, // ~1.1mb (1048576 - exactly 1mb)
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
exports.default = {
    routes: {
        APP_URL: process.env.APP_URL,
        DASHBOARD_URL: process.env.DASHBOARD_URL,
        MARKUP_URL: process.env.MARKUP_URL,
        CHECKED_SERVER_URL: process.env.CHECKED_SERVER_URL,
    },
    frontMarkupRoutes: {
        notFound: '/not_found',
        registerTimeout: '/registration_timeout',
    },
    dashboardRoutes: {
        userProfile: '/profile',
    },
    DICEBEAR_MAX_SIZE: 12000,
    DICEBEAR_MIN_SIZE: 10,
    PROFILE_UPLOAD_FILE_SIZE_MAX: 1150000,
};
//# sourceMappingURL=general.js.map
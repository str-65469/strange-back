import * as dotenv from 'dotenv';
dotenv.config();

export default {
  // routes
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

  DICEBEAR_MAX_SIZE: 12000, //~ 12kb
  DICEBEAR_MIN_SIZE: 10, //~ 0.01kb
  PROFILE_UPLOAD_FILE_SIZE_MAX: 1150000, // ~1.1mb (1048576 - exactly 1mb)
};

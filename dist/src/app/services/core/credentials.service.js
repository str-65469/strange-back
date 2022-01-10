"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsService = void 0;
const common_1 = require("@nestjs/common");
const credentials_response_1 = require("../../common/response/credentials/credentials.response");
const firebase_credentials_response_1 = require("../../common/response/credentials/firebase_credentials.response");
let CredentialsService = class CredentialsService {
    credentials() {
        const credentials = new credentials_response_1.CredentialsResponse();
        credentials.firebase = this.firebaseCredentials();
        return credentials;
    }
    firebaseCredentials() {
        return {
            apiKey: process.env.FIREBASE_API_KEY || null,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || null,
            projectId: process.env.FIREBASE_PROJECT_ID || null,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || null,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || null,
            appId: process.env.FIREBASE_APP_ID || null,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID || null,
        };
    }
};
CredentialsService = __decorate([
    (0, common_1.Injectable)()
], CredentialsService);
exports.CredentialsService = CredentialsService;
//# sourceMappingURL=credentials.service.js.map
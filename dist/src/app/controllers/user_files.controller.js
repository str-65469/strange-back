"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileController = void 0;
const common_1 = require("@nestjs/common");
const user_safe_interceptor_1 = require("../security/interceptors/user_safe.interceptor");
const platform_express_1 = require("@nestjs/platform-express");
const file_helper_1 = require("../utils/file_helper");
const multer_1 = require("multer");
const users_service_1 = require("../services/core/user/users.service");
const config_1 = require("../../configs/config");
let UserFileController = class UserFileController {
    constructor(userService) {
        this.userService = userService;
    }
    async uploadProfileImage(file, req) {
        const id = this.userService.userID(req);
        return await this.userService.updateImagePath(id, file.filename);
    }
};
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile_image', {
        storage: (0, multer_1.diskStorage)({
            destination: './upload/user/profiles',
            filename: file_helper_1.FileHelper.customFileName,
        }),
        fileFilter: file_helper_1.FileHelper.imageFileFilter,
        limits: { fileSize: config_1.configs.general.PROFILE_UPLOAD_FILE_SIZE_MAX },
    }), user_safe_interceptor_1.UserSafeInterceptor),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserFileController.prototype, "uploadProfileImage", null);
UserFileController = __decorate([
    (0, common_1.Controller)('user/upload'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserFileController);
exports.UserFileController = UserFileController;
//# sourceMappingURL=user_files.controller.js.map
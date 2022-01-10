"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
const path = require("path");
const common_1 = require("@nestjs/common");
const config_1 = require("../../configs/config");
const exception_message_code_enum_1 = require("../common/enum/message_codes/exception_message_code.enum");
const general_exception_1 = require("../common/exceptions/general.exception");
const url_builder_1 = require("./url_builder");
class FileHelper {
    static imagePath(img_path) {
        if (process.env.NODE_ENV === 'development') {
            const upload = (0, url_builder_1.createUrl)(config_1.configs.general.routes.APP_URL, { path: ['/upload', img_path !== null && img_path !== void 0 ? img_path : ''] });
            return img_path ? upload : null;
        }
        if (img_path && img_path.startsWith('data:image')) {
            return img_path !== null && img_path !== void 0 ? img_path : null;
        }
        const upload = (0, url_builder_1.createUrl)(config_1.configs.general.routes.APP_URL, { path: ['/upload', img_path !== null && img_path !== void 0 ? img_path : ''] });
        return img_path ? upload : null;
    }
    static imageFileFilter(_, file, callback) {
        if (!file.originalname.match(/\.(jpeg)$/)) {
            return callback(new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.ONLY_JPEG_ALLOWED), false);
        }
        callback(null, true);
    }
    static customFileName(_, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = path.extname(file.originalname);
        const fileName = `${uniqueSuffix}${fileExtName}`;
        callback(null, fileName);
    }
    static profileImage(progileImageId) {
        return (0, url_builder_1.createUrl)(config_1.configs.general.routes.APP_URL, {
            path: this.profileImagePath(progileImageId),
        });
    }
    static profileImagePath(progileImageId) {
        return `/public/static/11.24.1/img/profileicon/${progileImageId}.png`;
    }
}
exports.FileHelper = FileHelper;
//# sourceMappingURL=file_helper.js.map
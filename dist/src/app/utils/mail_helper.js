"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailHelper = void 0;
class MailHelper {
    static senderAdress(name, email, additionalText) {
        if (additionalText) {
            return `"${name} ${additionalText}" <${email}>`;
        }
        return `"${name}" <${email}>`;
    }
}
exports.MailHelper = MailHelper;
//# sourceMappingURL=mail_helper.js.map
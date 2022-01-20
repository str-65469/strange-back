export class MailHelper {
    public static senderAdress(name: string, email: string, additionalText?: string): string {
        if (additionalText) {
            return `"${name} ${additionalText}" <${email}>`;
        }

        return `"${name}" <${email}>`;
    }
}

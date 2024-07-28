export interface MailRequest {
    toEmail: string;
    subject: string;
    fromEmail: string;
    firstName: string;
    lastName: string;
    telephoneNumber: string;
    body: string;
    // attachments: File[];
}
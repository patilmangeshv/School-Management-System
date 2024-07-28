using API.DTOs;
using API.Interfaces;
using Microsoft.Extensions.Options;
using API.Helpers;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace API.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;

        public MailService(IOptions<MailSettings> mailSettings)
        {
            this._mailSettings = mailSettings.Value;
        }
        
        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            try
            {
                mailRequest.Subject = "Email sent by " + mailRequest.FirstName + " " + mailRequest.LastName + " using website contact";
                mailRequest.Body = "Tel. No.: " + mailRequest.TelephoneNumber + "<hr>" + mailRequest.Body;

                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_mailSettings.Mail));
                // email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
                email.Cc.Add(MailboxAddress.Parse(mailRequest.FromEmail));
                email.Subject = mailRequest.Subject;
                var builder = new BodyBuilder();
                // if (mailRequest.Attachments != null)
                // {
                //     byte[] fileBytes;
                //     foreach (var file in mailRequest.Attachments)
                //     {
                //         if (file.Length > 0)
                //         {
                //             using (var ms = new MemoryStream())
                //             {
                //                 file.CopyTo(ms);
                //                 fileBytes = ms.ToArray();
                //             }
                //             builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                //         }
                //     }
                // }
                builder.HtmlBody = mailRequest.Body;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
        }
    }
}
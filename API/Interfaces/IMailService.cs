using API.DTOs;

namespace API.Interfaces
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
        // Task SendContactMessage(MailRequest mailRequest);
    }
}
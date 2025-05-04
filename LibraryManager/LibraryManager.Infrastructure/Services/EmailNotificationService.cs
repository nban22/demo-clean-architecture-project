using LibraryManager.Core.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;

namespace LibraryManager.Infrastructure.Services
{
    public class EmailNotificationService : INotificationService
    {
        private readonly ILogger<EmailNotificationService> _logger;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _senderEmail;

        public EmailNotificationService(
            ILogger<EmailNotificationService> logger,
            string smtpServer,
            int smtpPort,
            string smtpUsername,
            string smtpPassword,
            string senderEmail)
        {
            _logger = logger;
            _smtpServer = smtpServer;
            _smtpPort = smtpPort;
            _smtpUsername = smtpUsername;
            _smtpPassword = smtpPassword;
            _senderEmail = senderEmail;
        }

        public async Task SendOverdueNotificationAsync(string email, string readerName, string bookTitle, DateTime dueDate)
        {
            var subject = "Thông báo sách quá hạn";
            var body = $"Xin chào {readerName},\n\n" +
                       $"Cuốn sách '{bookTitle}' bạn mượn đã quá hạn trả. " +
                       $"Ngày hạn trả là {dueDate:dd/MM/yyyy}. " +
                       $"Vui lòng trả sách càng sớm càng tốt để tránh phí phạt.\n\n" +
                       $"Trân trọng,\nThư viện XYZ";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendBookReturnedNotificationAsync(string email, string readerName, string bookTitle)
        {
            var subject = "Xác nhận trả sách";
            var body = $"Xin chào {readerName},\n\n" +
                       $"Cảm ơn bạn đã trả sách '{bookTitle}'. " +
                       $"Sách đã được cập nhật trong hệ thống.\n\n" +
                       $"Trân trọng,\nThư viện XYZ";

            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            try
            {
                using var client = new SmtpClient(_smtpServer, _smtpPort)
                {
                    Credentials = new NetworkCredential(_smtpUsername, _smtpPassword),
                    EnableSsl = true
                };

                var message = new MailMessage
                {
                    From = new MailAddress(_senderEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };

                message.To.Add(recipientEmail);

                // Trong môi trường production, sử dụng SendMailAsync
                // Nhưng trong ứng dụng mẫu, chúng ta log thông báo
                _logger.LogInformation($"Sending email to {recipientEmail}: {subject}");
                // await client.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Không thể gửi email tới {recipientEmail}");
            }
        }
    }
}
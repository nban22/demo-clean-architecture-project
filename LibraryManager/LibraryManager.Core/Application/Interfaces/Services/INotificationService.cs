namespace LibraryManager.Core.Application.Interfaces.Services
{
    public interface INotificationService
    {
        Task SendOverdueNotificationAsync(string email, string readerName, string bookTitle, DateTime dueDate);
        Task SendBookReturnedNotificationAsync(string email, string readerName, string bookTitle);
    }
}
using LibraryManager.Core.Application.DTOs;
using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Application.Interfaces.Services;
using LibraryManager.Core.Domain.Entities;

namespace LibraryManager.Core.Application.Services
{
    public class LoanService(
        ILoanRepository loanRepository,
        IBookRepository bookRepository,
        IReaderRepository readerRepository,
        INotificationService notificationService)
    {
        private readonly ILoanRepository _loanRepository = loanRepository;
        private readonly IBookRepository _bookRepository = bookRepository;
        private readonly IReaderRepository _readerRepository = readerRepository;
        private readonly INotificationService _notificationService = notificationService;

        public async Task<int> CreateLoanAsync(int bookId, int readerId, DateTime dueDate)
        {
            var book = await _bookRepository.GetByIdAsync(bookId);
            if (book == null)
                throw new KeyNotFoundException($"Không tìm thấy sách có ID {bookId}");
            if (!book.IsAvailable)
                throw new InvalidOperationException("Sách này đã được mượn");
            var reader = await _readerRepository.GetByIdAsync(readerId);
            if (reader == null)
                throw new KeyNotFoundException($"Không tìm thấy độc giả có ID {readerId}");
            var loan = new Loan(book, reader, dueDate);
            await _loanRepository.AddAsync(loan);
            return loan.Id;
        }
        public async Task ReturnBookAsync(int loanId)
        {
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null)
                throw new KeyNotFoundException($"Không tìm thấy phiếu mượn có ID {loanId}");

            if (loan.ReturnDate.HasValue)
                throw new InvalidOperationException("Sách này đã được trả");

            loan.ReturnBook();
            await _loanRepository.UpdateAsync(loan);

            await _notificationService.SendBookReturnedNotificationAsync(
                loan.Reader.Email,
                loan.Reader.Name,
                loan.Book.Title);
        }
        public async Task<IEnumerable<LoanDto>> GetAllLoansAsync()
        {
            var loans = await _loanRepository.GetAllAsync();
            return loans.Select(MapLoanToDto);
        }

        public async Task<IEnumerable<LoanDto>> GetActiveLoansAsync()
        {
            var loans = await _loanRepository.GetActiveLoansAsync();
            return loans.Select(MapLoanToDto);
        }

        public async Task<IEnumerable<LoanDto>> GetOverdueLoansAsync()
        {
            var loans = await _loanRepository.GetOverdueLoansAsync();
            return loans.Select(MapLoanToDto);
        }

        public async Task<LoanDto> GetLoanByIdAsync(int id)
        {
            var loan = await _loanRepository.GetByIdAsync(id);
            if (loan == null)
                return null;

            return MapLoanToDto(loan);
        }

        public async Task NotifyOverdueLoansAsync()
        {
            var overdueLoans = await _loanRepository.GetOverdueLoansAsync();

            foreach (var loan in overdueLoans)
            {
                await _notificationService.SendOverdueNotificationAsync(
                    loan.Reader.Email,
                    loan.Reader.Name,
                    loan.Book.Title,
                    loan.DueDate);
            }
        }

        private LoanDto MapLoanToDto(Loan loan)
        {
            return new LoanDto
            {
                Id = loan.Id,
                BookId = loan.BookId,
                BookTitle = loan.Book.Title,
                ReaderId = loan.ReaderId,
                ReaderName = loan.Reader.Name,
                LoanDate = loan.LoanDate,
                DueDate = loan.DueDate,
                ReturnDate = loan.ReturnDate,
                IsOverdue = loan.IsOverdue()
            };
        }
    }
}
using LibraryManager.Core.Domain.Entities;

namespace LibraryManager.Core.Application.Interfaces.Repositories
{
    public interface ILoanRepository
    {
        Task<Loan> GetByIdAsync(int id);
        Task<IEnumerable<Loan>> GetAllAsync();
        Task<IEnumerable<Loan>> GetActiveLoansAsync();
        Task<IEnumerable<Loan>> GetOverdueLoansAsync();
        Task<IEnumerable<Loan>> GetLoansByReaderIdAsync(int readerId);
        Task AddAsync(Loan loan);
        Task UpdateAsync(Loan loan);
    }
}
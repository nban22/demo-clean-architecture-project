using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Domain.Entities;
using LibraryManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManager.Infrastructure.Data.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly LibraryDbContext _context;

        public LoanRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<Loan> GetByIdAsync(int id)
        {
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Reader)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Reader)
                .ToListAsync();
        }

        public async Task<IEnumerable<Loan>> GetActiveLoansAsync()
        {
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Reader)
                .Where(l => !l.ReturnDate.HasValue)
                .ToListAsync();
        }

        public async Task<IEnumerable<Loan>> GetOverdueLoansAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Reader)
                .Where(l => !l.ReturnDate.HasValue && l.DueDate < now)
                .ToListAsync();
        }

        public async Task<IEnumerable<Loan>> GetLoansByReaderIdAsync(int readerId)
        {
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Reader)
                .Where(l => l.ReaderId == readerId)
                .ToListAsync();
        }

        public async Task AddAsync(Loan loan)
        {
            await _context.Loans.AddAsync(loan);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Loan loan)
        {
            _context.Loans.Update(loan);
            await _context.SaveChangesAsync();
        }
    }
}
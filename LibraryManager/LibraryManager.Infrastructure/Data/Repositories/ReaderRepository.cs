using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Domain.Entities;
using LibraryManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManager.Infrastructure.Data.Repositories
{
    public class ReaderRepository : IReaderRepository
    {
        private readonly LibraryDbContext _context;

        public ReaderRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<Reader> GetByIdAsync(int id)
        {
            return await _context.Readers.FindAsync(id);
        }

        public async Task<IEnumerable<Reader>> GetAllAsync()
        {
            return await _context.Readers.ToListAsync();
        }

        public async Task<Reader> GetByEmailAsync(string email)
        {
            return await _context.Readers
                .FirstOrDefaultAsync(r => r.Email == email);
        }

        public async Task AddAsync(Reader reader)
        {
            await _context.Readers.AddAsync(reader);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Reader reader)
        {
            _context.Readers.Update(reader);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var reader = await _context.Readers.FindAsync(id);
            if (reader != null)
            {
                _context.Readers.Remove(reader);
                await _context.SaveChangesAsync();
            }
        }
    }
}
using LibraryManager.Core.Domain.Entities;

namespace LibraryManager.Core.Application.Interfaces.Repositories
{
    public interface IReaderRepository
    {
        Task<Reader> GetByIdAsync(int id);
        Task<IEnumerable<Reader>> GetAllAsync();
        Task<Reader> GetByEmailAsync(string email);
        Task AddAsync(Reader reader);
        Task UpdateAsync(Reader reader);
        Task DeleteAsync(int id);
    }
}
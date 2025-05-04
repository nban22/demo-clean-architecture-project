// FileLoanRepository.cs
using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Domain.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManager.Infrastructure.Data.Repositories
{
    public class FileLoanRepository : ILoanRepository
    {
        private readonly string _filePath;
        private readonly IBookRepository _bookRepository;
        private readonly IReaderRepository _readerRepository;
        private static int _lastId = 0;

        public FileLoanRepository(string filePath, IBookRepository bookRepository, IReaderRepository readerRepository)
        {
            _filePath = filePath;
            _bookRepository = bookRepository;
            _readerRepository = readerRepository;

            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(filePath))
            {
                File.WriteAllText(filePath, "[]");
            }
            else
            {
                var loans = ReadLoansRaw().Result;
                if (loans.Any())
                {
                    _lastId = loans.Max(l => l.Id);
                }
            }
        }

        private async Task<List<Loan>> ReadLoansRaw()
        {
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonConvert.DeserializeObject<List<Loan>>(json) ?? new List<Loan>();
        }

        private async Task WriteLoans(List<Loan> loans)
        {
            var json = JsonConvert.SerializeObject(loans, Formatting.Indented,
                new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
            await File.WriteAllTextAsync(_filePath, json);
        }

        private async Task<Loan> EnrichLoan(Loan loan)
        {
            if (loan == null) return null;

            var book = await _bookRepository.GetByIdAsync(loan.BookId);
            var reader = await _readerRepository.GetByIdAsync(loan.ReaderId);

            // Use reflection to set Book and Reader properties
            var loanType = typeof(Loan);
            var bookProperty = loanType.GetProperty("Book");
            var readerProperty = loanType.GetProperty("Reader");

            bookProperty.SetValue(loan, book);
            readerProperty.SetValue(loan, reader);

            return loan;
        }

        public async Task<Loan> GetByIdAsync(int id)
        {
            var loans = await ReadLoansRaw();
            var loan = loans.FirstOrDefault(l => l.Id == id);
            return await EnrichLoan(loan);
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            var loans = await ReadLoansRaw();
            var enrichedLoans = new List<Loan>();

            foreach (var loan in loans)
            {
                enrichedLoans.Add(await EnrichLoan(loan));
            }

            return enrichedLoans;
        }

        public async Task<IEnumerable<Loan>> GetActiveLoansAsync()
        {
            var loans = await ReadLoansRaw();
            var activeLoans = loans.Where(l => !l.ReturnDate.HasValue).ToList();

            var enrichedLoans = new List<Loan>();
            foreach (var loan in activeLoans)
            {
                enrichedLoans.Add(await EnrichLoan(loan));
            }

            return enrichedLoans;
        }

        public async Task<IEnumerable<Loan>> GetOverdueLoansAsync()
        {
            var now = DateTime.UtcNow;
            var loans = await ReadLoansRaw();
            var overdueLoans = loans.Where(l => !l.ReturnDate.HasValue && l.DueDate < now).ToList();

            var enrichedLoans = new List<Loan>();
            foreach (var loan in overdueLoans)
            {
                enrichedLoans.Add(await EnrichLoan(loan));
            }

            return enrichedLoans;
        }

        public async Task<IEnumerable<Loan>> GetLoansByReaderIdAsync(int readerId)
        {
            var loans = await ReadLoansRaw();
            var readerLoans = loans.Where(l => l.ReaderId == readerId).ToList();

            var enrichedLoans = new List<Loan>();
            foreach (var loan in readerLoans)
            {
                enrichedLoans.Add(await EnrichLoan(loan));
            }

            return enrichedLoans;
        }

        public async Task AddAsync(Loan loan)
        {
            var loans = await ReadLoansRaw();

            var type = typeof(Loan);
            var idProperty = type.GetProperty("Id");
            _lastId++;
            idProperty.SetValue(loan, _lastId);

            loans.Add(loan);
            await WriteLoans(loans);

            // Update book availability
            var book = await _bookRepository.GetByIdAsync(loan.BookId);
            book.MarkAsUnavailable();
            await _bookRepository.UpdateAsync(book);
        }

        public async Task UpdateAsync(Loan loan)
        {
            var loans = await ReadLoansRaw();
            var index = loans.FindIndex(l => l.Id == loan.Id);

            if (index != -1)
            {
                loans[index] = loan;
                await WriteLoans(loans);

                // If returning a book, update its availability
                if (loan.ReturnDate.HasValue)
                {
                    var book = await _bookRepository.GetByIdAsync(loan.BookId);
                    book.MarkAsAvailable();
                    await _bookRepository.UpdateAsync(book);
                }
            }
        }
    }
}
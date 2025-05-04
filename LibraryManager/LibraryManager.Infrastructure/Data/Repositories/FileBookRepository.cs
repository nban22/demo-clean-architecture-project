// Trong LibraryManager.Infrastructure/Data/Repositories/FileBookRepository.cs
using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Domain.Entities;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace LibraryManager.Infrastructure.Data.Repositories
{
    public class FileBookRepository : IBookRepository
    {
        private readonly string _filePath;
        private static int _lastId = 0;

        public FileBookRepository(string filePath)
        {
            _filePath = filePath;

            // Tạo thư mục nếu chưa tồn tại
            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            // Tạo file nếu chưa tồn tại
            if (!File.Exists(filePath))
            {
                File.WriteAllText(filePath, "[]");
            }
            else
            {
                // Lấy ID lớn nhất hiện tại
                var books = ReadBooks().Result;
                if (books.Any())
                {
                    _lastId = books.Max(b => b.Id);
                }
            }
        }

        private async Task<List<Book>> ReadBooks()
        {
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonConvert.DeserializeObject<List<Book>>(json) ?? new List<Book>();
        }

        private async Task WriteBooks(List<Book> books)
        {
            var json = JsonConvert.SerializeObject(books, Newtonsoft.Json.Formatting.Indented);
            await File.WriteAllTextAsync(_filePath, json);
        }

        public async Task<Book> GetByIdAsync(int id)
        {
            var books = await ReadBooks();
            return books.FirstOrDefault(b => b.Id == id);
        }

        public async Task<IEnumerable<Book>> GetAllAsync()
        {
            return await ReadBooks();
        }

        public async Task<Book> GetByISBNAsync(string isbn)
        {
            var books = await ReadBooks();
            return books.FirstOrDefault(b => b.ISBN == isbn);
        }

        public async Task AddAsync(Book book)
        {
            var books = await ReadBooks();

            // Đặt ID mới
            var type = typeof(Book);
            var idProperty = type.GetProperty("Id");
            _lastId++;
            idProperty.SetValue(book, _lastId);

            books.Add(book);
            await WriteBooks(books);
        }

        public async Task UpdateAsync(Book book)
        {
            var books = await ReadBooks();
            var index = books.FindIndex(b => b.Id == book.Id);

            if (index != -1)
            {
                books[index] = book;
                await WriteBooks(books);
            }
        }

        public async Task DeleteAsync(int id)
        {
            var books = await ReadBooks();
            var book = books.FirstOrDefault(b => b.Id == id);

            if (book != null)
            {
                books.Remove(book);
                await WriteBooks(books);
            }
        }
    }
}
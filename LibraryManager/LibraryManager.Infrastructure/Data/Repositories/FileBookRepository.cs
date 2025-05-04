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

        public FileBookRepository(string filePath)
        {
            _filePath = filePath;

            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(filePath))
            {
                File.WriteAllText(filePath, "[]");
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

            // Tìm ID lớn nhất hiện tại
            int maxId = 0;
            if (books.Any())
            {
                maxId = books.Max(b => b.Id);
            }

            // Gán ID mới = maxId + 1
            var type = typeof(Book);
            var idProperty = type.GetProperty("Id");
            idProperty.SetValue(book, maxId + 1);

            Console.WriteLine($"Adding book with ID: {book.Id}, Title: {book.Title}");

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
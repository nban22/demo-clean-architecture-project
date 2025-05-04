using LibraryManager.Core.Application.DTOs;
using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Domain.Entities;

namespace LibraryManager.Core.Application.Services
{
    public class BookService
    {
        private readonly IBookRepository _bookRepository;

        public BookService(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            var books = await _bookRepository.GetAllAsync();
            return books.Select(book => new BookDto
            {
                Id = book.Id,
                ISBN = book.ISBN,
                Title = book.Title,
                Author = book.Author,
                PublicationYear = book.PublicationYear,
                IsAvailable = book.IsAvailable
            });
        }

        public async Task<BookDto> GetBookByIdAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                return null;

            return new BookDto
            {
                Id = book.Id,
                ISBN = book.ISBN,
                Title = book.Title,
                Author = book.Author,
                PublicationYear = book.PublicationYear,
                IsAvailable = book.IsAvailable
            };
        }

        public async Task<int> AddBookAsync(BookDto bookDto)
        {
            var bookExists = await _bookRepository.GetByISBNAsync(bookDto.ISBN);
            if (bookExists != null)
                throw new InvalidOperationException($"Sách với ISBN {bookDto.ISBN} đã tồn tại");

            var book = new Book(bookDto.ISBN, bookDto.Title, bookDto.Author, bookDto.PublicationYear);
            await _bookRepository.AddAsync(book);
            return book.Id;
        }

        public async Task UpdateBookAsync(BookDto bookDto)
        {
            var book = await _bookRepository.GetByIdAsync(bookDto.Id);
            if (book == null)
                throw new KeyNotFoundException($"Không tìm thấy sách có ID {bookDto.Id}");

            var updatedBook = new Book(bookDto.ISBN, bookDto.Title, bookDto.Author, bookDto.PublicationYear);

            var type = typeof(Book);
            var idProperty = type.GetProperty("Id");
            idProperty.SetValue(updatedBook, book.Id);

            if (!bookDto.IsAvailable)
                updatedBook.MarkAsUnavailable();

            await _bookRepository.UpdateAsync(updatedBook);
        }

        public async Task DeleteBookAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                throw new KeyNotFoundException($"Không tìm thấy sách có ID {id}");

            await _bookRepository.DeleteAsync(id);
        }
    }
}
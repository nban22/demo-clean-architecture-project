namespace LibraryManager.Core.Domain.Entities
{
    public class Loan
    {
        public int Id { get; private set; }
        public int BookId { get; private set; }
        public Book Book { get; private set; }
        public int ReaderId { get; private set; }
        public Reader Reader { get; private set; }
        public DateTime LoanDate { get; private set; }
        public DateTime DueDate { get; private set; }
        public DateTime? ReturnDate { get; private set; }

        public Loan(Book book, Reader reader, DateTime dueDate)
        {
            if (book == null)
                throw new ArgumentNullException(nameof(book));

            if (reader == null)
                throw new ArgumentNullException(nameof(reader));

            if (!book.IsAvailable)
                throw new InvalidOperationException("Sách đã được mượn");

            if (dueDate <= DateTime.UtcNow)
                throw new ArgumentException("Ngày hạn trả phải sau ngày mượn", nameof(dueDate));

            Book = book;
            BookId = book.Id;
            Reader = reader;
            ReaderId = reader.Id;
            LoanDate = DateTime.UtcNow;
            DueDate = dueDate;

            book.MarkAsUnavailable();
        }

        // Để Entity Framework Core sử dụng
        private Loan() { }

        public void ReturnBook()
        {
            if (ReturnDate.HasValue)
                throw new InvalidOperationException("Sách đã được trả");

            ReturnDate = DateTime.UtcNow;
            Book.MarkAsAvailable();
        }

        public bool IsOverdue() => !ReturnDate.HasValue && DateTime.UtcNow > DueDate;
    }
}
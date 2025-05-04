namespace LibraryManager.Core.Domain.Entities
{
    public class Book
    {
        public int Id { get; private set; }
        public string ISBN { get; private set; }
        public string Title { get; private set; }
        public string Author { get; private set; }
        public int PublicationYear { get; private set; }
        public bool IsAvailable { get; private set; }
        public Book(string isbn, string title, string author, int publicationYear)
        {
            if (string.IsNullOrWhiteSpace(isbn))
                throw new ArgumentException("ISBN không được để trống", nameof(isbn));

            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Tiêu đề không được để trống", nameof(title));

            if (string.IsNullOrWhiteSpace(author))
                throw new ArgumentException("Tác giả không được để trống", nameof(author));

            if (publicationYear <= 0)
                throw new ArgumentException("Năm phát hành không hợp lệ", nameof(publicationYear));
            ISBN = isbn;
            Title = title;
            Author = author;
            PublicationYear = publicationYear;
            IsAvailable = true;
        }
        private Book() { }
        public void MarkAsUnavailable() { IsAvailable = false; }
        public void MarkAsAvailable() { IsAvailable = true; }
    }
}

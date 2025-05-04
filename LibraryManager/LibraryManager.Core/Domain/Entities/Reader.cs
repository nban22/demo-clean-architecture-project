namespace LibraryManager.Core.Domain.Entities
{
    public class Reader
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }
        public string PhoneNumber { get; private set; }
        public DateTime MembershipDate { get; private set; }

        private readonly List<Loan> _loans = new();
        public IReadOnlyCollection<Loan> Loans => _loans.AsReadOnly();

        public Reader(string name, string email, string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Tên không được để trống", nameof(name));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email không được để trống", nameof(email));

            Name = name;
            Email = email;
            PhoneNumber = phoneNumber;
            MembershipDate = DateTime.UtcNow;
        }

        // Để Entity Framework Core sử dụng
        private Reader() { }

        public void AddLoan(Loan loan)
        {
            _loans.Add(loan);
        }
    }
}
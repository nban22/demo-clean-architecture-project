using LibraryManager.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryManager.Infrastructure.Data.Configurations
{
    public class ReaderConfiguration : IEntityTypeConfiguration<Reader>
    {
        public void Configure(EntityTypeBuilder<Reader> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(r => r.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(r => r.PhoneNumber)
                .HasMaxLength(20);

            builder.Property(r => r.MembershipDate)
                .IsRequired();

            builder.HasIndex(r => r.Email)
                .IsUnique();

            // Cấu hình mối quan hệ với Loan
            builder.HasMany(r => r.Loans)
                .WithOne(l => l.Reader)
                .HasForeignKey(l => l.ReaderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
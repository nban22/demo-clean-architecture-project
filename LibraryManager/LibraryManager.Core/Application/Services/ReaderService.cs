using LibraryManager.Core.Application.DTOs;
using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Domain.Entities;

namespace LibraryManager.Core.Application.Services
{
    public class ReaderService
    {
        private readonly IReaderRepository _readerRepository;

        public ReaderService(IReaderRepository readerRepository)
        {
            _readerRepository = readerRepository;
        }

        public async Task<IEnumerable<ReaderDto>> GetAllReadersAsync()
        {
            var readers = await _readerRepository.GetAllAsync();
            return readers.Select(reader => new ReaderDto
            {
                Id = reader.Id,
                Name = reader.Name,
                Email = reader.Email,
                PhoneNumber = reader.PhoneNumber,
                MembershipDate = reader.MembershipDate
            });
        }

        public async Task<ReaderDto> GetReaderByIdAsync(int id)
        {
            var reader = await _readerRepository.GetByIdAsync(id);
            if (reader == null)
                return null;

            return new ReaderDto
            {
                Id = reader.Id,
                Name = reader.Name,
                Email = reader.Email,
                PhoneNumber = reader.PhoneNumber,
                MembershipDate = reader.MembershipDate
            };
        }

        public async Task<int> AddReaderAsync(ReaderDto readerDto)
        {
            var readerExists = await _readerRepository.GetByEmailAsync(readerDto.Email);
            if (readerExists != null)
                throw new InvalidOperationException($"Độc giả với email {readerDto.Email} đã tồn tại");

            var reader = new Reader(readerDto.Name, readerDto.Email, readerDto.PhoneNumber);
            await _readerRepository.AddAsync(reader);
            return reader.Id;
        }

        public async Task UpdateReaderAsync(ReaderDto readerDto)
        {
            var reader = await _readerRepository.GetByIdAsync(readerDto.Id);
            if (reader == null)
                throw new KeyNotFoundException($"Không tìm thấy độc giả có ID {readerDto.Id}");

            // Trong thực tế, chúng ta nên có một phương thức Update trong Entity để cập nhật các thuộc tính
            var updatedReader = new Reader(readerDto.Name, readerDto.Email, readerDto.PhoneNumber);

            // Sau đó sao chép lại ID và ngày đăng ký
            var type = typeof(Reader);
            var idProperty = type.GetProperty("Id");
            idProperty.SetValue(updatedReader, reader.Id);

            var membershipDateProperty = type.GetProperty("MembershipDate");
            membershipDateProperty.SetValue(updatedReader, reader.MembershipDate);

            await _readerRepository.UpdateAsync(updatedReader);
        }

        public async Task DeleteReaderAsync(int id)
        {
            var reader = await _readerRepository.GetByIdAsync(id);
            if (reader == null)
                throw new KeyNotFoundException($"Không tìm thấy độc giả có ID {id}");

            await _readerRepository.DeleteAsync(id);
        }
    }
}
﻿// FileReaderRepository.cs
using LibraryManager.Core.Application.Interfaces.Repositories;
using LibraryManager.Core.Domain.Entities;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManager.Infrastructure.Data.Repositories
{
    public class FileReaderRepository : IReaderRepository
    {
        private readonly string _filePath;

        public FileReaderRepository(string filePath)
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

        private async Task<List<Reader>> ReadReaders()
        {
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonConvert.DeserializeObject<List<Reader>>(json) ?? new List<Reader>();
        }

        private async Task WriteReaders(List<Reader> readers)
        {
            var json = JsonConvert.SerializeObject(readers, Formatting.Indented);
            await File.WriteAllTextAsync(_filePath, json);
        }


        public async Task<Reader> GetByIdAsync(int id)
        {
            var readers = await ReadReaders();
            return readers.FirstOrDefault(r => r.Id == id);
        }

        public async Task<IEnumerable<Reader>> GetAllAsync()
        {
            return await ReadReaders();
        }

        public async Task<Reader> GetByEmailAsync(string email)
        {
            var readers = await ReadReaders();
            return readers.FirstOrDefault(r => r.Email.ToLower() == email.ToLower());
        }

        public async Task AddAsync(Reader reader)
        {
            var readers = await ReadReaders();

            // Tìm ID lớn nhất hiện tại
            int maxId = 0;
            if (readers.Any())
            {
                maxId = readers.Max(r => r.Id);
            }

            // Gán ID mới = maxId + 1
            var type = typeof(Reader);
            var idProperty = type.GetProperty("Id");
            idProperty.SetValue(reader, maxId + 1);

            Console.WriteLine($"Adding reader with ID: {reader.Id}, Name: {reader.Name}");

            readers.Add(reader);
            await WriteReaders(readers);
        }



        public async Task UpdateAsync(Reader reader)
        {
            var readers = await ReadReaders();
            var index = readers.FindIndex(r => r.Id == reader.Id);

            if (index != -1)
            {
                readers[index] = reader;
                await WriteReaders(readers);
            }
        }

        public async Task DeleteAsync(int id)
        {
            var readers = await ReadReaders();
            var reader = readers.FirstOrDefault(r => r.Id == id);

            if (reader != null)
            {
                readers.Remove(reader);
                await WriteReaders(readers);
            }
        }
    }
}
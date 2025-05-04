using LibraryManager.Core.Application.DTOs;
using LibraryManager.Core.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReadersController : ControllerBase
    {
        private readonly ReaderService _readerService;

        public ReadersController(ReaderService readerService)
        {
            _readerService = readerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReaderDto>>> GetAllReaders()
        {
            var readers = await _readerService.GetAllReadersAsync();
            return Ok(readers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReaderDto>> GetReader(int id)
        {
            var reader = await _readerService.GetReaderByIdAsync(id);

            if (reader == null)
                return NotFound();

            return Ok(reader);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateReader(ReaderDto readerDto)
        {
            try
            {
                var readerId = await _readerService.AddReaderAsync(readerDto);
                return CreatedAtAction(nameof(GetReader), new { id = readerId }, readerId);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReader(int id, ReaderDto readerDto)
        {
            if (id != readerDto.Id)
                return BadRequest();

            try
            {
                await _readerService.UpdateReaderAsync(readerDto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReader(int id)
        {
            try
            {
                await _readerService.DeleteReaderAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
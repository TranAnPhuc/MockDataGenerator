using Microsoft.AspNetCore.Mvc;
using MockDataGenerator.API.DTOs;
using MockDataGenerator.API.Services;

namespace MockDataGenerator.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenerateController : ControllerBase
    {
        private readonly IGenerateService _generateService;

        public GenerateController(IGenerateService generateService)
        {
            _generateService = generateService;
        }

        /// <summary>
        /// Generate mock data rows using Bogus.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/generate
        ///     {
        ///       "fields": ["FullName", "Email", "PhoneNumber", "Address"],
        ///       "count": 100
        ///     }
        ///
        /// Supported field types: FullName, FirstName, LastName, Email,
        /// PhoneNumber, Address, City, Country, ZipCode, Company, JobTitle,
        /// Username, Password, Url, Guid, Integer, Decimal, Boolean, Date,
        /// Paragraph, Sentence, Word, AutoIncrement
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(List<Dictionary<string, object>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status200OK)] // For files
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Generate([FromBody] GenerateRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (request.Fields == null || request.Fields.Count == 0)
                return BadRequest(new { message = "At least one field must be specified." });

            var data = _generateService.Generate(request);

            if (request.FormatType.ToLowerInvariant() == "csv")
            {
                var content = (string)data;
                var bytes = System.Text.Encoding.UTF8.GetBytes(content);
                return File(bytes, "text/csv", $"mock-data-{DateTime.UtcNow:yyyyMMddHHmmss}.csv");
            }

            if (request.FormatType.ToLowerInvariant() == "sql")
            {
                var content = (string)data;
                var bytes = System.Text.Encoding.UTF8.GetBytes(content);
                return File(bytes, "application/sql", $"mock-data-{DateTime.UtcNow:yyyyMMddHHmmss}.sql");
            }

            return Ok(data);
        }
    }
}

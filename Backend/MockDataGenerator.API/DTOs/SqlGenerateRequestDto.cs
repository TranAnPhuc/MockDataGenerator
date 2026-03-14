using System.ComponentModel.DataAnnotations;

namespace MockDataGenerator.API.DTOs
{
    public class SqlGenerateRequestDto
    {
        [Required]
        public string SqlScript { get; set; } = string.Empty;

        public int RowCount { get; set; } = 10;

        public string FormatType { get; set; } = "sql";

        public string DbDialect { get; set; } = "sqlserver";

        public string? GenerationLocale { get; set; } = "en";
    }
}

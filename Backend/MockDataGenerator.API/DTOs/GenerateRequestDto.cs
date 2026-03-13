using System.ComponentModel.DataAnnotations;

namespace MockDataGenerator.API.DTOs
{
    /// <summary>
    /// Request payload for POST /api/generate.
    /// Matches the frontend GenerateRequest type.
    /// </summary>
    public class GenerateRequestDto
    {
        /// <summary>
        /// List of field configurations (columnName + dataType).
        /// Supported dataType values: Name, Email, Phone, Address, Date,
        /// FullName, FirstName, LastName, PhoneNumber, City, Country,
        /// ZipCode, Company, JobTitle, Username, Password, Url, Guid,
        /// Integer, Decimal, Boolean, Paragraph, Sentence, Word, AutoIncrement
        /// </summary>
        [Required]
        public List<FieldConfigDto> Fields { get; set; } = new();

        /// <summary>
        /// Number of rows to generate (1 – 10000). Mapped from frontend's "rowCount".
        /// </summary>
        [Range(1, 10000)]
        public int RowCount { get; set; } = 10;
        
        /// <summary>
        /// Export format: json, csv, sql. Default is json.
        /// </summary>
        public string FormatType { get; set; } = "json";
    }
}


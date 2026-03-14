namespace MockDataGenerator.API.DTOs
{
    /// <summary>
    /// Represents a single field configuration sent from the frontend.
    /// </summary>
    public class FieldConfigDto
    {
        /// <summary>
        /// The display name / column name (e.g. "Họ tên", "Email")
        /// </summary>
        public string ColumnName { get; set; } = string.Empty;

        /// <summary>
        /// The data type to use for generation (e.g. "Name", "Email", "Phone", "Address", "Date", "Custom Regex")
        /// </summary>
        public string DataType { get; set; } = string.Empty;

        /// <summary>
        /// Optional regex pattern for "Custom Regex" type.
        /// </summary>
        public string? RegexPattern { get; set; }

        /// <summary>
        /// Optional comma-separated list of values for "Custom List" type.
        /// </summary>
        public string? CustomListOptions { get; set; }
    }
}

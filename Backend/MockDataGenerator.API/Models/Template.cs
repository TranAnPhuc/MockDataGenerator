namespace MockDataGenerator.API.Models
{
    public class Template
    {
        public int Id { get; set; }
        public string TemplateName { get; set; } = string.Empty;

        /// <summary>
        /// JSON string describing the column configuration, e.g.:
        /// [{"columnName":"FullName","dataType":"string","generator":"fullName"}, ...]
        /// </summary>
        public string SchemaConfig { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}

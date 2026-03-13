namespace MockDataGenerator.API.DTOs
{
    public class TemplateDto
    {
        public int Id { get; set; }
        public string TemplateName { get; set; } = string.Empty;
        public string SchemaConfig { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }
}

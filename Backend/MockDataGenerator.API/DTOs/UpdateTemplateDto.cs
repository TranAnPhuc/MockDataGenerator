using System.ComponentModel.DataAnnotations;

namespace MockDataGenerator.API.DTOs
{
    public class UpdateTemplateDto
    {
        [Required]
        [MaxLength(255)]
        public string TemplateName { get; set; } = string.Empty;

        [Required]
        public string SchemaConfig { get; set; } = string.Empty;
    }
}

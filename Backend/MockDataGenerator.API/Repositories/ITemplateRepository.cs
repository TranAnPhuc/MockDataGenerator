using MockDataGenerator.API.Models;

namespace MockDataGenerator.API.Repositories
{
    public interface ITemplateRepository
    {
        Task<IEnumerable<Template>> GetAllAsync();
        Task<Template?> GetByIdAsync(int id);
        Task<Template> CreateAsync(string templateName, string schemaConfig);
        Task<bool> UpdateAsync(int id, string templateName, string schemaConfig);
        Task<bool> DeleteAsync(int id);
    }
}

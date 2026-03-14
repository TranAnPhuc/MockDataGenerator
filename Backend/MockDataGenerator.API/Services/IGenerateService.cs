using MockDataGenerator.API.DTOs;

namespace MockDataGenerator.API.Services
{
    public interface IGenerateService
    {
        object Generate(GenerateRequestDto request);
        object GenerateFromSql(SqlGenerateRequestDto request);
    }
}

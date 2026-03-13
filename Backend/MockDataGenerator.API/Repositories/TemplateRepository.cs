using Dapper;
using MockDataGenerator.API.Data;
using MockDataGenerator.API.Models;

namespace MockDataGenerator.API.Repositories
{
    public class TemplateRepository : ITemplateRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public TemplateRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<Template>> GetAllAsync()
        {
            const string sql = @"
                SELECT Id, TemplateName, SchemaConfig, CreatedDate
                FROM Templates
                ORDER BY CreatedDate DESC";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Template>(sql);
        }

        public async Task<Template?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT Id, TemplateName, SchemaConfig, CreatedDate
                FROM Templates
                WHERE Id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Template>(sql, new { Id = id });
        }

        public async Task<Template> CreateAsync(string templateName, string schemaConfig)
        {
            const string sql = @"
                INSERT INTO Templates (TemplateName, SchemaConfig, CreatedDate)
                OUTPUT INSERTED.Id, INSERTED.TemplateName, INSERTED.SchemaConfig, INSERTED.CreatedDate
                VALUES (@TemplateName, @SchemaConfig, GETUTCDATE())";

            using var connection = _connectionFactory.CreateConnection();
            var created = await connection.QuerySingleAsync<Template>(sql, new
            {
                TemplateName = templateName,
                SchemaConfig = schemaConfig
            });

            return created;
        }

        public async Task<bool> UpdateAsync(int id, string templateName, string schemaConfig)
        {
            const string sql = @"
                UPDATE Templates
                SET TemplateName = @TemplateName,
                    SchemaConfig = @SchemaConfig
                WHERE Id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            int rowsAffected = await connection.ExecuteAsync(sql, new
            {
                Id = id,
                TemplateName = templateName,
                SchemaConfig = schemaConfig
            });

            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = "DELETE FROM Templates WHERE Id = @Id";

            using var connection = _connectionFactory.CreateConnection();
            int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }
    }
}

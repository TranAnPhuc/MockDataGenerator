using Microsoft.Data.SqlClient;

namespace MockDataGenerator.API.Data
{
    public class SqlConnectionFactory
    {
        private readonly string _connectionString;

        public SqlConnectionFactory(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public SqlConnection CreateConnection() => new SqlConnection(_connectionString);
    }
}

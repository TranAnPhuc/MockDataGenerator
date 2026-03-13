using Bogus;
using MockDataGenerator.API.DTOs;

namespace MockDataGenerator.API.Services
{
    public class GenerateService : IGenerateService
    {
        public object Generate(GenerateRequestDto request)
        {
            var faker = new Faker("en");
            var result = new List<Dictionary<string, object>>(request.RowCount);

            for (int i = 0; i < request.RowCount; i++)
            {
                var row = new Dictionary<string, object>();

                foreach (var field in request.Fields)
                {
                    var key = string.IsNullOrWhiteSpace(field.ColumnName)
                        ? field.DataType
                        : field.ColumnName;

                    row[key] = ResolveField(faker, field, i + 1);
                }

                result.Add(row);
            }

            return request.FormatType.ToLowerInvariant() switch
            {
                "csv" => ExportToCsv(result, request.Fields),
                "sql" => ExportToSql(result, request.Fields, "GeneratedData"),
                _ => result
            };
        }

        private static object ResolveField(Faker faker, FieldConfigDto field, int index)
        {
            var fieldType = field.DataType.Trim().ToLowerInvariant();

            if (fieldType == "custom regex" || fieldType == "regex")
            {
                return string.IsNullOrEmpty(field.RegexPattern) 
                    ? "PATTERN_MISSING" 
                    : faker.Random.Replace(field.RegexPattern);
            }

            return fieldType switch
            {
                "name"          => faker.Name.FullName(),
                "phone"         => faker.Phone.PhoneNumber(),
                "fullname"      => faker.Name.FullName(),
                "firstname"     => faker.Name.FirstName(),
                "lastname"      => faker.Name.LastName(),
                "email"         => faker.Internet.Email(),
                "phonenumber"   => faker.Phone.PhoneNumber(),
                "address"       => faker.Address.StreetAddress(),
                "city"          => faker.Address.City(),
                "country"       => faker.Address.Country(),
                "zipcode"       => faker.Address.ZipCode(),
                "company"       => faker.Company.CompanyName(),
                "jobtitle"      => faker.Name.JobTitle(),
                "username"      => faker.Internet.UserName(),
                "password"      => faker.Internet.Password(12),
                "url"           => faker.Internet.Url(),
                "guid"          => Guid.NewGuid().ToString(),
                "integer"       => faker.Random.Int(1, 1_000_000),
                "decimal"       => Math.Round(faker.Random.Decimal(0, 100_000), 2),
                "boolean"       => faker.Random.Bool(),
                "date"          => faker.Date.Past(10).ToString("yyyy-MM-dd"),
                "paragraph"     => faker.Lorem.Paragraph(),
                "sentence"      => faker.Lorem.Sentence(),
                "word"          => faker.Lorem.Word(),
                "autoincrement" => index,
                _               => faker.Lorem.Word()
            };
        }

        private string ExportToCsv(List<Dictionary<string, object>> data, List<FieldConfigDto> fields)
        {
            var sb = new System.Text.StringBuilder();
            var headers = fields.Select(f => f.ColumnName).ToList();
            sb.AppendLine(string.Join(",", headers));

            foreach (var row in data)
            {
                var values = headers.Select(h => {
                    var val = row[h]?.ToString() ?? "";
                    if (val.Contains(",") || val.Contains("\"") || val.Contains("\n"))
                        val = $"\"{val.Replace("\"", "\"\"")}\"";
                    return val;
                });
                sb.AppendLine(string.Join(",", values));
            }
            return sb.ToString();
        }

        private string ExportToSql(List<Dictionary<string, object>> data, List<FieldConfigDto> fields, string tableName)
        {
            var sb = new System.Text.StringBuilder();
            var headers = fields.Select(f => f.ColumnName).ToList();
            var columns = string.Join(", ", headers.Select(h => $"[{h}]"));

            foreach (var row in data)
            {
                var values = headers.Select(h => {
                    var val = row[h];
                    if (val == null) return "NULL";
                    if (val is string s) return $"N'{s.Replace("'", "''")}'";
                    if (val is bool b) return b ? "1" : "0";
                    if (val is DateTime dt) return $"'{dt:yyyy-MM-dd HH:mm:ss}'";
                    return val.ToString();
                });
                sb.AppendLine($"INSERT INTO [{tableName}] ({columns}) VALUES ({string.Join(", ", values)});");
            }
            return sb.ToString();
        }
    }
}

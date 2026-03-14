using Bogus;
using MockDataGenerator.API.DTOs;

namespace MockDataGenerator.API.Services
{
    public class GenerateService : IGenerateService
    {
        public object Generate(GenerateRequestDto request)
        {
            if (request == null) return new List<Dictionary<string, object>>();
            
            var locale = string.IsNullOrWhiteSpace(request.GenerationLocale) ? "en" : request.GenerationLocale;
            var faker = new Faker(locale);
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
                "sql" => ExportToSql(result, request.Fields, "GeneratedData", request.DbDialect),
                _ => result
            };
        }

        public object GenerateFromSql(SqlGenerateRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.SqlScript))
                return new List<Dictionary<string, object>>();

            // 1. Simple Regex mapping for CREATE TABLE
            var fields = ParseSqlCreateTable(request.SqlScript);
            if (fields.Count == 0) return new { message = "Could not parse any columns from SQL script." };

            var generateRequest = new GenerateRequestDto
            {
                Fields = fields,
                RowCount = request.RowCount,
                FormatType = request.FormatType,
                GenerationLocale = request.GenerationLocale,
                DbDialect = request.DbDialect
            };

            return Generate(generateRequest);
        }

        private List<FieldConfigDto> ParseSqlCreateTable(string sql)
        {
            var fields = new List<FieldConfigDto>();
            
            // Regex to find content inside CREATE TABLE (...)
            var tableMatch = System.Text.RegularExpressions.Regex.Match(sql, @"CREATE\s+TABLE\s+(\w+)\s*\(", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);
            
            var tableName = tableMatch.Success ? tableMatch.Groups[1].Value.Trim('[', ']', '\"', ' ') : "GeneratedData";

            var contentMatch = System.Text.RegularExpressions.Regex.Match(sql, @"CREATE\s+TABLE\s+\w+\s*\((.*)\)", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);

            if (!contentMatch.Success) return fields;

            var groupValue = contentMatch.Groups[1].Value;
            if (string.IsNullOrWhiteSpace(groupValue)) return fields;

            var columnDefinitions = groupValue.Split(',', StringSplitOptions.RemoveEmptyEntries);

            foreach (var colDef in columnDefinitions)
            {
                var parts = colDef.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length < 2) continue;

                var columnName = parts[0].Trim('[', ']', '\"', ' ');
                var dataType = parts[1].Trim().ToUpperInvariant();

                fields.Add(new FieldConfigDto
                {
                    ColumnName = columnName,
                    DataType = MapSqlTypeToBogus(columnName, dataType, tableName)
                });
            }

            return fields;
        }

        private string MapSqlTypeToBogus(string columnName, string sqlType, string tableName = "")
        {
            var nameLower = columnName.ToLowerInvariant();
            var tableLower = tableName.ToLowerInvariant();
            
            // Heuristics based on column name and table context
            if (nameLower.Contains("name") || nameLower.Contains("fullname")) return "FullName";
            if (nameLower.Contains("email")) return "Email";
            if (nameLower.Contains("phone") || nameLower.Contains("tel")) return "Phone";
            if (nameLower.Contains("address")) return "Address";
            if (nameLower.Contains("id") && (sqlType.Contains("INT") || sqlType.Contains("GUID"))) return sqlType.Contains("GUID") ? "Guid" : "AutoIncrement";
            if (nameLower.Contains("city")) return "City";
            if (nameLower.Contains("country")) return "Country";
            if (nameLower.Contains("zip") || nameLower.Contains("postal")) return "ZipCode";
            if (nameLower.Contains("date") || nameLower.Contains("time") || nameLower.Contains("at")) return "DateTime";
            if (nameLower.Contains("price") || nameLower.Contains("amount") || nameLower.Contains("cost")) return "Decimal";
            if (nameLower.Contains("active") || nameLower.Contains("is")) return "Boolean";

            // Specialized inference
            if (nameLower.Contains("status") || nameLower.Contains("state")) return "Status";
            if (nameLower.Contains("position") || nameLower.Contains("rank") || nameLower.Contains("role") || nameLower.Contains("title")) 
            {
                if (tableLower.Contains("staff") || tableLower.Contains("employee") || tableLower.Contains("user")) return "JobTitle";
                return "Word";
            }

            // Fallback by SQL type
            if (sqlType.Contains("INT")) return "Integer";
            if (sqlType.Contains("DECIMAL") || sqlType.Contains("MONEY") || sqlType.Contains("FLOAT") || sqlType.Contains("NUMERIC")) return "Decimal";
            if (sqlType.Contains("DATE") || sqlType.Contains("TIME")) return "DateTime";
            if (sqlType.Contains("BIT") || sqlType.Contains("BOOL")) return "Boolean";
            if (sqlType.Contains("UNIQUEIDENTIFIER")) return "Guid";
            
            return "Word"; // Default
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

            if (fieldType == "custom list" || fieldType == "customlist" || fieldType == "list")
            {
                if (string.IsNullOrWhiteSpace(field.CustomListOptions))
                    return "LIST_OPTIONS_MISSING";

                var options = field.CustomListOptions.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(o => o.Trim()).ToList();
                
                return options.Count > 0 ? faker.PickRandom(options) : "EMPTY_LIST";
            }

            return fieldType switch
            {
                // Identity & Basic
                "name"          => faker.Name.FullName(),
                "fullname"      => faker.Name.FullName(),
                "firstname"     => faker.Name.FirstName(),
                "lastname"      => faker.Name.LastName(),
                "username"      => faker.Internet.UserName(),
                "password"      => faker.Internet.Password(12),
                "guid"          => Guid.NewGuid().ToString(),
                "autoincrement" => index,
                "status"        => faker.PickRandom("Active", "Inactive", "Pending", "Archived", "Deleted"),

                // Contact
                "email"         => faker.Internet.Email(),
                "phone"         => faker.Phone.PhoneNumber(),
                "phonenumber"   => faker.Phone.PhoneNumber(),
                "url"           => faker.Internet.Url(),

                // Location
                "address"       => faker.Address.StreetAddress(),
                "city"          => faker.Address.City(),
                "country"       => faker.Address.Country(),
                "zipcode"       => faker.Address.ZipCode(),
                "latitude"      => faker.Address.Latitude(),
                "longitude"     => faker.Address.Longitude(),

                // Business & Job
                "company"       => faker.Company.CompanyName(),
                "jobtitle"      => faker.Name.JobTitle(),
                "department"    => faker.Commerce.Department(),
                "jobarea"       => faker.Name.JobArea(),

                // Commerce & Products
                "productname"   => faker.Commerce.ProductName(),
                "product"       => faker.Commerce.ProductName(),
                "price"         => faker.Commerce.Price(),
                "color"         => faker.Commerce.Color(),
                "hexcolor"      => faker.Internet.Color(),
                "department_commerce" => faker.Commerce.Department(),

                // Finance
                "creditcard"    => faker.Finance.CreditCardNumber(),
                "iban"          => faker.Finance.Iban(),
                "bitcoin"       => faker.Finance.BitcoinAddress(),

                // System & Tech
                "ipv4"          => faker.Internet.Ip(),
                "ipv6"          => faker.Internet.Ipv6(),
                "macaddress"    => faker.Internet.Mac(),
                "avatar"        => faker.Internet.Avatar(),
                "fileextension" => faker.System.FileExt(),
                "mimetype"      => faker.System.MimeType(),

                // Data Types
                "integer"       => faker.Random.Int(1, 1_000_000),
                "decimal"       => Math.Round(faker.Random.Decimal(0, 100_000), 2),
                "boolean"       => faker.Random.Bool(),
                "date"          => faker.Date.Past(10).ToString("yyyy-MM-dd"),
                "datetime"      => faker.Date.Past(1).ToString("yyyy-MM-dd HH:mm:ss"),

                // Text
                "paragraph"     => faker.Lorem.Paragraph(),
                "sentence"      => faker.Lorem.Sentence(),
                "word"          => faker.Lorem.Word(),
                "words"         => string.Join(" ", faker.Lorem.Words(3)),
                
                _               => faker.Lorem.Word()
            };
        }

        private static string ExportToCsv(List<Dictionary<string, object>> data, List<FieldConfigDto> fields)
        {
            var sb = new System.Text.StringBuilder();
            var headers = fields.Select(f => f.ColumnName).ToList();
            sb.AppendLine(string.Join(",", headers));

            foreach (var row in data)
            {
                var values = headers.Select(h => {
                    var val = row[h]?.ToString() ?? "";
                    if (val.Contains(',') || val.Contains('\"') || val.Contains('\n'))
                        val = $"\"{val.Replace("\"", "\"\"")}\"";
                    return val;
                });
                sb.AppendLine(string.Join(",", values));
            }
            return sb.ToString();
        }

        private static string ExportToSql(List<Dictionary<string, object>> data, List<FieldConfigDto> fields, string tableName, string dialect)
        {
            var sb = new System.Text.StringBuilder();
            var headers = fields.Select(f => f.ColumnName).ToList();
            
            var dialectLower = dialect?.ToLowerInvariant() ?? "sqlserver";
            
            // Quoting characters
            string qOpen = "[", qClose = "]";
            if (dialectLower == "mysql" || dialectLower == "mariadb") { qOpen = "`"; qClose = "`"; }
            else if (dialectLower == "postgresql") { qOpen = "\""; qClose = "\""; }

            var columns = string.Join(", ", headers.Select(h => $"{qOpen}{h}{qClose}"));

            foreach (var row in data)
            {
                var values = headers.Select(h => {
                    var val = row[h];
                    if (val == null) return "NULL";
                    
                    if (val is string s) {
                        var escaped = s.Replace("'", "''");
                        return dialectLower == "sqlserver" ? $"N'{escaped}'" : $"'{escaped}'";
                    }
                    
                    if (val is bool b) {
                        if (dialectLower == "postgresql") return b ? "true" : "false";
                        return b ? "1" : "0";
                    }
                    
                    if (val is DateTime dt) return $"'{dt:yyyy-MM-dd HH:mm:ss}'";
                    
                    return val.ToString();
                });
                
                sb.AppendLine($"INSERT INTO {qOpen}{tableName}{qClose} ({columns}) VALUES ({string.Join(", ", values)});");
            }
            return sb.ToString();
        }
    }
}

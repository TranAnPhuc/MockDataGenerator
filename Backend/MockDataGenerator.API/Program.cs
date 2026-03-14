using MockDataGenerator.API.Data;
using MockDataGenerator.API.Repositories;
using MockDataGenerator.API.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ───────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ── Swagger ───────────────────────────────────────────────────────────────────
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title   = "Mock Data Generator API",
        Version = "v1",
        Description = "API to manage Templates and generate mock data with Bogus"
    });
    // Include XML comments for endpoint docs
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath);
});

// ── Database (Dapper) ─────────────────────────────────────────────────────────
builder.Services.AddSingleton<SqlConnectionFactory>();

// ── Repositories & Services ───────────────────────────────────────────────────
builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();
builder.Services.AddScoped<IGenerateService, GenerateService>();

// ── CORS — allow React dev server ─────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// ── Middleware pipeline ───────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Mock Data Generator API v1"));
}

app.UseCors("AllowFrontend");
app.UseAuthorization();

// ── Root redirect ────────────────────────────────────────────────────────────
app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapControllers();

app.Run();

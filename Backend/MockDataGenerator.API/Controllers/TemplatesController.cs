using Microsoft.AspNetCore.Mvc;
using MockDataGenerator.API.Models;
using MockDataGenerator.API.Repositories;

namespace MockDataGenerator.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplatesController : ControllerBase
    {
        private readonly ITemplateRepository _repository;

        public TemplatesController(ITemplateRepository repository)
        {
            _repository = repository;
        }

        // GET /api/templates
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var templates = await _repository.GetAllAsync();
            var dtos = templates.Select(MapToDto);
            return Ok(dtos);
        }

        // GET /api/templates/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var template = await _repository.GetByIdAsync(id);
            if (template is null)
                return NotFound(new { message = $"Template with id {id} not found." });

            return Ok(MapToDto(template));
        }

        // POST /api/templates
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MockDataGenerator.API.DTOs.CreateTemplateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _repository.CreateAsync(dto.TemplateName, dto.SchemaConfig);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
        }

        // PUT /api/templates/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] MockDataGenerator.API.DTOs.UpdateTemplateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _repository.UpdateAsync(id, dto.TemplateName, dto.SchemaConfig);
            if (!updated)
                return NotFound(new { message = $"Template with id {id} not found." });

            var template = await _repository.GetByIdAsync(id);
            return Ok(MapToDto(template!));
        }

        // DELETE /api/templates/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Template with id {id} not found." });

            return NoContent();
        }

        private static MockDataGenerator.API.DTOs.TemplateDto MapToDto(Template t) => new()
        {
            Id          = t.Id,
            TemplateName = t.TemplateName,
            SchemaConfig = t.SchemaConfig,
            CreatedDate  = t.CreatedDate
        };
    }
}

using DueQ.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace DueQ.Api.Controllers;

[ApiController]
[Route("api/_test")]
public class TestSupportController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly DueQContext _context;

    public TestSupportController(IWebHostEnvironment environment, DueQContext context)
    {
        _environment = environment;
        _context = context;
    }

    [HttpPost("reset")]
    public async Task<IActionResult> Reset(CancellationToken cancellationToken)
    {
        if (!_environment.IsDevelopment())
        {
            return NotFound();
        }

        await DueQContextSeeder.ResetAndSeedAsync(_context, cancellationToken);
        return NoContent();
    }
}

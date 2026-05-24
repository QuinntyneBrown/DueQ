using DueQ.Application.Dashboard.Dtos;
using DueQ.Application.Dashboard.Queries.GetDashboard;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DueQ.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> Get(
        [FromQuery] DateOnly? today,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new GetDashboardQuery(today), cancellationToken));
}

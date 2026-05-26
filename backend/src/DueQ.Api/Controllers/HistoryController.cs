using DueQ.Application.History.Dtos;
using DueQ.Application.History.Queries.GetHistory;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DueQ.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HistoryController : ControllerBase
{
    private readonly IMediator _mediator;

    public HistoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<HistoryDto>> Get(CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new GetHistoryQuery(), cancellationToken));
}

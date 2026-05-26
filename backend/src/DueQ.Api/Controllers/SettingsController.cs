using DueQ.Application.Settings.Commands.UpdateSettings;
using DueQ.Application.Settings.Dtos;
using DueQ.Application.Settings.Queries.GetSettings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DueQ.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SettingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<SettingsDto>> Get(CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new GetSettingsQuery(), cancellationToken));

    [HttpPut]
    public async Task<ActionResult<SettingsDto>> Update(
        [FromBody] UpdateSettingsCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));
}

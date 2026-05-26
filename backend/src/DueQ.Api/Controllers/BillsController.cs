using DueQ.Api.Contracts;
using DueQ.Application.Bills.Commands.CreateBill;
using DueQ.Application.Bills.Commands.DeleteBill;
using DueQ.Application.Bills.Commands.SettleBill;
using DueQ.Application.Bills.Commands.UpdateBill;
using DueQ.Application.Bills.Dtos;
using DueQ.Application.Bills.Queries.GetBill;
using DueQ.Application.Bills.Queries.ListBills;
using DueQ.Domain.Bills;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DueQ.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BillsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BillsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BillDto>>> List(
        [FromQuery] BillStatus? status,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new ListBillsQuery(status, from, to), cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BillDto>> Get(Guid id, CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new GetBillQuery(id), cancellationToken));

    [HttpPost]
    public async Task<ActionResult<BillDto>> Create(
        [FromBody] CreateBillCommand command,
        CancellationToken cancellationToken)
    {
        var bill = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = bill.Id }, bill);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BillDto>> Update(
        Guid id,
        [FromBody] UpdateBillRequest body,
        CancellationToken cancellationToken)
    {
        var command = new UpdateBillCommand(id, body.Description, body.Amount, body.Date, body.Note);
        return Ok(await _mediator.Send(command, cancellationToken));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteBillCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/settle")]
    public async Task<ActionResult<BillDto>> Settle(Guid id, CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new SettleBillCommand(id, true), cancellationToken));

    [HttpPost("{id:guid}/unsettle")]
    public async Task<ActionResult<BillDto>> Unsettle(Guid id, CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new SettleBillCommand(id, false), cancellationToken));
}

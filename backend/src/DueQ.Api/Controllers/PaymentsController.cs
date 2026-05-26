using DueQ.Application.Payments.Commands.CreatePayment;
using DueQ.Application.Payments.Commands.DeletePayment;
using DueQ.Application.Payments.Dtos;
using DueQ.Application.Payments.Queries.ListPayments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DueQ.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PaymentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PaymentDto>>> List(
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new ListPaymentsQuery(from, to), cancellationToken));

    [HttpPost]
    public async Task<ActionResult<PaymentDto>> Create(
        [FromBody] CreatePaymentCommand command,
        CancellationToken cancellationToken)
    {
        var payment = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(List), null, payment);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeletePaymentCommand(id), cancellationToken);
        return NoContent();
    }
}

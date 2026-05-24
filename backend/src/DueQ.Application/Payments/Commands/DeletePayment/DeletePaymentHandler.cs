using DueQ.Application.Abstractions;
using DueQ.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Payments.Commands.DeletePayment;

public class DeletePaymentHandler : IRequestHandler<DeletePaymentCommand>
{
    private readonly IDueQContext _context;

    public DeletePaymentHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task Handle(DeletePaymentCommand request, CancellationToken cancellationToken)
    {
        var payment = await _context.Payments.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (payment is null)
        {
            throw new NotFoundException(nameof(Domain.Payments.Payment), request.Id);
        }

        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

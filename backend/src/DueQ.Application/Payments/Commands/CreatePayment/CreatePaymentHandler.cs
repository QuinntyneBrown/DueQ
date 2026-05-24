using DueQ.Application.Abstractions;
using DueQ.Application.Payments.Dtos;
using DueQ.Domain.Payments;
using MediatR;

namespace DueQ.Application.Payments.Commands.CreatePayment;

public class CreatePaymentHandler : IRequestHandler<CreatePaymentCommand, PaymentDto>
{
    private readonly IDueQContext _context;

    public CreatePaymentHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<PaymentDto> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
    {
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            Amount = decimal.Round(request.Amount, 2),
            Date = request.Date,
            Method = request.Method,
            Note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync(cancellationToken);

        return new PaymentDto
        {
            Id = payment.Id,
            Amount = payment.Amount,
            Date = payment.Date,
            Method = payment.Method,
            Note = payment.Note,
            CreatedAt = payment.CreatedAt
        };
    }
}

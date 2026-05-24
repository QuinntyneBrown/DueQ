using DueQ.Application.Abstractions;
using DueQ.Application.Payments.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Payments.Queries.ListPayments;

public class ListPaymentsHandler : IRequestHandler<ListPaymentsQuery, IReadOnlyList<PaymentDto>>
{
    private readonly IDueQContext _context;

    public ListPaymentsHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<PaymentDto>> Handle(ListPaymentsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Payments.AsNoTracking().AsQueryable();

        if (request.From is not null)
        {
            query = query.Where(p => p.Date >= request.From);
        }

        if (request.To is not null)
        {
            query = query.Where(p => p.Date <= request.To);
        }

        return await query
            .OrderByDescending(p => p.Date)
            .ThenByDescending(p => p.CreatedAt)
            .Select(p => new PaymentDto
            {
                Id = p.Id,
                Amount = p.Amount,
                Date = p.Date,
                Method = p.Method,
                Note = p.Note,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

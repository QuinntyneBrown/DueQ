using DueQ.Application.Abstractions;
using DueQ.Application.Bills.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Bills.Queries.ListBills;

public class ListBillsHandler : IRequestHandler<ListBillsQuery, IReadOnlyList<BillDto>>
{
    private readonly IDueQContext _context;

    public ListBillsHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<BillDto>> Handle(ListBillsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bills.AsNoTracking().AsQueryable();

        if (request.Status is not null)
        {
            query = query.Where(b => b.Status == request.Status);
        }

        if (request.From is not null)
        {
            query = query.Where(b => b.Date >= request.From);
        }

        if (request.To is not null)
        {
            query = query.Where(b => b.Date <= request.To);
        }

        var bills = await query
            .OrderByDescending(b => b.Date)
            .ThenByDescending(b => b.CreatedAt)
            .Select(b => new BillDto
            {
                Id = b.Id,
                Description = b.Description,
                Amount = b.Amount,
                PartnerShare = b.Amount / 2m,
                Date = b.Date,
                Note = b.Note,
                Status = b.Status,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return bills;
    }
}

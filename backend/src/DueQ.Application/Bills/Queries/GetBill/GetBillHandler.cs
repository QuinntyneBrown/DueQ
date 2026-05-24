using DueQ.Application.Abstractions;
using DueQ.Application.Bills.Dtos;
using DueQ.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Bills.Queries.GetBill;

public class GetBillHandler : IRequestHandler<GetBillQuery, BillDto>
{
    private readonly IDueQContext _context;

    public GetBillHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<BillDto> Handle(GetBillQuery request, CancellationToken cancellationToken)
    {
        var bill = await _context.Bills
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (bill is null)
        {
            throw new NotFoundException(nameof(Domain.Bills.Bill), request.Id);
        }

        return new BillDto
        {
            Id = bill.Id,
            Description = bill.Description,
            Amount = bill.Amount,
            PartnerShare = bill.Amount / 2m,
            Date = bill.Date,
            Note = bill.Note,
            Status = bill.Status,
            CreatedAt = bill.CreatedAt
        };
    }
}

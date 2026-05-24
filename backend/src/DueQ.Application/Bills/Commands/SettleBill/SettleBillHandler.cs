using DueQ.Application.Abstractions;
using DueQ.Application.Bills.Dtos;
using DueQ.Application.Common.Exceptions;
using DueQ.Domain.Bills;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Bills.Commands.SettleBill;

public class SettleBillHandler : IRequestHandler<SettleBillCommand, BillDto>
{
    private readonly IDueQContext _context;

    public SettleBillHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<BillDto> Handle(SettleBillCommand request, CancellationToken cancellationToken)
    {
        var bill = await _context.Bills.FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (bill is null)
        {
            throw new NotFoundException(nameof(Domain.Bills.Bill), request.Id);
        }

        bill.Status = request.Settled ? BillStatus.Settled : BillStatus.Unsettled;
        await _context.SaveChangesAsync(cancellationToken);

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

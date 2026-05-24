using DueQ.Application.Abstractions;
using DueQ.Application.Bills.Dtos;
using DueQ.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Bills.Commands.UpdateBill;

public class UpdateBillHandler : IRequestHandler<UpdateBillCommand, BillDto>
{
    private readonly IDueQContext _context;

    public UpdateBillHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<BillDto> Handle(UpdateBillCommand request, CancellationToken cancellationToken)
    {
        var bill = await _context.Bills.FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (bill is null)
        {
            throw new NotFoundException(nameof(Domain.Bills.Bill), request.Id);
        }

        bill.Description = request.Description.Trim();
        bill.Amount = decimal.Round(request.Amount, 2);
        bill.Date = request.Date;
        bill.Note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();

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

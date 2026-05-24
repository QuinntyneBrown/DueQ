using DueQ.Application.Abstractions;
using DueQ.Application.Bills.Dtos;
using DueQ.Domain.Bills;
using MediatR;

namespace DueQ.Application.Bills.Commands.CreateBill;

public class CreateBillHandler : IRequestHandler<CreateBillCommand, BillDto>
{
    private readonly IDueQContext _context;

    public CreateBillHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<BillDto> Handle(CreateBillCommand request, CancellationToken cancellationToken)
    {
        var bill = new Bill
        {
            Id = Guid.NewGuid(),
            Description = request.Description.Trim(),
            Amount = decimal.Round(request.Amount, 2),
            Date = request.Date,
            Note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim(),
            Status = BillStatus.Unsettled,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bills.Add(bill);
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

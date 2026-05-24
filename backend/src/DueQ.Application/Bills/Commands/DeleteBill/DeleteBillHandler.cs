using DueQ.Application.Abstractions;
using DueQ.Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Bills.Commands.DeleteBill;

public class DeleteBillHandler : IRequestHandler<DeleteBillCommand>
{
    private readonly IDueQContext _context;

    public DeleteBillHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteBillCommand request, CancellationToken cancellationToken)
    {
        var bill = await _context.Bills.FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (bill is null)
        {
            throw new NotFoundException(nameof(Domain.Bills.Bill), request.Id);
        }

        _context.Bills.Remove(bill);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

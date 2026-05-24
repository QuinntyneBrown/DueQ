using DueQ.Application.Bills.Commands.SettleBill;
using DueQ.Application.Common.Exceptions;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Bills;

namespace DueQ.Application.Tests.Bills;

public class SettleBillHandlerTests
{
    [Fact]
    public async Task Toggles_status_to_settled()
    {
        using var context = DueQContextFactory.Create();
        var bill = new Bill
        {
            Id = Guid.NewGuid(),
            Description = "Internet",
            Amount = 94.00m,
            Date = new DateOnly(2026, 5, 8),
            Status = BillStatus.Unsettled,
            CreatedAt = DateTime.UtcNow
        };
        context.Bills.Add(bill);
        await context.SaveChangesAsync();

        var handler = new SettleBillHandler(context);
        var dto = await handler.Handle(new SettleBillCommand(bill.Id, true), CancellationToken.None);

        Assert.Equal(BillStatus.Settled, dto.Status);
    }

    [Fact]
    public async Task Throws_NotFoundException_when_id_unknown()
    {
        using var context = DueQContextFactory.Create();
        var handler = new SettleBillHandler(context);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new SettleBillCommand(Guid.NewGuid(), true), CancellationToken.None));
    }
}

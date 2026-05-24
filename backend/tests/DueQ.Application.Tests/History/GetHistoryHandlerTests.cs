using DueQ.Application.History.Queries.GetHistory;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Bills;
using DueQ.Domain.Payments;

namespace DueQ.Application.Tests.History;

public class GetHistoryHandlerTests
{
    [Fact]
    public async Task Groups_by_month_and_accumulates_running_balance()
    {
        using var context = DueQContextFactory.Create();
        context.Bills.Add(new Bill
        {
            Id = Guid.NewGuid(),
            Description = "April bill",
            Amount = 100m,
            Date = new DateOnly(2026, 4, 15),
            Status = BillStatus.Settled,
            CreatedAt = DateTime.UtcNow
        });
        context.Payments.Add(new Payment
        {
            Id = Guid.NewGuid(),
            Amount = 30m,
            Date = new DateOnly(2026, 4, 20),
            Method = PaymentMethod.ETransfer,
            CreatedAt = DateTime.UtcNow
        });
        context.Bills.Add(new Bill
        {
            Id = Guid.NewGuid(),
            Description = "May bill",
            Amount = 200m,
            Date = new DateOnly(2026, 5, 10),
            Status = BillStatus.Unsettled,
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new GetHistoryHandler(context);
        var dto = await handler.Handle(new GetHistoryQuery(), CancellationToken.None);

        Assert.Equal(120m, dto.RunningBalance);
        Assert.Equal(150m, dto.TotalLogged);
        Assert.Equal(30m, dto.TotalReceived);

        Assert.Equal(2, dto.Months.Count);

        var may = dto.Months[0];
        Assert.Equal(2026, may.Year);
        Assert.Equal(5, may.Month);
        Assert.Equal(100m, may.MonthDelta);
        Assert.Equal(120m, may.Entries[0].RunningBalance);

        var april = dto.Months[1];
        Assert.Equal(4, april.Month);
        Assert.Equal(20m, april.MonthDelta);
    }
}

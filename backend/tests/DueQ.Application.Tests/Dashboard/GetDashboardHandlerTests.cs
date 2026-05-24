using DueQ.Application.Dashboard.Dtos;
using DueQ.Application.Dashboard.Queries.GetDashboard;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Bills;
using DueQ.Domain.Households;
using DueQ.Domain.Payments;

namespace DueQ.Application.Tests.Dashboard;

public class GetDashboardHandlerTests
{
    [Fact]
    public async Task Computes_balance_as_half_of_bills_minus_payments()
    {
        using var context = DueQContextFactory.Create();
        context.Households.Add(new Household { Id = Guid.NewGuid(), YourName = "You", PartnerName = "Sam" });
        context.Bills.Add(new Bill
        {
            Id = Guid.NewGuid(),
            Description = "Groceries",
            Amount = 100m,
            Date = new DateOnly(2026, 5, 20),
            Status = BillStatus.Unsettled,
            CreatedAt = DateTime.UtcNow
        });
        context.Bills.Add(new Bill
        {
            Id = Guid.NewGuid(),
            Description = "Hydro",
            Amount = 200m,
            Date = new DateOnly(2026, 5, 1),
            Status = BillStatus.Unsettled,
            CreatedAt = DateTime.UtcNow
        });
        context.Payments.Add(new Payment
        {
            Id = Guid.NewGuid(),
            Amount = 50m,
            Date = new DateOnly(2026, 5, 12),
            Method = PaymentMethod.ETransfer,
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new GetDashboardHandler(context);
        var dto = await handler.Handle(new GetDashboardQuery(new DateOnly(2026, 5, 24)), CancellationToken.None);

        Assert.Equal(100m, dto.Balance);
        Assert.Equal("Sam", dto.PartnerName);
        Assert.Equal(2, dto.OutstandingBillCount);
        Assert.Equal(150m, dto.ThisMonthLogged);
        Assert.Equal(50m, dto.ThisMonthReceived);
        Assert.Equal(12, dto.BehindByDays);
        Assert.Equal(3, dto.RecentActivity.Count);
        Assert.Equal(ActivityKind.Bill, dto.RecentActivity[0].Kind);
    }
}

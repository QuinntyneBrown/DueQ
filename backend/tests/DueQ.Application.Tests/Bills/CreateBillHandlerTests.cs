using DueQ.Application.Bills.Commands.CreateBill;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Bills;

namespace DueQ.Application.Tests.Bills;

public class CreateBillHandlerTests
{
    [Fact]
    public async Task Persists_bill_and_returns_partner_share_as_half_amount()
    {
        using var context = DueQContextFactory.Create();
        var handler = new CreateBillHandler(context);

        var dto = await handler.Handle(
            new CreateBillCommand("Hydro bill", 156.40m, new DateOnly(2026, 5, 18), null),
            CancellationToken.None);

        Assert.NotEqual(Guid.Empty, dto.Id);
        Assert.Equal(156.40m, dto.Amount);
        Assert.Equal(78.20m, dto.PartnerShare);
        Assert.Equal(BillStatus.Unsettled, dto.Status);

        var persisted = Assert.Single(context.Bills.ToList());
        Assert.Equal("Hydro bill", persisted.Description);
    }

    [Fact]
    public async Task Trims_description_and_normalizes_whitespace_note_to_null()
    {
        using var context = DueQContextFactory.Create();
        var handler = new CreateBillHandler(context);

        var dto = await handler.Handle(
            new CreateBillCommand("  Groceries  ", 10.00m, new DateOnly(2026, 5, 1), "   "),
            CancellationToken.None);

        Assert.Equal("Groceries", dto.Description);
        Assert.Null(dto.Note);
    }
}

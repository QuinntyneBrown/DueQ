using DueQ.Application.Payments.Commands.CreatePayment;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Payments;

namespace DueQ.Application.Tests.Payments;

public class CreatePaymentHandlerTests
{
    [Fact]
    public async Task Persists_payment_with_rounded_amount_and_method()
    {
        using var context = DueQContextFactory.Create();
        var handler = new CreatePaymentHandler(context);

        var dto = await handler.Handle(
            new CreatePaymentCommand(140.006m, new DateOnly(2026, 5, 24), PaymentMethod.ETransfer, " thanks "),
            CancellationToken.None);

        Assert.Equal(140.01m, dto.Amount);
        Assert.Equal(PaymentMethod.ETransfer, dto.Method);
        Assert.Equal("thanks", dto.Note);

        var persisted = Assert.Single(context.Payments.ToList());
        Assert.Equal(dto.Id, persisted.Id);
    }
}

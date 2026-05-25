using DueQ.Domain.Bills;
using DueQ.Domain.Households;
using DueQ.Domain.Payments;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Infrastructure.Persistence;

public static class DueQContextSeeder
{
    public static async Task SeedAsync(DueQContext context, CancellationToken cancellationToken = default)
    {
        if (await context.Households.AnyAsync(cancellationToken))
        {
            return;
        }

        await ResetAndSeedAsync(context, cancellationToken);
    }

    public static async Task ResetAndSeedAsync(DueQContext context, CancellationToken cancellationToken = default)
    {
        context.Payments.RemoveRange(context.Payments);
        context.Bills.RemoveRange(context.Bills);
        context.Households.RemoveRange(context.Households);
        await context.SaveChangesAsync(cancellationToken);

        var household = new Household
        {
            Id = Guid.NewGuid(),
            YourName = "Quinntyne Brown",
            PartnerName = "Sam"
        };
        context.Households.Add(household);

        var now = DateTime.UtcNow;
        var bills = new List<Bill>
        {
            // Anchor "first activity" row — keeps the dashboard's first row a Bill
            // (rather than a Payment) regardless of mutations other tests perform.
            Bill("Groceries — Today", 38.40m, new DateOnly(2026, 5, 25), BillStatus.Unsettled, null),

            // May 2026 — unsettled (matches dashboard mock)
            Bill("Groceries — Loblaws", 84.20m, new DateOnly(2026, 5, 22), BillStatus.Unsettled,
                "Weekly grocery run. Includes Sam's brand of oat milk and the produce we both share."),
            Bill("Hydro bill", 156.40m, new DateOnly(2026, 5, 18), BillStatus.Unsettled, null),
            Bill("Internet — Bell", 94.00m, new DateOnly(2026, 5, 8), BillStatus.Unsettled, null),
            Bill("Dinner — Pizzeria Libretto", 62.40m, new DateOnly(2026, 5, 4), BillStatus.Unsettled, null),

            // April 2026 — settled
            Bill("Groceries — Costco run", 214.66m, new DateOnly(2026, 4, 28), BillStatus.Settled, null),
            Bill("Hydro bill", 142.10m, new DateOnly(2026, 4, 18), BillStatus.Settled, null),
            Bill("Internet — Bell", 94.00m, new DateOnly(2026, 4, 8), BillStatus.Settled, null),

            // Older settled fillers so "All / Settled" counts feel realistic.
            Bill("Groceries — Loblaws", 78.12m, new DateOnly(2026, 3, 28), BillStatus.Settled, null),
            Bill("Hydro bill", 138.55m, new DateOnly(2026, 3, 18), BillStatus.Settled, null),
            Bill("Internet — Bell", 94.00m, new DateOnly(2026, 3, 8), BillStatus.Settled, null),
            Bill("Dinner — Bar Raval", 88.00m, new DateOnly(2026, 3, 2), BillStatus.Settled, null),
        };

        var createdAt = now.AddDays(-200);
        foreach (var bill in bills.OrderBy(b => b.Date))
        {
            bill.CreatedAt = createdAt;
            createdAt = createdAt.AddHours(6);
            context.Bills.Add(bill);
        }

        context.Payments.AddRange(
            Payment(140.00m, new DateOnly(2026, 5, 12), PaymentMethod.ETransfer, null, now.AddDays(-12)),
            Payment(300.00m, new DateOnly(2026, 4, 22), PaymentMethod.ETransfer, null, now.AddDays(-32))
        );

        await context.SaveChangesAsync(cancellationToken);
    }

    private static Bill Bill(string description, decimal amount, DateOnly date, BillStatus status, string? note)
        => new()
        {
            Id = Guid.NewGuid(),
            Description = description,
            Amount = amount,
            Date = date,
            Note = note,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };

    private static Payment Payment(decimal amount, DateOnly date, PaymentMethod method, string? note, DateTime createdAt)
        => new()
        {
            Id = Guid.NewGuid(),
            Amount = amount,
            Date = date,
            Method = method,
            Note = note,
            CreatedAt = createdAt
        };
}

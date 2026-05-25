using DueQ.Application.Abstractions;
using DueQ.Application.Dashboard.Dtos;
using DueQ.Domain.Bills;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Dashboard.Queries.GetDashboard;

public class GetDashboardHandler : IRequestHandler<GetDashboardQuery, DashboardDto>
{
    private readonly IDueQContext _context;

    public GetDashboardHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var today = request.Today ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var monthStart = new DateOnly(today.Year, today.Month, 1);

        var household = await _context.Households.AsNoTracking().FirstOrDefaultAsync(cancellationToken);

        var bills = await _context.Bills.AsNoTracking()
            .OrderByDescending(b => b.Date)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);

        var payments = await _context.Payments.AsNoTracking()
            .OrderByDescending(p => p.Date)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        var totalOwed = decimal.Round(bills.Sum(b => b.Amount) / 2m, 2);
        var totalReceived = payments.Sum(p => p.Amount);
        var balance = decimal.Round(totalOwed - totalReceived, 2);

        var thisMonthLogged = decimal.Round(
            bills.Where(b => b.Date >= monthStart).Sum(b => b.Amount) / 2m, 2);
        var thisMonthReceived = payments
            .Where(p => p.Date >= monthStart)
            .Sum(p => p.Amount);

        var lastPaymentDate = payments.Count > 0 ? payments.Max(p => p.Date) : (DateOnly?)null;
        var behindByDays = balance > 0 && lastPaymentDate is not null
            ? Math.Max(0, today.DayNumber - lastPaymentDate.Value.DayNumber)
            : 0;

        var recentActivity = new List<ActivityItemDto>();

        foreach (var bill in bills)
        {
            recentActivity.Add(new ActivityItemDto
            {
                Id = bill.Id,
                Kind = ActivityKind.Bill,
                Title = bill.Description,
                Date = bill.Date,
                Amount = bill.Amount,
                BalanceDelta = decimal.Round(bill.Amount / 2m, 2)
            });
        }

        foreach (var payment in payments)
        {
            recentActivity.Add(new ActivityItemDto
            {
                Id = payment.Id,
                Kind = ActivityKind.Payment,
                Title = "Payment received",
                Date = payment.Date,
                Amount = payment.Amount,
                BalanceDelta = -payment.Amount
            });
        }

        var recent = recentActivity
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.Kind)
            .Take(5)
            .ToList();

        return new DashboardDto
        {
            YourName = household?.YourName ?? string.Empty,
            PartnerName = household?.PartnerName ?? string.Empty,
            Balance = balance,
            OutstandingBillCount = bills.Count(b => b.Status == BillStatus.Unsettled),
            LastSettlementDate = lastPaymentDate,
            ThisMonthLogged = thisMonthLogged,
            ThisMonthReceived = thisMonthReceived,
            BehindByDays = behindByDays,
            RecentActivity = recent
        };
    }
}

using DueQ.Application.Abstractions;
using DueQ.Application.Dashboard.Dtos;
using DueQ.Application.History.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.History.Queries.GetHistory;

public class GetHistoryHandler : IRequestHandler<GetHistoryQuery, HistoryDto>
{
    private readonly IDueQContext _context;

    public GetHistoryHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<HistoryDto> Handle(GetHistoryQuery request, CancellationToken cancellationToken)
    {
        var bills = await _context.Bills.AsNoTracking().ToListAsync(cancellationToken);
        var payments = await _context.Payments.AsNoTracking().ToListAsync(cancellationToken);

        var totalLogged = decimal.Round(bills.Sum(b => b.Amount) / 2m, 2);
        var totalReceived = payments.Sum(p => p.Amount);
        var runningBalance = decimal.Round(totalLogged - totalReceived, 2);

        var entries = new List<(DateOnly Date, DateTime CreatedAt, HistoryEntryDto Entry)>();

        foreach (var bill in bills)
        {
            var delta = decimal.Round(bill.Amount / 2m, 2);
            entries.Add((bill.Date, bill.CreatedAt, new HistoryEntryDto
            {
                Id = bill.Id,
                Kind = ActivityKind.Bill,
                Title = bill.Description,
                Date = bill.Date,
                Amount = bill.Amount,
                BalanceDelta = delta
            }));
        }

        foreach (var payment in payments)
        {
            entries.Add((payment.Date, payment.CreatedAt, new HistoryEntryDto
            {
                Id = payment.Id,
                Kind = ActivityKind.Payment,
                Title = "Payment received",
                Date = payment.Date,
                Amount = payment.Amount,
                BalanceDelta = -payment.Amount
            }));
        }

        // chronological ascending for running balance accumulation
        var ascending = entries
            .OrderBy(e => e.Date)
            .ThenBy(e => e.CreatedAt)
            .ToList();

        decimal accumulator = 0m;
        foreach (var (_, _, entry) in ascending)
        {
            accumulator = decimal.Round(accumulator + entry.BalanceDelta, 2);
            entry.RunningBalance = accumulator;
        }

        var months = ascending
            .GroupBy(e => new { e.Entry.Date.Year, e.Entry.Date.Month })
            .OrderByDescending(g => g.Key.Year)
            .ThenByDescending(g => g.Key.Month)
            .Select(g => new HistoryMonthDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                MonthDelta = decimal.Round(g.Sum(e => e.Entry.BalanceDelta), 2),
                Entries = g
                    .OrderByDescending(e => e.Date)
                    .ThenByDescending(e => e.CreatedAt)
                    .Select(e => e.Entry)
                    .ToList()
            })
            .ToList();

        return new HistoryDto
        {
            RunningBalance = runningBalance,
            TotalLogged = totalLogged,
            TotalReceived = totalReceived,
            Months = months
        };
    }
}

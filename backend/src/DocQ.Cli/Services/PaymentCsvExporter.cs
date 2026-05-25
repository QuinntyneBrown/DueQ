using DocQ.Cli.Models;
using DueQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace DocQ.Cli.Services;

public interface IPaymentCsvExporter
{
    Task<ExportResult> ExportAsync(ExportPaymentsRequest request, CancellationToken cancellationToken);
}

public sealed class PaymentCsvExporter : IPaymentCsvExporter
{
    private static readonly string[] Header = ["Id", "Date", "Amount", "Method", "Note", "CreatedAt"];
    private readonly DueQContext _context;
    private readonly ICsvFileWriter _writer;

    public PaymentCsvExporter(DueQContext context, ICsvFileWriter writer)
    {
        _context = context;
        _writer = writer;
    }

    public async Task<ExportResult> ExportAsync(ExportPaymentsRequest request, CancellationToken cancellationToken)
    {
        ValidateRange(request.DateRange);

        var query = _context.Payments.AsNoTracking().AsQueryable();

        if (request.DateRange.From is { } from)
        {
            query = query.Where(p => p.Date >= from);
        }

        if (request.DateRange.To is { } to)
        {
            query = query.Where(p => p.Date <= to);
        }

        var rows = await query
            .OrderBy(p => p.Date)
            .ThenBy(p => p.CreatedAt)
            .Select(p => new[]
            {
                p.Id.ToString(),
                p.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                p.Amount.ToString("0.00", CultureInfo.InvariantCulture),
                p.Method.ToString(),
                p.Note ?? string.Empty,
                p.CreatedAt.ToString("O", CultureInfo.InvariantCulture)
            })
            .ToListAsync(cancellationToken);

        await _writer.WriteAsync(request.Output, Header, rows, cancellationToken);
        return new ExportResult(rows.Count, request.Output.FullName);
    }

    private static void ValidateRange(DateRange range)
    {
        if (range.From is { } from && range.To is { } to && from > to)
        {
            throw new CliUsageException("--from must be on or before --to.");
        }
    }
}

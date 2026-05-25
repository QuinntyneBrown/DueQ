using DocQ.Cli.Models;
using DueQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace DocQ.Cli.Services;

public interface IBillCsvExporter
{
    Task<ExportResult> ExportAsync(ExportBillsRequest request, CancellationToken cancellationToken);
}

public sealed class BillCsvExporter : IBillCsvExporter
{
    private static readonly string[] Header = ["Id", "Date", "Description", "Amount", "Status", "Note", "CreatedAt"];
    private readonly DueQContext _context;
    private readonly ICsvFileWriter _writer;

    public BillCsvExporter(DueQContext context, ICsvFileWriter writer)
    {
        _context = context;
        _writer = writer;
    }

    public async Task<ExportResult> ExportAsync(ExportBillsRequest request, CancellationToken cancellationToken)
    {
        ValidateRange(request.DateRange);

        var query = _context.Bills.AsNoTracking().AsQueryable();

        if (request.DateRange.From is { } from)
        {
            query = query.Where(b => b.Date >= from);
        }

        if (request.DateRange.To is { } to)
        {
            query = query.Where(b => b.Date <= to);
        }

        if (request.Status is { } status)
        {
            query = query.Where(b => b.Status == status);
        }

        var rows = await query
            .OrderBy(b => b.Date)
            .ThenBy(b => b.Description)
            .Select(b => new[]
            {
                b.Id.ToString(),
                b.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                b.Description,
                b.Amount.ToString("0.00", CultureInfo.InvariantCulture),
                b.Status.ToString(),
                b.Note ?? string.Empty,
                b.CreatedAt.ToString("O", CultureInfo.InvariantCulture)
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

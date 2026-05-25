using DocQ.Cli.Models;
using DocQ.Cli.Services;
using DueQ.Domain.Bills;
using Microsoft.Extensions.DependencyInjection;
using System.CommandLine;
using System.Globalization;

namespace DocQ.Cli.Commands;

public sealed class ExportBillsCommand : ICommandDefinition
{
    private readonly ICommandExecutor _executor;
    private readonly Option<FileInfo> _outputOption = new("--output", "-o")
    {
        Description = "Destination CSV file.",
        Required = true
    };
    private readonly Option<string?> _fromOption = new("--from")
    {
        Description = "Optional inclusive start date in yyyy-MM-dd format."
    };
    private readonly Option<string?> _toOption = new("--to")
    {
        Description = "Optional inclusive end date in yyyy-MM-dd format."
    };
    private readonly Option<string?> _statusOption = new("--status")
    {
        Description = "Optional bill status filter: Unsettled or Settled."
    };

    public ExportBillsCommand(ICommandExecutor executor)
    {
        _executor = executor;
    }

    public Command Build()
    {
        var command = new Command("export-bills", "Export bills to a CSV file.");
        command.Options.Add(_outputOption);
        command.Options.Add(_fromOption);
        command.Options.Add(_toOption);
        command.Options.Add(_statusOption);
        command.SetAction((parseResult, cancellationToken) =>
            _executor.ExecuteAsync(async (serviceProvider, ct) =>
            {
                var request = new ExportBillsRequest(
                    parseResult.GetRequiredValue(_outputOption),
                    new DateRange(
                        ParseDate(parseResult.GetValue(_fromOption), "--from"),
                        ParseDate(parseResult.GetValue(_toOption), "--to")),
                    ParseStatus(parseResult.GetValue(_statusOption)));

                var exporter = serviceProvider.GetRequiredService<IBillCsvExporter>();
                var result = await exporter.ExportAsync(request, ct);
                serviceProvider.GetRequiredService<ICliConsole>()
                    .WriteLine($"Exported {result.RowCount} bills to {result.OutputPath}.");
                return 0;
            }, cancellationToken));

        return command;
    }

    private static DateOnly? ParseDate(string? value, string optionName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            ? date
            : throw new CliUsageException($"{optionName} must use yyyy-MM-dd format.");
    }

    private static BillStatus? ParseStatus(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return Enum.TryParse<BillStatus>(value, ignoreCase: true, out var status)
            ? status
            : throw new CliUsageException("--status must be Unsettled or Settled.");
    }
}

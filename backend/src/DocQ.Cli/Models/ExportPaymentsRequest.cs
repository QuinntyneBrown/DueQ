namespace DocQ.Cli.Models;

public sealed record ExportPaymentsRequest(FileInfo Output, DateRange DateRange);

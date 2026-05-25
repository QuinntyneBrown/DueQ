using DueQ.Domain.Bills;

namespace DocQ.Cli.Models;

public sealed record ExportBillsRequest(FileInfo Output, DateRange DateRange, BillStatus? Status);

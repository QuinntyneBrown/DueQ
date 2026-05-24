using DueQ.Application.Dashboard.Dtos;

namespace DueQ.Application.History.Dtos;

public class HistoryEntryDto
{
    public Guid Id { get; set; }
    public ActivityKind Kind { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
    public decimal BalanceDelta { get; set; }
    public decimal RunningBalance { get; set; }
}

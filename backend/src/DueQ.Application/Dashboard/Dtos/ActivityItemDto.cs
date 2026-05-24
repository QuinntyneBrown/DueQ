namespace DueQ.Application.Dashboard.Dtos;

public class ActivityItemDto
{
    public Guid Id { get; set; }
    public ActivityKind Kind { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
    public decimal BalanceDelta { get; set; }
}

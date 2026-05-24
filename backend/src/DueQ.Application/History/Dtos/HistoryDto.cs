namespace DueQ.Application.History.Dtos;

public class HistoryDto
{
    public decimal RunningBalance { get; set; }
    public decimal TotalLogged { get; set; }
    public decimal TotalReceived { get; set; }
    public IReadOnlyList<HistoryMonthDto> Months { get; set; } = Array.Empty<HistoryMonthDto>();
}

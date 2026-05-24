namespace DueQ.Application.History.Dtos;

public class HistoryMonthDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal MonthDelta { get; set; }
    public IReadOnlyList<HistoryEntryDto> Entries { get; set; } = Array.Empty<HistoryEntryDto>();
}

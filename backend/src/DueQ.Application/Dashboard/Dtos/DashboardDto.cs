namespace DueQ.Application.Dashboard.Dtos;

public class DashboardDto
{
    public string YourName { get; set; } = string.Empty;
    public string PartnerName { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public int OutstandingBillCount { get; set; }
    public DateOnly? LastSettlementDate { get; set; }
    public decimal ThisMonthLogged { get; set; }
    public decimal ThisMonthReceived { get; set; }
    public int BehindByDays { get; set; }
    public IReadOnlyList<ActivityItemDto> RecentActivity { get; set; } = Array.Empty<ActivityItemDto>();
}

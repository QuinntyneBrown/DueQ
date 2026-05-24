using DueQ.Domain.Bills;

namespace DueQ.Application.Bills.Dtos;

public class BillDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal PartnerShare { get; set; }
    public DateOnly Date { get; set; }
    public string? Note { get; set; }
    public BillStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

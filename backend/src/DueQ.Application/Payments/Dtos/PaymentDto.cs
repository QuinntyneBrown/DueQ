using DueQ.Domain.Payments;

namespace DueQ.Application.Payments.Dtos;

public class PaymentDto
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }
    public PaymentMethod Method { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}

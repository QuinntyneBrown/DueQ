namespace DueQ.Domain.Payments;

public class Payment
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }
    public PaymentMethod Method { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}

namespace DueQ.Domain.Households;

public class Household
{
    public Guid Id { get; set; }
    public string YourName { get; set; } = string.Empty;
    public string PartnerName { get; set; } = string.Empty;
}

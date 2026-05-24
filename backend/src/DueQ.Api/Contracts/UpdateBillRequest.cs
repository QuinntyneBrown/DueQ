namespace DueQ.Api.Contracts;

public record UpdateBillRequest(string Description, decimal Amount, DateOnly Date, string? Note);

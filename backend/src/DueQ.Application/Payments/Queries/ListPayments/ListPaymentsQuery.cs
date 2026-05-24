using DueQ.Application.Payments.Dtos;
using MediatR;

namespace DueQ.Application.Payments.Queries.ListPayments;

public record ListPaymentsQuery(DateOnly? From = null, DateOnly? To = null)
    : IRequest<IReadOnlyList<PaymentDto>>;

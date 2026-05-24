using DueQ.Application.Payments.Dtos;
using DueQ.Domain.Payments;
using MediatR;

namespace DueQ.Application.Payments.Commands.CreatePayment;

public record CreatePaymentCommand(
    decimal Amount,
    DateOnly Date,
    PaymentMethod Method,
    string? Note) : IRequest<PaymentDto>;

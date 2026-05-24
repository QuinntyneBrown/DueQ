using MediatR;

namespace DueQ.Application.Payments.Commands.DeletePayment;

public record DeletePaymentCommand(Guid Id) : IRequest;

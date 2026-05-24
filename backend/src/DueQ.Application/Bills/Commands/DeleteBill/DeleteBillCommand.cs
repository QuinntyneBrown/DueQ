using MediatR;

namespace DueQ.Application.Bills.Commands.DeleteBill;

public record DeleteBillCommand(Guid Id) : IRequest;

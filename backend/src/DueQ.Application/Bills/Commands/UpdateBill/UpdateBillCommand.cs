using DueQ.Application.Bills.Dtos;
using MediatR;

namespace DueQ.Application.Bills.Commands.UpdateBill;

public record UpdateBillCommand(
    Guid Id,
    string Description,
    decimal Amount,
    DateOnly Date,
    string? Note) : IRequest<BillDto>;

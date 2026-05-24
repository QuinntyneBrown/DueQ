using DueQ.Application.Bills.Dtos;
using MediatR;

namespace DueQ.Application.Bills.Commands.CreateBill;

public record CreateBillCommand(
    string Description,
    decimal Amount,
    DateOnly Date,
    string? Note) : IRequest<BillDto>;

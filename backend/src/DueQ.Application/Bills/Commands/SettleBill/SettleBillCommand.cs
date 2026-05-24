using DueQ.Application.Bills.Dtos;
using MediatR;

namespace DueQ.Application.Bills.Commands.SettleBill;

public record SettleBillCommand(Guid Id, bool Settled) : IRequest<BillDto>;

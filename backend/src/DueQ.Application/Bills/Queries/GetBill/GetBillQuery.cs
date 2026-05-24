using DueQ.Application.Bills.Dtos;
using MediatR;

namespace DueQ.Application.Bills.Queries.GetBill;

public record GetBillQuery(Guid Id) : IRequest<BillDto>;

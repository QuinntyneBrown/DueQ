using DueQ.Application.Bills.Dtos;
using DueQ.Domain.Bills;
using MediatR;

namespace DueQ.Application.Bills.Queries.ListBills;

public record ListBillsQuery(BillStatus? Status = null, DateOnly? From = null, DateOnly? To = null)
    : IRequest<IReadOnlyList<BillDto>>;

using DueQ.Application.History.Dtos;
using MediatR;

namespace DueQ.Application.History.Queries.GetHistory;

public record GetHistoryQuery : IRequest<HistoryDto>;

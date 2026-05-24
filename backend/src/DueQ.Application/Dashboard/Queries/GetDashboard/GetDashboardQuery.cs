using DueQ.Application.Dashboard.Dtos;
using MediatR;

namespace DueQ.Application.Dashboard.Queries.GetDashboard;

public record GetDashboardQuery(DateOnly? Today = null) : IRequest<DashboardDto>;

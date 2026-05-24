using DueQ.Application.Settings.Dtos;
using MediatR;

namespace DueQ.Application.Settings.Queries.GetSettings;

public record GetSettingsQuery : IRequest<SettingsDto>;

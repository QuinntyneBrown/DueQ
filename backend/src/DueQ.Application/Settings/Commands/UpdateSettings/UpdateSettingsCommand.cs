using DueQ.Application.Settings.Dtos;
using MediatR;

namespace DueQ.Application.Settings.Commands.UpdateSettings;

public record UpdateSettingsCommand(string YourName, string PartnerName) : IRequest<SettingsDto>;

using DueQ.Application.Auth.Common;
using MediatR;

namespace DueQ.Application.Auth.Commands.Register;

public record RegisterCommand(string Name, string Email, string Password) : IRequest<LoginResult>;

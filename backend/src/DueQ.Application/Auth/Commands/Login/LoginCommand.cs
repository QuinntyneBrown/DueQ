using DueQ.Application.Auth.Common;
using MediatR;

namespace DueQ.Application.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResult>;

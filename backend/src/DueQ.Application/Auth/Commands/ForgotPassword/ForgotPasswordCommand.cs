using MediatR;

namespace DueQ.Application.Auth.Commands.ForgotPassword;

public record ForgotPasswordCommand(string Email) : IRequest<ForgotPasswordResult>;

/// <summary>
/// Always returned with the same shape whether or not a user was found, so
/// callers cannot enumerate accounts. The <see cref="DevToken"/> property is
/// non-null only in the Development environment to support end-to-end tests
/// that exercise the full reset round-trip.
/// </summary>
public record ForgotPasswordResult(string? DevToken);

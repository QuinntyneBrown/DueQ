using DueQ.Application.Abstractions;
using DueQ.Application.Auth.Commands.ForgotPassword;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Auth.Commands.ResetPassword;

public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand>
{
    private readonly IDueQContext _context;
    private readonly IPasswordHasher _hasher;

    public ResetPasswordHandler(IDueQContext context, IPasswordHasher hasher)
    {
        _context = context;
        _hasher = hasher;
    }

    public async Task Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var tokenHash = ForgotPasswordHandler.Sha256Hex(request.Token);
        var now = DateTime.UtcNow;

        var record = await _context.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash, cancellationToken);

        if (record is null || record.UsedUtc is not null || record.ExpiresUtc <= now)
        {
            throw new ValidationException(new[]
            {
                new ValidationFailure("Token", "This reset link is no longer valid"),
            });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == record.UserId, cancellationToken);
        if (user is null)
        {
            throw new ValidationException(new[]
            {
                new ValidationFailure("Token", "This reset link is no longer valid"),
            });
        }

        user.PasswordHash = _hasher.Hash(request.NewPassword);
        record.UsedUtc = now;
        await _context.SaveChangesAsync(cancellationToken);
    }
}

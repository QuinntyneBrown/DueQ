using System.Security.Cryptography;
using DueQ.Application.Abstractions;
using DueQ.Domain.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DueQ.Application.Auth.Commands.ForgotPassword;

public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResult>
{
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromMinutes(60);

    private readonly IDueQContext _context;
    private readonly IDevelopmentFlag _env;
    private readonly ILogger<ForgotPasswordHandler> _logger;

    public ForgotPasswordHandler(
        IDueQContext context,
        IDevelopmentFlag env,
        ILogger<ForgotPasswordHandler> logger)
    {
        _context = context;
        _env = env;
        _logger = logger;
    }

    public async Task<ForgotPasswordResult> Handle(
        ForgotPasswordCommand request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        // Same response shape regardless of whether the user exists; never leak
        // membership information through this endpoint.
        if (user is null)
        {
            return new ForgotPasswordResult(null);
        }

        var rawToken = GenerateUrlSafeToken();
        var tokenHash = Sha256Hex(rawToken);

        _context.PasswordResetTokens.Add(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresUtc = DateTime.UtcNow.Add(TokenLifetime),
        });
        await _context.SaveChangesAsync(cancellationToken);

        // In a real deployment this would dispatch an email. For now we log the
        // URL at Information so a developer can copy it from the API console.
        _logger.LogInformation(
            "Password reset link for {Email}: /reset-password?token={Token}",
            user.Email,
            rawToken);

        return new ForgotPasswordResult(_env.IsDevelopment ? rawToken : null);
    }

    private static string GenerateUrlSafeToken()
    {
        Span<byte> bytes = stackalloc byte[32];
        RandomNumberGenerator.Fill(bytes);
        // Base64Url-style: replace + and / with - and _, strip padding.
        return Convert.ToBase64String(bytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }

    public static string Sha256Hex(string value)
    {
        Span<byte> hash = stackalloc byte[32];
        SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(value), hash);
        return Convert.ToHexString(hash);
    }
}

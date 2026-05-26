using DueQ.Application.Abstractions;
using DueQ.Application.Auth.Commands.ForgotPassword;
using DueQ.Application.Tests.TestSupport;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace DueQ.Application.Tests.Auth;

public class ForgotPasswordHandlerTests
{
    [Fact]
    public async Task Known_email_persists_a_hashed_token_and_returns_raw_in_development()
    {
        using var context = DueQContextFactory.Create();
        var handler = new ForgotPasswordHandler(
            context,
            new DevFlag(true),
            NullLogger<ForgotPasswordHandler>.Instance);

        var result = await handler.Handle(
            new ForgotPasswordCommand("quinntynebrown@gmail.com"),
            CancellationToken.None);

        Assert.NotNull(result.DevToken);
        Assert.False(string.IsNullOrEmpty(result.DevToken));

        var token = await context.PasswordResetTokens.SingleAsync();
        Assert.NotEqual(result.DevToken, token.TokenHash);                       // we store the hash
        Assert.Equal(ForgotPasswordHandler.Sha256Hex(result.DevToken!), token.TokenHash);
        Assert.True(token.ExpiresUtc > DateTime.UtcNow);
        Assert.Null(token.UsedUtc);
    }

    [Fact]
    public async Task Unknown_email_returns_same_shape_and_does_not_persist_a_token()
    {
        using var context = DueQContextFactory.Create();
        var handler = new ForgotPasswordHandler(
            context,
            new DevFlag(true),
            NullLogger<ForgotPasswordHandler>.Instance);

        var result = await handler.Handle(
            new ForgotPasswordCommand("nobody@example.com"),
            CancellationToken.None);

        Assert.Null(result.DevToken);
        Assert.Empty(context.PasswordResetTokens);
    }

    [Fact]
    public async Task Non_development_environment_does_not_leak_raw_token_in_response()
    {
        using var context = DueQContextFactory.Create();
        var handler = new ForgotPasswordHandler(
            context,
            new DevFlag(false),
            NullLogger<ForgotPasswordHandler>.Instance);

        var result = await handler.Handle(
            new ForgotPasswordCommand("quinntynebrown@gmail.com"),
            CancellationToken.None);

        Assert.Null(result.DevToken);
        Assert.Single(context.PasswordResetTokens);
    }

    private sealed class DevFlag : IDevelopmentFlag
    {
        public DevFlag(bool isDevelopment) => IsDevelopment = isDevelopment;
        public bool IsDevelopment { get; }
    }
}

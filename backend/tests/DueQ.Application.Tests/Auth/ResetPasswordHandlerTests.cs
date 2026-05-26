using DueQ.Application.Abstractions;
using DueQ.Application.Auth.Commands.ForgotPassword;
using DueQ.Application.Auth.Commands.ResetPassword;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Users;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace DueQ.Application.Tests.Auth;

public class ResetPasswordHandlerTests
{
    [Fact]
    public async Task Valid_token_updates_password_hash_and_marks_token_used()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new RecordingHasher();

        var forgot = new ForgotPasswordHandler(
            context,
            new DevFlag(true),
            NullLogger<ForgotPasswordHandler>.Instance);
        var forgotResult = await forgot.Handle(
            new ForgotPasswordCommand("quinntynebrown@gmail.com"),
            CancellationToken.None);
        Assert.NotNull(forgotResult.DevToken);

        var handler = new ResetPasswordHandler(context, hasher);
        await handler.Handle(
            new ResetPasswordCommand(forgotResult.DevToken!, "new-password-123"),
            CancellationToken.None);

        var user = await context.Users.SingleAsync(u => u.Email == "quinntynebrown@gmail.com");
        Assert.Equal("hashed::new-password-123", user.PasswordHash);

        var token = await context.PasswordResetTokens.SingleAsync();
        Assert.NotNull(token.UsedUtc);
    }

    [Fact]
    public async Task Already_used_token_is_rejected()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new RecordingHasher();

        var forgot = new ForgotPasswordHandler(
            context,
            new DevFlag(true),
            NullLogger<ForgotPasswordHandler>.Instance);
        var forgotResult = await forgot.Handle(
            new ForgotPasswordCommand("quinntynebrown@gmail.com"),
            CancellationToken.None);

        var handler = new ResetPasswordHandler(context, hasher);
        await handler.Handle(
            new ResetPasswordCommand(forgotResult.DevToken!, "first-attempt-123"),
            CancellationToken.None);

        var ex = await Assert.ThrowsAsync<ValidationException>(() =>
            handler.Handle(
                new ResetPasswordCommand(forgotResult.DevToken!, "second-attempt-456"),
                CancellationToken.None));
        Assert.Single(ex.Errors);
        Assert.Equal("Token", ex.Errors.First().PropertyName);
    }

    [Fact]
    public async Task Expired_token_is_rejected()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new RecordingHasher();
        var raw = "raw-token-value-xyz";
        var user = await context.Users.SingleAsync();
        context.PasswordResetTokens.Add(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = ForgotPasswordHandler.Sha256Hex(raw),
            ExpiresUtc = DateTime.UtcNow.AddMinutes(-1),
        });
        await context.SaveChangesAsync();

        var handler = new ResetPasswordHandler(context, hasher);
        await Assert.ThrowsAsync<ValidationException>(() =>
            handler.Handle(
                new ResetPasswordCommand(raw, "password123"),
                CancellationToken.None));
    }

    [Fact]
    public async Task Unknown_token_is_rejected()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new RecordingHasher();

        var handler = new ResetPasswordHandler(context, hasher);
        await Assert.ThrowsAsync<ValidationException>(() =>
            handler.Handle(
                new ResetPasswordCommand("not-a-real-token", "password123"),
                CancellationToken.None));
    }

    private sealed class RecordingHasher : IPasswordHasher
    {
        public string Hash(string password) => $"hashed::{password}";
        public bool Verify(string password, string hash) => hash == $"hashed::{password}";
    }

    private sealed class DevFlag : IDevelopmentFlag
    {
        public DevFlag(bool isDevelopment) => IsDevelopment = isDevelopment;
        public bool IsDevelopment { get; }
    }
}

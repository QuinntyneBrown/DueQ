using System.IdentityModel.Tokens.Jwt;
using DueQ.Application.Abstractions;
using DueQ.Application.Auth.Commands.Register;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Users;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Tests.Auth;

public class RegisterHandlerTests
{
    [Fact]
    public async Task Persists_user_with_hashed_password_and_returns_token()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new RecordingHasher();
        var tokens = new FakeTokens();
        var handler = new RegisterHandler(context, hasher, tokens);

        var result = await handler.Handle(
            new RegisterCommand("  Alex Doe ", "  ALEX@example.com ", "password123"),
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.False(string.IsNullOrEmpty(result.Token));
        Assert.Equal("Alex Doe", result.User.Name);
        Assert.Equal("alex@example.com", result.User.Email);

        var persisted = await context.Users.SingleAsync(u => u.Email == "alex@example.com");
        Assert.Equal("hashed::password123", persisted.PasswordHash);
        Assert.True(persisted.CreatedUtc <= DateTime.UtcNow);
    }

    [Fact]
    public async Task Throws_validation_error_when_email_already_taken()
    {
        using var context = DueQContextFactory.Create();
        var handler = new RegisterHandler(context, new RecordingHasher(), new FakeTokens());

        var ex = await Assert.ThrowsAsync<ValidationException>(() =>
            handler.Handle(
                new RegisterCommand("Whoever", "quinntynebrown@gmail.com", "password123"),
                CancellationToken.None));

        var failure = Assert.Single(ex.Errors);
        Assert.Equal("Email", failure.PropertyName);
        Assert.Equal("An account with that email already exists", failure.ErrorMessage);
    }

    [Fact]
    public void Validator_rejects_password_under_eight_chars()
    {
        var validator = new RegisterValidator();
        var result = validator.Validate(new RegisterCommand("Alex", "alex@example.com", "short"));
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Password");
    }

    private sealed class RecordingHasher : IPasswordHasher
    {
        public string Hash(string password) => $"hashed::{password}";
        public bool Verify(string password, string hash) => hash == $"hashed::{password}";
    }

    private sealed class FakeTokens : IJwtTokenGenerator
    {
        public string Generate(User user)
        {
            var token = new JwtSecurityToken(
                issuer: "test",
                audience: "test",
                claims: new[]
                {
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, user.Email),
                });
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

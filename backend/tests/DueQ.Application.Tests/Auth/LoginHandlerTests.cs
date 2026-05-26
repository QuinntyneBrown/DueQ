using System.IdentityModel.Tokens.Jwt;
using DueQ.Application.Abstractions;
using DueQ.Application.Auth.Commands.Login;
using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Users;
using FluentValidation;

namespace DueQ.Application.Tests.Auth;

public class LoginHandlerTests
{
    [Fact]
    public async Task Returns_token_with_sub_and_email_claims_for_valid_credentials()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new FakeHasher();
        var tokens = new FakeTokenGenerator();
        var handler = new LoginHandler(context, hasher, tokens);

        var seeded = context.Users.Single(u => u.Email == "quinntynebrown@gmail.com");

        // The seeded BCrypt hash is for "password123"; FakeHasher just compares
        // to the recorded "verifyHash" + password it was set up with.
        hasher.SetExpected(seeded.PasswordHash, "password123");

        var result = await handler.Handle(
            new LoginCommand(seeded.Email, "password123"),
            CancellationToken.None);

        Assert.False(string.IsNullOrEmpty(result.Token));
        Assert.Equal(seeded.Id, result.User.Id);
        Assert.Equal(seeded.Email, result.User.Email);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(result.Token);
        Assert.Equal(seeded.Id.ToString(), jwt.Subject);
        Assert.Contains(jwt.Claims, c => c.Type == JwtRegisteredClaimNames.Email && c.Value == seeded.Email);
    }

    [Fact]
    public async Task Throws_validation_exception_with_generic_credentials_message_for_wrong_password()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new FakeHasher();
        var tokens = new FakeTokenGenerator();
        var handler = new LoginHandler(context, hasher, tokens);

        // Hasher returns false for anything we didn't pre-register.
        var ex = await Assert.ThrowsAsync<ValidationException>(() =>
            handler.Handle(
                new LoginCommand("quinntynebrown@gmail.com", "WRONG"),
                CancellationToken.None));

        var failure = Assert.Single(ex.Errors);
        Assert.Equal("Credentials", failure.PropertyName);
        Assert.Equal("Email or password is incorrect", failure.ErrorMessage);
    }

    [Fact]
    public async Task Throws_same_generic_message_for_unknown_email()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new FakeHasher();
        var tokens = new FakeTokenGenerator();
        var handler = new LoginHandler(context, hasher, tokens);

        var ex = await Assert.ThrowsAsync<ValidationException>(() =>
            handler.Handle(
                new LoginCommand("nobody@example.com", "whatever"),
                CancellationToken.None));

        var failure = Assert.Single(ex.Errors);
        Assert.Equal("Credentials", failure.PropertyName);
        Assert.Equal("Email or password is incorrect", failure.ErrorMessage);
    }

    [Fact]
    public async Task Lowercases_email_before_lookup()
    {
        using var context = DueQContextFactory.Create();
        var hasher = new FakeHasher();
        var tokens = new FakeTokenGenerator();
        var handler = new LoginHandler(context, hasher, tokens);

        var seeded = context.Users.Single(u => u.Email == "quinntynebrown@gmail.com");
        hasher.SetExpected(seeded.PasswordHash, "password123");

        var result = await handler.Handle(
            new LoginCommand("  QuinntyneBrown@GMAIL.com  ", "password123"),
            CancellationToken.None);

        Assert.Equal(seeded.Id, result.User.Id);
    }

    private sealed class FakeHasher : IPasswordHasher
    {
        private string? _hash;
        private string? _password;

        public void SetExpected(string hash, string password)
        {
            _hash = hash;
            _password = password;
        }

        public string Hash(string password) => $"hashed::{password}";

        public bool Verify(string password, string hash) =>
            _hash is not null && _password is not null && hash == _hash && password == _password;
    }

    private sealed class FakeTokenGenerator : IJwtTokenGenerator
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
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Name, user.Name),
                });
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

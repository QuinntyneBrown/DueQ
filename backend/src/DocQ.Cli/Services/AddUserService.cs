using DueQ.Domain.Users;
using DueQ.Infrastructure.Auth;
using DueQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DocQ.Cli.Services;

public interface IAddUserService
{
    Task<(User User, bool Updated)> AddAsync(
        string name,
        string email,
        string password,
        bool overwrite,
        CancellationToken cancellationToken);
}

public sealed class AddUserService : IAddUserService
{
    private readonly DueQContext _context;

    public AddUserService(DueQContext context)
    {
        _context = context;
    }

    public async Task<(User User, bool Updated)> AddAsync(
        string name,
        string email,
        string password,
        bool overwrite,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var normalizedName = name.Trim();

        if (string.IsNullOrWhiteSpace(normalizedName))
            throw new CliUsageException("--name must not be empty.");
        if (string.IsNullOrWhiteSpace(normalizedEmail))
            throw new CliUsageException("--email must not be empty.");
        if (string.IsNullOrWhiteSpace(password))
            throw new CliUsageException("--password must not be empty.");
        if (password.Length < 8)
            throw new CliUsageException("--password must be at least 8 characters.");

        var hasher = new BCryptPasswordHasher();
        var existing = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (existing is not null)
        {
            if (!overwrite)
            {
                throw new CliUsageException(
                    $"A user with email '{normalizedEmail}' already exists. " +
                    "Pass --overwrite to replace name and password on the existing row.");
            }

            existing.Name = normalizedName;
            existing.PasswordHash = hasher.Hash(password);
            await _context.SaveChangesAsync(cancellationToken);
            return (existing, true);
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = normalizedEmail,
            Name = normalizedName,
            PasswordHash = hasher.Hash(password),
            CreatedUtc = DateTime.UtcNow,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return (user, false);
    }
}

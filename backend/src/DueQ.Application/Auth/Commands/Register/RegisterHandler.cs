using DueQ.Application.Abstractions;
using DueQ.Application.Auth.Common;
using DueQ.Domain.Users;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Auth.Commands.Register;

public class RegisterHandler : IRequestHandler<RegisterCommand, LoginResult>
{
    private readonly IDueQContext _context;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenGenerator _tokens;

    public RegisterHandler(IDueQContext context, IPasswordHasher hasher, IJwtTokenGenerator tokens)
    {
        _context = context;
        _hasher = hasher;
        _tokens = tokens;
    }

    public async Task<LoginResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var name = request.Name.Trim();

        var exists = await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);
        if (exists)
        {
            throw new ValidationException(new[]
            {
                new ValidationFailure("Email", "An account with that email already exists"),
            });
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Name = name,
            PasswordHash = _hasher.Hash(request.Password),
            CreatedUtc = DateTime.UtcNow,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _tokens.Generate(user);
        return new LoginResult(token, new UserDto(user.Id, user.Email, user.Name));
    }
}

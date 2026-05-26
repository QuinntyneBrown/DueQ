using DueQ.Application.Abstractions;
using DueQ.Application.Auth.Common;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Auth.Commands.Login;

public class LoginHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IDueQContext _context;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenGenerator _tokens;

    public LoginHandler(IDueQContext context, IPasswordHasher hasher, IJwtTokenGenerator tokens)
    {
        _context = context;
        _hasher = hasher;
        _tokens = tokens;
    }

    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        if (user is null || !_hasher.Verify(request.Password, user.PasswordHash))
        {
            throw new ValidationException(new[]
            {
                new ValidationFailure("Credentials", "Email or password is incorrect"),
            });
        }

        var token = _tokens.Generate(user);
        return new LoginResult(token, new UserDto(user.Id, user.Email, user.Name));
    }
}

using DueQ.Domain.Users;

namespace DueQ.Application.Abstractions;

public interface IJwtTokenGenerator
{
    string Generate(User user);
}

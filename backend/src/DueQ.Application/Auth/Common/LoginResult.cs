namespace DueQ.Application.Auth.Common;

public record UserDto(Guid Id, string Email, string Name);

public record LoginResult(string Token, UserDto User);

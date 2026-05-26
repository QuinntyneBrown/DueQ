using DocQ.Cli.Services;
using Microsoft.Extensions.DependencyInjection;
using System.CommandLine;

namespace DocQ.Cli.Commands;

public sealed class AddUserCommand : ICommandDefinition
{
    private readonly ICommandExecutor _executor;

    private readonly Option<string> _nameOption = new("--name")
    {
        Description = "Display name for the new user.",
        Required = true,
    };

    private readonly Option<string> _emailOption = new("--email")
    {
        Description = "Email address (will be lower-cased before storage; must be unique).",
        Required = true,
    };

    private readonly Option<string> _passwordOption = new("--password")
    {
        Description = "Plaintext password to hash with BCrypt (min 8 chars).",
        Required = true,
    };

    private readonly Option<bool> _overwriteOption = new("--overwrite")
    {
        Description = "If a user with the email already exists, replace its name and password instead of failing.",
    };

    public AddUserCommand(ICommandExecutor executor)
    {
        _executor = executor;
    }

    public Command Build()
    {
        var command = new Command(
            "add-user",
            "Insert (or upsert with --overwrite) a user into the configured DueQ database with a BCrypt-hashed password.");
        command.Options.Add(_nameOption);
        command.Options.Add(_emailOption);
        command.Options.Add(_passwordOption);
        command.Options.Add(_overwriteOption);

        command.SetAction((parseResult, cancellationToken) =>
            _executor.ExecuteAsync(async (serviceProvider, ct) =>
            {
                var name = parseResult.GetValue(_nameOption)!;
                var email = parseResult.GetValue(_emailOption)!;
                var password = parseResult.GetValue(_passwordOption)!;
                var overwrite = parseResult.GetValue(_overwriteOption);

                var service = serviceProvider.GetRequiredService<IAddUserService>();
                var (user, updated) = await service.AddAsync(name, email, password, overwrite, ct);

                var verb = updated ? "Updated existing" : "Added";
                serviceProvider.GetRequiredService<ICliConsole>()
                    .WriteLine($"{verb} user {user.Email} ({user.Id}).");
                return 0;
            }, cancellationToken));

        return command;
    }
}

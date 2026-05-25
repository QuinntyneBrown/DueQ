using DocQ.Cli.Services;
using Microsoft.Extensions.DependencyInjection;
using System.CommandLine;

namespace DocQ.Cli.Commands;

public sealed class ResetDatabaseCommand : ICommandDefinition
{
    private readonly ICommandExecutor _executor;
    private readonly Option<bool> _yesOption = new("--yes", "-y")
    {
        Description = "Confirm the destructive reset."
    };
    private readonly Option<bool> _skipSeedOption = new("--skip-seed")
    {
        Description = "Recreate the schema without loading the default fresh-install seed data."
    };

    public ResetDatabaseCommand(ICommandExecutor executor)
    {
        _executor = executor;
    }

    public Command Build()
    {
        var command = new Command("reset-database", "Drop, recreate, and optionally seed the configured database.");
        command.Options.Add(_yesOption);
        command.Options.Add(_skipSeedOption);
        command.SetAction((parseResult, cancellationToken) =>
            _executor.ExecuteAsync(async (serviceProvider, ct) =>
            {
                if (!parseResult.GetValue(_yesOption))
                {
                    throw new CliUsageException("Refusing to reset the database without --yes.");
                }

                var seed = !parseResult.GetValue(_skipSeedOption);
                var resetter = serviceProvider.GetRequiredService<IDatabaseResetService>();
                await resetter.ResetAsync(seed, ct);

                var mode = seed ? "with fresh-install seed data" : "without seed data";
                serviceProvider.GetRequiredService<ICliConsole>()
                    .WriteLine($"Database reset complete {mode}.");
                return 0;
            }, cancellationToken));

        return command;
    }
}

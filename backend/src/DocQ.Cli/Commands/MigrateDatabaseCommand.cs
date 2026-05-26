using DocQ.Cli.Services;
using Microsoft.Extensions.DependencyInjection;
using System.CommandLine;

namespace DocQ.Cli.Commands;

public sealed class MigrateDatabaseCommand : ICommandDefinition
{
    private readonly ICommandExecutor _executor;

    public MigrateDatabaseCommand(ICommandExecutor executor)
    {
        _executor = executor;
    }

    public Command Build()
    {
        var command = new Command(
            "migrate-database",
            "Apply any pending EF Core migrations to the configured DueQ database.");

        command.SetAction((parseResult, cancellationToken) =>
            _executor.ExecuteAsync(async (serviceProvider, ct) =>
            {
                var console = serviceProvider.GetRequiredService<ICliConsole>();
                var migrator = serviceProvider.GetRequiredService<IMigrateDatabaseService>();
                var (applied, pending) = await migrator.MigrateAsync(ct);

                if (pending.Count == 0)
                {
                    console.WriteLine("No pending migrations. Database already up to date.");
                }
                else
                {
                    console.WriteLine($"Applied {pending.Count} migration(s):");
                    foreach (var name in pending)
                    {
                        console.WriteLine($"  - {name}");
                    }
                }

                console.WriteLine($"Total applied migrations: {applied.Count}.");
                return 0;
            }, cancellationToken));

        return command;
    }
}

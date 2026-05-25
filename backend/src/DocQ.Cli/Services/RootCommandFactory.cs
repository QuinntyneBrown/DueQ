using DocQ.Cli.Commands;
using System.CommandLine;

namespace DocQ.Cli.Services;

public sealed class RootCommandFactory
{
    private readonly IEnumerable<ICommandDefinition> _commands;
    private readonly Option<string?> _connectionStringOption = new("--connection-string", "--connection")
    {
        Description = "Override ConnectionStrings:DueQ for this invocation.",
        Recursive = true
    };

    private readonly Option<string?> _targetOption = new("--target")
    {
        Description = "Database target: 'local' (default, SqlExpress) or 'azure' (uses ConnectionStrings:DueQ-Azure from user secrets).",
        Recursive = true
    };

    public RootCommandFactory(IEnumerable<ICommandDefinition> commands)
    {
        _commands = commands;
    }

    public RootCommand Create()
    {
        var root = new RootCommand("DocQ command line tools for DueQ data.");
        root.Options.Add(_connectionStringOption);
        root.Options.Add(_targetOption);

        foreach (var command in _commands)
        {
            root.Subcommands.Add(command.Build());
        }

        return root;
    }
}

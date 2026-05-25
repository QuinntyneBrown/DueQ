using System.CommandLine;

namespace DocQ.Cli.Commands;

public interface ICommandDefinition
{
    Command Build();
}

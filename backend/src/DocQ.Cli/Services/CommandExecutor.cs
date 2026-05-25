using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DocQ.Cli.Services;

public interface ICommandExecutor
{
    Task<int> ExecuteAsync(
        Func<IServiceProvider, CancellationToken, Task<int>> command,
        CancellationToken cancellationToken);
}

public sealed class CommandExecutor : ICommandExecutor
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ICliConsole _console;
    private readonly ILogger<CommandExecutor> _logger;

    public CommandExecutor(
        IServiceScopeFactory scopeFactory,
        ICliConsole console,
        ILogger<CommandExecutor> logger)
    {
        _scopeFactory = scopeFactory;
        _console = console;
        _logger = logger;
    }

    public async Task<int> ExecuteAsync(
        Func<IServiceProvider, CancellationToken, Task<int>> command,
        CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            return await command(scope.ServiceProvider, cancellationToken);
        }
        catch (CliUsageException ex)
        {
            _console.WriteErrorLine(ex.Message);
            return 2;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CLI command failed.");
            _console.WriteErrorLine($"Command failed: {ex.Message}");
            return 1;
        }
    }
}

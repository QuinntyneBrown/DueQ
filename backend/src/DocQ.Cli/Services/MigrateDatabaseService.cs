using DueQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DocQ.Cli.Services;

public interface IMigrateDatabaseService
{
    Task<(IReadOnlyList<string> Applied, IReadOnlyList<string> Pending)> MigrateAsync(
        CancellationToken cancellationToken);
}

public sealed class MigrateDatabaseService : IMigrateDatabaseService
{
    private readonly DueQContext _context;

    public MigrateDatabaseService(DueQContext context)
    {
        _context = context;
    }

    public async Task<(IReadOnlyList<string> Applied, IReadOnlyList<string> Pending)> MigrateAsync(
        CancellationToken cancellationToken)
    {
        var pending = (await _context.Database.GetPendingMigrationsAsync(cancellationToken)).ToList();
        await _context.Database.MigrateAsync(cancellationToken);
        var applied = (await _context.Database.GetAppliedMigrationsAsync(cancellationToken)).ToList();
        return (applied, pending);
    }
}

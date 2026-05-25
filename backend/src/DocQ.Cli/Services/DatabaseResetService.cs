using DueQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DocQ.Cli.Services;

public interface IDatabaseResetService
{
    Task ResetAsync(bool seed, CancellationToken cancellationToken);
}

public sealed class DatabaseResetService : IDatabaseResetService
{
    private readonly DueQContext _context;

    public DatabaseResetService(DueQContext context)
    {
        _context = context;
    }

    public async Task ResetAsync(bool seed, CancellationToken cancellationToken)
    {
        await _context.Database.EnsureDeletedAsync(cancellationToken);
        await _context.Database.MigrateAsync(cancellationToken);

        if (seed)
        {
            await DueQContextSeeder.ResetAndSeedAsync(_context, cancellationToken);
        }
    }
}

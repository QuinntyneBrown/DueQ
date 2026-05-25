using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DueQ.Infrastructure.Persistence;

public class DueQContextDesignTimeFactory : IDesignTimeDbContextFactory<DueQContext>
{
    public DueQContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<DueQContext>()
            .UseSqlite(
                "Data Source=dueq.db",
                sqlite => sqlite.MigrationsAssembly(typeof(DueQContext).Assembly.FullName))
            .Options;

        return new DueQContext(options);
    }
}

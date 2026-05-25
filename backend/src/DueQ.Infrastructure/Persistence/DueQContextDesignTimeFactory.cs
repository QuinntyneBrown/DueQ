using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DueQ.Infrastructure.Persistence;

public class DueQContextDesignTimeFactory : IDesignTimeDbContextFactory<DueQContext>
{
    public DueQContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<DueQContext>()
            .UseSqlServer(
                "Server=.\\SQLEXPRESS;Database=DueQ;Trusted_Connection=True;TrustServerCertificate=True",
                sql => sql.MigrationsAssembly(typeof(DueQContext).Assembly.FullName))
            .Options;

        return new DueQContext(options);
    }
}

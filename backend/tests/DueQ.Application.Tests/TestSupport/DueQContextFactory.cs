using DueQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace DueQ.Application.Tests.TestSupport;

public static class DueQContextFactory
{
    public static DueQContext Create()
    {
        var options = new DbContextOptionsBuilder<DueQContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        return new DueQContext(options);
    }
}

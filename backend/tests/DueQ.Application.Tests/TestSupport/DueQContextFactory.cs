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

        var context = new DueQContext(options);
        // EnsureCreated applies HasData seeds (e.g. the dev User) under the
        // in-memory provider so handlers that depend on seed rows can be tested
        // without manual setup.
        context.Database.EnsureCreated();
        return context;
    }
}

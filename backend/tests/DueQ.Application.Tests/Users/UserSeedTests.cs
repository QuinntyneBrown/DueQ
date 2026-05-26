using DueQ.Application.Tests.TestSupport;
using DueQ.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Tests.Users;

public class UserSeedTests
{
    [Fact]
    public async Task Dev_seed_provisions_quinntyne_brown_user_via_HasData()
    {
        using var context = DueQContextFactory.Create();

        // EF Core's InMemory provider applies HasData on first model creation,
        // so the seeded row is present without calling Migrate/EnsureCreated.
        var dev = await context.Users.SingleAsync(u => u.Email == "quinntynebrown@gmail.com");

        Assert.Equal("Quinntyne Brown", dev.Name);
        Assert.False(string.IsNullOrEmpty(dev.PasswordHash));
        Assert.StartsWith("$2", dev.PasswordHash);
    }
}

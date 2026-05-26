using DueQ.Application.Abstractions;
using DueQ.Domain.Bills;
using DueQ.Domain.Households;
using DueQ.Domain.Payments;
using DueQ.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Infrastructure.Persistence;

public class DueQContext : DbContext, IDueQContext
{
    public DueQContext(DbContextOptions<DueQContext> options) : base(options)
    {
    }

    public DbSet<Household> Households => Set<Household>();
    public DbSet<Bill> Bills => Set<Bill>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<User> Users => Set<User>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DueQContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

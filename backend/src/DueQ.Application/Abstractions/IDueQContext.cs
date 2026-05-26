using DueQ.Domain.Bills;
using DueQ.Domain.Households;
using DueQ.Domain.Payments;
using DueQ.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Abstractions;

public interface IDueQContext
{
    DbSet<Household> Households { get; }
    DbSet<Bill> Bills { get; }
    DbSet<Payment> Payments { get; }
    DbSet<User> Users { get; }
    DbSet<PasswordResetToken> PasswordResetTokens { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

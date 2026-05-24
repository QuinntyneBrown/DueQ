using DueQ.Domain.Bills;
using DueQ.Domain.Households;
using DueQ.Domain.Payments;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Abstractions;

public interface IDueQContext
{
    DbSet<Household> Households { get; }
    DbSet<Bill> Bills { get; }
    DbSet<Payment> Payments { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

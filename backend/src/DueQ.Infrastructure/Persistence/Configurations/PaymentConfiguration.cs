using DueQ.Domain.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DueQ.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Amount).HasPrecision(18, 2);
        builder.Property(p => p.Date).IsRequired();
        builder.Property(p => p.Method).HasConversion<int>();
        builder.Property(p => p.Note).HasMaxLength(1000);
        builder.Property(p => p.CreatedAt).IsRequired();

        builder.HasIndex(p => p.Date);
    }
}

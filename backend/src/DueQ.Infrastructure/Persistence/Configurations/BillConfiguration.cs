using DueQ.Domain.Bills;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DueQ.Infrastructure.Persistence.Configurations;

public class BillConfiguration : IEntityTypeConfiguration<Bill>
{
    public void Configure(EntityTypeBuilder<Bill> builder)
    {
        builder.ToTable("Bills");
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Description).IsRequired().HasMaxLength(200);
        builder.Property(b => b.Amount).HasPrecision(18, 2);
        builder.Property(b => b.Date).IsRequired();
        builder.Property(b => b.Note).HasMaxLength(1000);
        builder.Property(b => b.Status).HasConversion<int>();
        builder.Property(b => b.CreatedAt).IsRequired();

        builder.HasIndex(b => b.Date);
        builder.HasIndex(b => b.Status);
    }
}

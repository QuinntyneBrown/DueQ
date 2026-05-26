using DueQ.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DueQ.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    // Dev-only seed. The BCrypt hash below is for the plaintext "password123";
    // it is committed only because this account is the deterministic login the
    // local dev environment and Playwright suite both rely on. Replace before
    // any non-development deployment.
    private const string DevUserId = "11111111-1111-1111-1111-111111111111";
    private const string DevEmail = "quinntynebrown@gmail.com";
    private const string DevName = "Quinntyne Brown";
    private const string DevPasswordHash =
        "$2a$11$tAIORAVHb3Do23LwSg6McecLESIobj0IqukTcC1l9Vsx5m9NLJXXu";

    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email).IsRequired().HasMaxLength(254);
        builder.Property(u => u.Name).IsRequired().HasMaxLength(100);
        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(200);
        builder.Property(u => u.CreatedUtc).IsRequired();

        builder.HasIndex(u => u.Email).IsUnique();

        builder.HasData(new User
        {
            Id = Guid.Parse(DevUserId),
            Email = DevEmail,
            Name = DevName,
            PasswordHash = DevPasswordHash,
            CreatedUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    }
}

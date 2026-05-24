using DueQ.Application.Abstractions;
using DueQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DueQ.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DueQ")
            ?? throw new InvalidOperationException("Connection string 'DueQ' is not configured.");

        services.AddDbContext<DueQContext>(options =>
            options.UseSqlServer(connectionString, sql =>
            {
                sql.MigrationsAssembly(typeof(DueQContext).Assembly.FullName);
            }));

        services.AddScoped<IDueQContext>(sp => sp.GetRequiredService<DueQContext>());

        return services;
    }
}

using DocQ.Cli.Commands;
using DocQ.Cli.Services;
using Microsoft.Extensions.DependencyInjection;

namespace DocQ.Cli.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDocQCli(this IServiceCollection services)
    {
        services.AddSingleton<RootCommandFactory>();
        services.AddSingleton<ICommandDefinition, ExportBillsCommand>();
        services.AddSingleton<ICommandDefinition, ExportPaymentsCommand>();
        services.AddSingleton<ICommandDefinition, ResetDatabaseCommand>();
        services.AddSingleton<ICommandDefinition, AddUserCommand>();
        services.AddSingleton<ICommandDefinition, MigrateDatabaseCommand>();
        services.AddSingleton<ICommandExecutor, CommandExecutor>();
        services.AddSingleton<ICliConsole, CliConsole>();
        services.AddSingleton<ICsvFileWriter, CsvFileWriter>();

        services.AddScoped<IBillCsvExporter, BillCsvExporter>();
        services.AddScoped<IPaymentCsvExporter, PaymentCsvExporter>();
        services.AddScoped<IDatabaseResetService, DatabaseResetService>();
        services.AddScoped<IAddUserService, AddUserService>();
        services.AddScoped<IMigrateDatabaseService, MigrateDatabaseService>();

        return services;
    }
}

using Microsoft.Extensions.Configuration;

namespace DocQ.Cli.Configuration;

public static class ConfigurationExtensions
{
    private const string DueQConnectionStringKey = "ConnectionStrings:DueQ";
    private const string AzureConnectionStringKey = "ConnectionStrings:DueQ-Azure";
    private const string DefaultLocalConnectionString =
        "Server=.\\SQLEXPRESS;Database=DueQ;Trusted_Connection=True;TrustServerCertificate=True";

    /// <summary>
    /// Resolves the connection string the CLI uses, in this precedence (lowest → highest):
    ///   1. local SqlExpress default (in-memory)
    ///   2. anything already in configuration (e.g. ConnectionStrings:DueQ from user secrets / env)
    ///   3. --target azure → promotes ConnectionStrings:DueQ-Azure (from user secrets) to :DueQ
    ///   4. --connection &lt;value&gt; → explicit override
    /// </summary>
    public static IConfigurationManager AddDueQConnectionStringDefaults(
        this IConfigurationManager configuration,
        string[] args)
    {
        if (string.IsNullOrWhiteSpace(configuration.GetConnectionString("DueQ")))
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                [DueQConnectionStringKey] = DefaultLocalConnectionString
            });
        }

        var target = CommandLineTargetReader.Read(args);
        if (string.Equals(target, CommandLineTargetReader.AzureTarget, StringComparison.OrdinalIgnoreCase))
        {
            var azureConnection = configuration[AzureConnectionStringKey];
            if (string.IsNullOrWhiteSpace(azureConnection))
            {
                throw new InvalidOperationException(
                    "--target azure was specified, but ConnectionStrings:DueQ-Azure is not configured. Run:\n" +
                    "  dotnet user-secrets set \"ConnectionStrings:DueQ-Azure\" \"<connection-string>\" --id dueq-docq-cli-c0d1f0");
            }
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                [DueQConnectionStringKey] = azureConnection
            });
        }

        var commandLineConnectionString = CommandLineConnectionStringReader.Read(args);
        if (!string.IsNullOrWhiteSpace(commandLineConnectionString))
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                [DueQConnectionStringKey] = commandLineConnectionString
            });
        }

        return configuration;
    }
}

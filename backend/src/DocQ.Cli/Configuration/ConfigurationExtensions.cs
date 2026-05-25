using Microsoft.Extensions.Configuration;

namespace DocQ.Cli.Configuration;

public static class ConfigurationExtensions
{
    private const string DueQConnectionStringKey = "ConnectionStrings:DueQ";
    private const string DefaultConnectionString = "Data Source=dueq.db";

    public static IConfigurationManager AddDueQConnectionStringDefaults(
        this IConfigurationManager configuration,
        string[] args)
    {
        if (string.IsNullOrWhiteSpace(configuration.GetConnectionString("DueQ")))
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                [DueQConnectionStringKey] = DefaultConnectionString
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

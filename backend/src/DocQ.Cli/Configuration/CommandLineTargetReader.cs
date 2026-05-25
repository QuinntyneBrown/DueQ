namespace DocQ.Cli.Configuration;

/// <summary>
/// Reads a `--target <local|azure>` flag from raw argv before System.CommandLine
/// parses the command. We need the target choice during configuration build-up so
/// the right connection string lands in <c>ConnectionStrings:DueQ</c>.
/// </summary>
public static class CommandLineTargetReader
{
    public const string LocalTarget = "local";
    public const string AzureTarget = "azure";

    public static string? Read(string[] args)
    {
        for (var i = 0; i < args.Length; i++)
        {
            var arg = args[i];

            if (arg.StartsWith("--target=", StringComparison.OrdinalIgnoreCase))
            {
                return arg["--target=".Length..];
            }

            if (arg.Equals("--target", StringComparison.OrdinalIgnoreCase) && i + 1 < args.Length)
            {
                return args[i + 1];
            }
        }

        return null;
    }
}

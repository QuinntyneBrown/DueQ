namespace DocQ.Cli.Configuration;

public static class CommandLineConnectionStringReader
{
    public static string? Read(string[] args)
    {
        for (var i = 0; i < args.Length; i++)
        {
            var arg = args[i];

            if (arg.StartsWith("--connection-string=", StringComparison.OrdinalIgnoreCase))
            {
                return arg["--connection-string=".Length..];
            }

            if (arg.StartsWith("--connection=", StringComparison.OrdinalIgnoreCase))
            {
                return arg["--connection=".Length..];
            }

            if ((arg.Equals("--connection-string", StringComparison.OrdinalIgnoreCase) ||
                 arg.Equals("--connection", StringComparison.OrdinalIgnoreCase)) &&
                i + 1 < args.Length)
            {
                return args[i + 1];
            }
        }

        return null;
    }
}

namespace DocQ.Cli.Services;

public sealed class CliUsageException : Exception
{
    public CliUsageException(string message) : base(message)
    {
    }
}

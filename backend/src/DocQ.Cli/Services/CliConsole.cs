namespace DocQ.Cli.Services;

public interface ICliConsole
{
    void WriteLine(string message);
    void WriteErrorLine(string message);
}

public sealed class CliConsole : ICliConsole
{
    public void WriteLine(string message)
    {
        Console.WriteLine(message);
    }

    public void WriteErrorLine(string message)
    {
        Console.Error.WriteLine(message);
    }
}

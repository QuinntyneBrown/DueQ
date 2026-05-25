using System.Text;

namespace DocQ.Cli.Services;

public interface ICsvFileWriter
{
    Task WriteAsync(
        FileInfo output,
        IReadOnlyList<string> header,
        IReadOnlyList<IReadOnlyList<string>> rows,
        CancellationToken cancellationToken);
}

public sealed class CsvFileWriter : ICsvFileWriter
{
    public async Task WriteAsync(
        FileInfo output,
        IReadOnlyList<string> header,
        IReadOnlyList<IReadOnlyList<string>> rows,
        CancellationToken cancellationToken)
    {
        if (output.Directory is { Exists: false } directory)
        {
            directory.Create();
        }

        await using var stream = output.Open(FileMode.Create, FileAccess.Write, FileShare.None);
        await using var writer = new StreamWriter(stream, new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

        await writer.WriteLineAsync(ToCsvLine(header.AsEnumerable()).AsMemory(), cancellationToken);

        foreach (var row in rows)
        {
            await writer.WriteLineAsync(ToCsvLine(row).AsMemory(), cancellationToken);
        }
    }

    private static string ToCsvLine(IEnumerable<string> fields)
    {
        return string.Join(",", fields.Select(Escape));
    }

    private static string Escape(string? value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return string.Empty;
        }

        var normalized = value.Replace("\r\n", "\n").Replace('\r', '\n');
        var mustQuote = normalized.Contains(',') ||
                        normalized.Contains('"') ||
                        normalized.Contains('\n');

        return mustQuote
            ? $"\"{normalized.Replace("\"", "\"\"")}\""
            : normalized;
    }
}

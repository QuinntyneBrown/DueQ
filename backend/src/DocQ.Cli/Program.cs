using DocQ.Cli.Configuration;
using DocQ.Cli.Extensions;
using DocQ.Cli.Services;
using DueQ.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.CommandLine;

var builder = Host.CreateApplicationBuilder(args);

builder.Configuration.AddUserSecrets(typeof(Program).Assembly, optional: true, reloadOnChange: false);
builder.Configuration.AddDueQConnectionStringDefaults(args);
builder.Logging.SetMinimumLevel(LogLevel.Warning);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddDocQCli();

using var host = builder.Build();

var rootCommand = host.Services.GetRequiredService<RootCommandFactory>().Create();
var invocation = new InvocationConfiguration
{
    EnableDefaultExceptionHandler = false
};

try
{
    return await rootCommand.Parse(args).InvokeAsync(invocation, CancellationToken.None);
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Command failed: {ex.Message}");
    return 1;
}

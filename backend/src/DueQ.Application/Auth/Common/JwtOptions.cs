namespace DueQ.Application.Auth.Common;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = "DueQ";
    public string Audience { get; set; } = "DueQ";
    public int LifetimeMinutes { get; set; } = 60;
}

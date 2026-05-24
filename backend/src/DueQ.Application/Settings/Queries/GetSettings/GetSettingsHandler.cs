using DueQ.Application.Abstractions;
using DueQ.Application.Settings.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Settings.Queries.GetSettings;

public class GetSettingsHandler : IRequestHandler<GetSettingsQuery, SettingsDto>
{
    private readonly IDueQContext _context;

    public GetSettingsHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<SettingsDto> Handle(GetSettingsQuery request, CancellationToken cancellationToken)
    {
        var household = await _context.Households
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        return new SettingsDto
        {
            YourName = household?.YourName ?? string.Empty,
            PartnerName = household?.PartnerName ?? string.Empty
        };
    }
}

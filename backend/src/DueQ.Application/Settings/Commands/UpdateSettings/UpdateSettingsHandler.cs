using DueQ.Application.Abstractions;
using DueQ.Application.Settings.Dtos;
using DueQ.Domain.Households;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DueQ.Application.Settings.Commands.UpdateSettings;

public class UpdateSettingsHandler : IRequestHandler<UpdateSettingsCommand, SettingsDto>
{
    private readonly IDueQContext _context;

    public UpdateSettingsHandler(IDueQContext context)
    {
        _context = context;
    }

    public async Task<SettingsDto> Handle(UpdateSettingsCommand request, CancellationToken cancellationToken)
    {
        var household = await _context.Households.FirstOrDefaultAsync(cancellationToken);

        if (household is null)
        {
            household = new Household
            {
                Id = Guid.NewGuid(),
                YourName = request.YourName.Trim(),
                PartnerName = request.PartnerName.Trim()
            };
            _context.Households.Add(household);
        }
        else
        {
            household.YourName = request.YourName.Trim();
            household.PartnerName = request.PartnerName.Trim();
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new SettingsDto
        {
            YourName = household.YourName,
            PartnerName = household.PartnerName
        };
    }
}

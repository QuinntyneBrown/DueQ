using FluentValidation;

namespace DueQ.Application.Settings.Commands.UpdateSettings;

public class UpdateSettingsValidator : AbstractValidator<UpdateSettingsCommand>
{
    public UpdateSettingsValidator()
    {
        RuleFor(x => x.YourName)
            .NotEmpty()
            .MaximumLength(80);

        RuleFor(x => x.PartnerName)
            .NotEmpty()
            .MaximumLength(80);
    }
}

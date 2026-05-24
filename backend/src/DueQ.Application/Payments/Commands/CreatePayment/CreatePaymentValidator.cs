using FluentValidation;

namespace DueQ.Application.Payments.Commands.CreatePayment;

public class CreatePaymentValidator : AbstractValidator<CreatePaymentCommand>
{
    public CreatePaymentValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0m)
            .PrecisionScale(18, 2, ignoreTrailingZeros: true);

        RuleFor(x => x.Date).NotEmpty();

        RuleFor(x => x.Method).IsInEnum();

        RuleFor(x => x.Note).MaximumLength(1000);
    }
}

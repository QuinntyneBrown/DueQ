using FluentValidation;

namespace DueQ.Application.Bills.Commands.CreateBill;

public class CreateBillValidator : AbstractValidator<CreateBillCommand>
{
    public CreateBillValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Amount)
            .GreaterThan(0m)
            .PrecisionScale(18, 2, ignoreTrailingZeros: true);

        RuleFor(x => x.Date)
            .NotEmpty();

        RuleFor(x => x.Note)
            .MaximumLength(1000);
    }
}

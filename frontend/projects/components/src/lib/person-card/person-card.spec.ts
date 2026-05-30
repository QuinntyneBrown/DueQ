import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonCard } from './person-card';

describe('PersonCard', () => {
  let component: PersonCard;
  let fixture: ComponentFixture<PersonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('role', 'test-value');
    fixture.componentRef.setInput('initials', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

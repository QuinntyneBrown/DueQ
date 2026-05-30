import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stat } from './stat';

describe('Stat', () => {
  let component: Stat;
  let fixture: ComponentFixture<Stat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stat],
    }).compileComponents();

    fixture = TestBed.createComponent(Stat);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'test-value');
    fixture.componentRef.setInput('value', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

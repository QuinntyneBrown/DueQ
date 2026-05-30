import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavLink } from './nav-link';

describe('NavLink', () => {
  let component: NavLink;
  let fixture: ComponentFixture<NavLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavLink],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavLink);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'test-value');
    fixture.componentRef.setInput('label', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

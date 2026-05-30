import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavItem } from './nav-item';

describe('NavItem', () => {
  let component: NavItem;
  let fixture: ComponentFixture<NavItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavItem],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavItem);
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

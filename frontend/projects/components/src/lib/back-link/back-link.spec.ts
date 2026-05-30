import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BackLink } from './back-link';

describe('BackLink', () => {
  let component: BackLink;
  let fixture: ComponentFixture<BackLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackLink],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

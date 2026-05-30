import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarLarge } from './avatar-large';

describe('AvatarLarge', () => {
  let component: AvatarLarge;
  let fixture: ComponentFixture<AvatarLarge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarLarge],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarLarge);
    component = fixture.componentInstance;
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

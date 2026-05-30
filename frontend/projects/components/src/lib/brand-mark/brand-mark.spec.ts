import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandMark } from './brand-mark';

describe('BrandMark', () => {
  let component: BrandMark;
  let fixture: ComponentFixture<BrandMark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandMark],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandMark);
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

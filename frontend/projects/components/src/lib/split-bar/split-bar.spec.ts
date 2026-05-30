import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplitBar } from './split-bar';

describe('SplitBar', () => {
  let component: SplitBar;
  let fixture: ComponentFixture<SplitBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitBar],
    }).compileComponents();

    fixture = TestBed.createComponent(SplitBar);
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

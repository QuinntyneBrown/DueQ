import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewBlock } from './preview-block';

describe('PreviewBlock', () => {
  let component: PreviewBlock;
  let fixture: ComponentFixture<PreviewBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewBlock);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'test-value');
    fixture.componentRef.setInput('amount', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

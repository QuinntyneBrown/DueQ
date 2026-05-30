import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHead } from './section-head';

describe('SectionHead', () => {
  let component: SectionHead;
  let fixture: ComponentFixture<SectionHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHead],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHead);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

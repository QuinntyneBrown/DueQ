import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyValueRow } from './key-value-row';

describe('KeyValueRow', () => {
  let component: KeyValueRow;
  let fixture: ComponentFixture<KeyValueRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueRow],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueRow);
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

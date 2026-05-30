import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyValueList } from './key-value-list';

describe('KeyValueList', () => {
  let component: KeyValueList;
  let fixture: ComponentFixture<KeyValueList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueList],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueList);
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

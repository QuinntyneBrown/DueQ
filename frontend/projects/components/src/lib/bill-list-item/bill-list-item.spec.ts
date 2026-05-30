import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BillListItem } from './bill-list-item';

describe('BillListItem', () => {
  let component: BillListItem;
  let fixture: ComponentFixture<BillListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillListItem],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillListItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('bill', {} as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should call linkTarget without throwing', () => {
    expect(() => component.linkTarget()).not.toThrow();
  });

  it('should call statusKind without throwing', () => {
    expect(() => component.statusKind()).not.toThrow();
  });

  it('should call statusLabel without throwing', () => {
    expect(() => component.statusLabel()).not.toThrow();
  });

  it('should call onClick without throwing', () => {
    expect(() => component.onClick()).not.toThrow();
  });

  it('should expose the clicked output', () => {
    expect(() => {
      const sub = component.clicked.subscribe(() => {});
      sub.unsubscribe();
    }).not.toThrow();
  });
});

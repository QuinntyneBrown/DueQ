import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconTile } from './icon-tile';

describe('IconTile', () => {
  let component: IconTile;
  let fixture: ComponentFixture<IconTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTile],
    }).compileComponents();

    fixture = TestBed.createComponent(IconTile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

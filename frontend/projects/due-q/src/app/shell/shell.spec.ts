import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { SETTINGS_SERVICE } from 'api';
import { Shell } from './shell';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let mockSETTINGS_SERVICE: any;

  beforeEach(async () => {
    mockSETTINGS_SERVICE = {
      get: vi.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: SETTINGS_SERVICE, useValue: mockSETTINGS_SERVICE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});

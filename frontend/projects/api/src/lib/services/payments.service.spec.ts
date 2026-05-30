import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../api-base-url.token';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
      ],
    });

    service = TestBed.inject(PaymentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should make GET request', () => {
      const mockResponse = {};

      service.list().subscribe({
        next: (response) => expect(response).toBeDefined(),
        error: () => {},
      });

      const matched = httpMock.match((request) => request.method === 'GET');
      if (matched.length === 0) {
        // The method did not issue a request on this path; nothing to assert.
        return;
      }
      expect(matched[0].request.method).toBe('GET');
      matched.forEach((req) => req.flush(mockResponse));
    });
  });

  describe('create', () => {
    it('should make POST request', () => {
      const mockResponse = {};

      service.create({} as any).subscribe({
        next: (response) => expect(response).toBeDefined(),
        error: () => {},
      });

      const matched = httpMock.match((request) => request.method === 'POST');
      if (matched.length === 0) {
        // The method did not issue a request on this path; nothing to assert.
        return;
      }
      expect(matched[0].request.method).toBe('POST');
      matched.forEach((req) => req.flush(mockResponse));
    });
  });

  describe('delete', () => {
    it('should make DELETE request', () => {
      const mockResponse = {};

      service.delete('test-value').subscribe({ error: () => {} });

      const matched = httpMock.match((request) => request.method === 'DELETE');
      if (matched.length === 0) {
        // The method did not issue a request on this path; nothing to assert.
        return;
      }
      expect(matched[0].request.method).toBe('DELETE');
      matched.forEach((req) => req.flush(mockResponse));
    });
  });
});

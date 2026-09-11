import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { CustomerDto, CustomerSummaryDto, UpdateCustomerRequestDto } from '../../models/customers/customer.model';
import { PagedResult } from '../../models/common/paged-result.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getCustomerById(id: number): Observable<CustomerDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<CustomerDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.customers.byId(id)}`);
    }
    return of(this.mockData.customers.find(c => (c.id ?? c.customerId) === id) || this.mockData.customers[0]);
  }

  updateProfile(idOrRequest: number | any, maybeRequest?: any): Observable<CustomerDto> {
    let id = 1;
    let request: any;
    if (typeof idOrRequest === 'number') {
      id = idOrRequest;
      request = maybeRequest || {};
    } else {
      request = idOrRequest || {};
    }

    if (!request.firstName && request.fullName) {
      const parts = request.fullName.trim().split(' ');
      request.firstName = parts[0] || '';
      request.lastName = parts.slice(1).join(' ') || '';
    }
    if (!request.phone && request.phoneNumber) {
      request.phone = request.phoneNumber;
    }

    if (!API_CONFIG.useMockData) {
      return this.http.put<CustomerDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.customers.update(id)}`, request);
    }
    return of(this.updateMockCustomer(id, request));
  }

  searchCustomers(search?: string, page = 1, pageSize = 10): Observable<PagedResult<CustomerSummaryDto>> {
    if (!API_CONFIG.useMockData) {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
      if (search) params = params.set('search', search);

      return this.http.get<PagedResult<CustomerSummaryDto>>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.customers.search}`, { params });
    }
    return of(this.getMockCustomers(search, page, pageSize));
  }

  getCustomers(query?: { search?: string; searchTerm?: string; page?: number; pageNumber?: number; pageSize?: number; status?: string }): Observable<PagedResult<CustomerSummaryDto>> {
    const search = query?.searchTerm ?? query?.search;
    const page = query?.pageNumber ?? query?.page ?? 1;
    const pageSize = query?.pageSize ?? 10;
    return this.searchCustomers(search, page, pageSize);
  }

  deactivateCustomer(id: number): Observable<void> {
    if (!API_CONFIG.useMockData) {
      return this.http.delete<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.customers.deactivate(id)}`);
    }
    const cust = this.mockData.customers.find(c => (c.id ?? c.customerId) === id);
    if (cust) cust.isActive = false;
    return of(void 0);
  }

  reactivateCustomer(id: number): Observable<void> {
    const cust = this.mockData.customers.find(c => (c.id ?? c.customerId) === id);
    if (cust) cust.isActive = true;
    return of(void 0);
  }

  private updateMockCustomer(id: number, request: UpdateCustomerRequestDto): CustomerDto {
    const cust = this.mockData.customers.find(c => (c.id ?? c.customerId) === id) || this.mockData.customers[0];
    if (request.firstName) cust.firstName = request.firstName;
    if (request.lastName) cust.lastName = request.lastName;
    if (request.email) cust.email = request.email;
    if (request.phone) cust.phone = request.phone;
    return cust;
  }

  private getMockCustomers(search?: string, page = 1, pageSize = 10): PagedResult<CustomerSummaryDto> {
    let items: CustomerSummaryDto[] = this.mockData.customers.map(c => {
      const id = Number(c.id ?? c.customerId ?? 1);
      return {
        id: id,
        customerId: id,
        firstName: c.firstName,
        lastName: c.lastName,
        fullName: `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone || '',
        phoneNumber: c.phone || '',
        isEmailVerified: c.isEmailVerified,
        isActive: c.isActive,
        bookingCount: c.bookingCount ?? c.bookingsCount ?? 0,
        bookingsCount: c.bookingCount ?? c.bookingsCount ?? 0
      };
    });

    if (search) {
      const term = search.toLowerCase();
      items = items.filter(c => (c.fullName || '').toLowerCase().includes(term) || (c.email || '').toLowerCase().includes(term));
    }

    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: pagedItems,
      page,
      pageNumber: page,
      pageSize,
      totalCount,
      total: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  }
}

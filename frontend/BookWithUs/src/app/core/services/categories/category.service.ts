import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../../models/categories/event-category.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getCategories(): Observable<CategoryDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<CategoryDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.categories.base}`).pipe(
        catchError(() => of(this.mockData.categories))
      );
    }
    return of(this.mockData.categories);
  }

  getCategoryById(id: number): Observable<CategoryDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<CategoryDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.categories.byId(id)}`).pipe(
        catchError(() => of(this.mockData.categories.find(c => c.id === id) || this.mockData.categories[0]))
      );
    }
    return of(this.mockData.categories.find(c => c.id === id) || this.mockData.categories[0]);
  }

  createCategory(request: CreateCategoryDto): Observable<CategoryDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<CategoryDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.categories.base}`, request).pipe(
        catchError(() => of(this.createMockCategory(request)))
      );
    }
    return of(this.createMockCategory(request));
  }

  updateCategory(id: number, request: UpdateCategoryDto): Observable<CategoryDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.put<CategoryDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.categories.byId(id)}`, request).pipe(
        catchError(() => of(this.updateMockCategory(id, request)))
      );
    }
    return of(this.updateMockCategory(id, request));
  }

  deleteCategory(id: number): Observable<void> {
    if (!API_CONFIG.useMockData) {
      return this.http.delete<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.categories.byId(id)}`).pipe(
        catchError(() => {
          this.mockData.categories = this.mockData.categories.filter(c => c.id !== id);
          return of(void 0);
        })
      );
    }
    this.mockData.categories = this.mockData.categories.filter(c => c.id !== id);
    return of(void 0);
  }

  private createMockCategory(request: CreateCategoryDto): CategoryDto {
    const newCat: CategoryDto = {
      id: this.mockData.categories.length + 1,
      name: request.name,
      eventsCount: 0,
      createdAtUtc: new Date().toISOString()
    };
    this.mockData.categories.push(newCat);
    return newCat;
  }

  private updateMockCategory(id: number, request: UpdateCategoryDto): CategoryDto {
    const cat = this.mockData.categories.find(c => c.id === id);
    if (cat) {
      cat.name = request.name;
      return cat;
    }
    return this.mockData.categories[0];
  }
}

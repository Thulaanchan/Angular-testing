import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../core/services/events/event.service';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { EventSummaryDto, EventQueryParametersDto } from '../../../../core/models/events/event.model';
import { CategoryDto } from '../../../../core/models/categories/category.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-event-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent
  ],
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.css']
})
export class EventListPageComponent implements OnInit {
  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  events: EventSummaryDto[] = [];
  featuredEvents: EventSummaryDto[] = [];
  categories: CategoryDto[] = [];

  isLoading = true;
  selectedCategoryId: number | null = null;
  searchTerm = '';
  sortBy = 'date'; // 'date' | 'priceAsc' | 'priceDesc' | 'popular'

  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalCount = 0;

  activeHeroIndex = 0;

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: () => {}
    });
  }

  loadEvents(): void {
    this.isLoading = true;
    const params: EventQueryParametersDto = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      categoryId: this.selectedCategoryId || undefined,
      sortBy: this.sortBy
    };

    this.eventService.getEvents(params).subscribe({
      next: (res) => {
        this.events = res.items;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.currentPage = res.pageNumber;
        if (this.featuredEvents.length === 0 && res.items.length > 0) {
          this.featuredEvents = res.items.slice(0, 3);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onCategorySelect(categoryId: number | null | undefined): void {
    this.selectedCategoryId = categoryId ?? null;
    this.currentPage = 1;
    this.loadEvents();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadEvents();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  bookEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }
}

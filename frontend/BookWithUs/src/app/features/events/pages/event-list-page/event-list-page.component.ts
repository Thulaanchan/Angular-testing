import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../core/services/events/event.service';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { VenueService } from '../../../../core/services/venues/venue.service';
import { EventSummaryDto, EventQueryDto } from '../../../../core/models/events/event.model';
import { CategoryDto } from '../../../../core/models/categories/category.model';
import { VenueDto } from '../../../../core/models/venues/venue.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-event-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent,
    AlertBannerComponent
  ],
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.css']
})
export class EventListPageComponent implements OnInit {
  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);
  private venueService = inject(VenueService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  events: EventSummaryDto[] = [];
  featuredEvent: EventSummaryDto | null = null;
  categories: CategoryDto[] = [];
  venues: VenueDto[] = [];

  isLoading = true;
  errorMessage = '';

  selectedCategoryId: number | null = null;
  selectedVenueId: number | null = null;
  selectedDate = '';
  searchTerm = '';
  sortBy = 'date';

  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalCount = 0;

  ngOnInit(): void {
    this.loadCategories();
    this.loadVenues();

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.selectedCategoryId = params['category'] ? Number(params['category']) : null;
      this.selectedVenueId = params['venue'] ? Number(params['venue']) : null;
      this.selectedDate = params['date'] || '';
      this.currentPage = params['page'] ? Math.max(1, Number(params['page'])) : 1;
      this.loadEvents();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res || [];
      },
      error: () => {}
    });
  }

  loadVenues(): void {
    this.venueService.getVenues().subscribe({
      next: (res) => {
        this.venues = res || [];
      },
      error: () => {}
    });
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const query: EventQueryDto = {
      search: this.searchTerm || undefined,
      category: this.selectedCategoryId || undefined,
      venue: this.selectedVenueId || undefined,
      date: this.selectedDate || undefined,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.eventService.getEvents(query).subscribe({
      next: (res) => {
        this.events = res.items || [];
        this.totalCount = res.totalCount ?? (res.items?.length || 0);
        this.totalPages = res.totalPages || Math.ceil(this.totalCount / this.pageSize) || 1;
        this.currentPage = res.page ?? this.currentPage;
        if (!this.featuredEvent && this.events.length > 0) {
          this.featuredEvent = this.events[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.detail || err?.error?.message || 'Unable to load events from server.';
      }
    });
  }

  onCategorySelect(categoryId: number | null | undefined): void {
    this.selectedCategoryId = categoryId ?? null;
    this.updateFilters({ category: this.selectedCategoryId, page: null });
  }

  onVenueSelect(venueId: number | null | undefined): void {
    this.selectedVenueId = venueId ?? null;
    this.updateFilters({ venue: this.selectedVenueId, page: null });
  }

  onDateChange(): void {
    this.updateFilters({ date: this.selectedDate || null, page: null });
  }

  onSearch(): void {
    this.updateFilters({ search: this.searchTerm || null, page: null });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.selectedVenueId = null;
    this.selectedDate = '';
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateFilters({ page: this.currentPage > 1 ? this.currentPage : null });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  updateFilters(changes: Record<string, any>): void {
    const qParams: Record<string, any> = {
      search: this.searchTerm || null,
      category: this.selectedCategoryId || null,
      venue: this.selectedVenueId || null,
      date: this.selectedDate || null,
      page: this.currentPage > 1 ? this.currentPage : null,
      ...changes
    };

    Object.keys(qParams).forEach(k => {
      if (qParams[k] === null || qParams[k] === undefined || qParams[k] === '') {
        delete qParams[k];
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: qParams
    });
  }

  formatTime(timeStr?: string): string {
    if (!timeStr) return '';
    try {
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80';
  }
}

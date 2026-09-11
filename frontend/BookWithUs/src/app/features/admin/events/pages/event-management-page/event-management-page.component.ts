import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../../core/services/events/event.service';
import { CategoryService } from '../../../../../core/services/categories/category.service';
import { VenueService } from '../../../../../core/services/venues/venue.service';
import { EventListItemDto } from '../../../../../core/models/events/event.model';
import { CategoryDto } from '../../../../../core/models/categories/category.model';
import { VenueDto } from '../../../../../core/models/venues/venue.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-event-management-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent,
    ModalComponent,
    AlertBannerComponent
  ],
  templateUrl: './event-management-page.component.html',
  styleUrls: ['./event-management-page.component.css']
})
export class EventManagementPageComponent implements OnInit {
  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);
  private venueService = inject(VenueService);
  private router = inject(Router);

  events: EventListItemDto[] = [];
  categories: CategoryDto[] = [];
  venues: VenueDto[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  searchTerm = '';
  selectedCategoryId: number | null = null;
  selectedVenueId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  selectedEvent: EventListItemDto | null = null;
  showDetailsModal = false;

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res => this.categories = res);
    this.venueService.getVenues().subscribe(res => this.venues = res);
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.eventService.getEvents({
      page: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      categoryId: this.selectedCategoryId || undefined,
      venueId: this.selectedVenueId || undefined
    }).subscribe({
      next: (res) => {
        this.events = res.items;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to load events.';
      }
    });
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadEvents();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents();
  }

  viewEvent(event: EventListItemDto): void {
    this.selectedEvent = event;
    this.showDetailsModal = true;
  }

  deleteEvent(event: EventListItemDto): void {
    if (!confirm(`Are you sure you want to delete event "${event.name || event.title}"?`)) {
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        this.successMessage = `Event "${event.name || event.title}" deleted successfully.`;
        this.loadEvents();
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = `Cannot delete event "${event.name || event.title}" because it has active customer bookings.`;
        } else {
          this.errorMessage = err.error?.message || err.message || `Failed to delete event "${event.name || event.title}".`;
        }
      }
    });
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=400&q=80';
  }
}

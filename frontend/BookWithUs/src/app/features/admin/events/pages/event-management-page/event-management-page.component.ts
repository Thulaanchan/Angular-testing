import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../../core/services/events/event.service';
import { CategoryService } from '../../../../../core/services/categories/category.service';
import { VenueService } from '../../../../../core/services/venues/venue.service';
import { EventSummaryDto, EventDetailsDto } from '../../../../../core/models/events/event.model';
import { CategoryDto } from '../../../../../core/models/categories/category.model';
import { VenueDto } from '../../../../../core/models/venues/venue.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

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
    ModalComponent
  ],
  templateUrl: './event-management-page.component.html',
  styleUrls: ['./event-management-page.component.css']
})
export class EventManagementPageComponent implements OnInit {
  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);
  private venueService = inject(VenueService);
  private router = inject(Router);

  events: EventSummaryDto[] = [];
  categories: CategoryDto[] = [];
  venues: VenueDto[] = [];
  isLoading = true;

  searchTerm = '';
  selectedCategoryId: number | null = null;
  selectedVenueId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  selectedEvent: EventSummaryDto | null = null;
  showDetailsModal = false;

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res => this.categories = res);
    this.venueService.getVenues().subscribe(res => this.venues = res);
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents({
      pageNumber: this.currentPage,
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
      error: () => {
        this.isLoading = false;
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

  viewEvent(event: EventSummaryDto): void {
    this.selectedEvent = event;
    this.showDetailsModal = true;
  }
}

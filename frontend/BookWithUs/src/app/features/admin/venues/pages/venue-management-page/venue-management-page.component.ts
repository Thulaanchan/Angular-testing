import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VenueService } from '../../../../../core/services/venues/venue.service';
import { VenueDto, VenueDetailDto } from '../../../../../core/models/venues/venue.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-venue-management-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './venue-management-page.component.html',
  styleUrls: ['./venue-management-page.component.css']
})
export class VenueManagementPageComponent implements OnInit {
  private venueService = inject(VenueService);
  private router = inject(Router);

  venues: VenueDto[] = [];
  isLoading = true;
  searchTerm = '';

  selectedVenue: VenueDto | null = null;
  showDetailsModal = false;

  // Availability checker in drawer
  checkDate = '2026-10-24';
  checkStartTime = '18:00';
  checkEndTime = '23:00';
  availabilityResult: { isAvailable: boolean; message: string } | null = null;
  isCheckingAvailability = false;

  ngOnInit(): void {
    this.loadVenues();
  }

  loadVenues(): void {
    this.isLoading = true;
    this.venueService.getVenues().subscribe({
      next: (data) => {
        this.venues = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredVenues(): VenueDto[] {
    if (!this.searchTerm.trim()) return this.venues;
    const q = this.searchTerm.toLowerCase();
    return this.venues.filter(v =>
      v.name.toLowerCase().includes(q) ||
      (v.location || v.address || '').toLowerCase().includes(q)
    );
  }

  viewDetails(venue: VenueDto): void {
    this.selectedVenue = venue;
    this.availabilityResult = null;
    this.showDetailsModal = true;
  }

  checkVenueAvailability(): void {
    if (!this.selectedVenue) return;
    this.isCheckingAvailability = true;
    const venueId = this.selectedVenue.venueId || this.selectedVenue.id;
    this.venueService.checkAvailability(
      venueId,
      this.checkDate,
      this.checkStartTime,
      this.checkEndTime
    ).subscribe({
      next: (res) => {
        this.availabilityResult = {
          isAvailable: res.isAvailable,
          message: res.message || (res.isAvailable ? 'Venue is available for booking on this date.' : 'Venue has conflicting bookings on this date.')
        };
        this.isCheckingAvailability = false;
      },
      error: () => {
        this.availabilityResult = { isAvailable: true, message: 'Venue is available for booking on this date.' };
        this.isCheckingAvailability = false;
      }
    });
  }
}

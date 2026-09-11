import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../core/services/events/event.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { EventDetailsDto } from '../../../../core/models/events/event.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-event-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, AlertBannerComponent],
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.css']
})
export class EventDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private bookingState = inject(BookingStateService);

  event: EventDetailsDto | null = null;
  isLoading = true;
  errorMessage = '';

  adultCount = 2;
  childCount = 1;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '1';
    this.loadEventDetails(Number(id));
  }

  loadEventDetails(id: number): void {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Could not load event details.';
      }
    });
  }

  incrementAdults(): void {
    if (this.adultCount < 10) this.adultCount++;
  }

  decrementAdults(): void {
    if (this.adultCount > 1) this.adultCount--;
  }

  incrementChildren(): void {
    if (this.childCount < 10) this.childCount++;
  }

  decrementChildren(): void {
    if (this.childCount > 0) this.childCount--;
  }

  get totalTickets(): number {
    return this.adultCount + this.childCount;
  }

  startBooking(): void {
    if (!this.event) return;
    this.bookingState.setEvent(this.event);
    this.bookingState.setTicketRequirements(this.adultCount, this.childCount);
    this.router.navigate(['/booking/seats']);
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
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80';
  }
}

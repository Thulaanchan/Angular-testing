import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeatService } from '../../../../../core/services/seats/seat.service';
import { EventService } from '../../../../../core/services/events/event.service';
import { SeatAvailabilityDto } from '../../../../../core/models/seats/seat.model';
import { EventDetailsDto } from '../../../../../core/models/events/event.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-admin-seat-map-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingSpinnerComponent,
    ModalComponent,
    AlertBannerComponent
  ],
  templateUrl: './admin-seat-map-page.component.html',
  styleUrls: ['./admin-seat-map-page.component.css']
})
export class AdminSeatMapPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seatService = inject(SeatService);
  private eventService = inject(EventService);

  event: EventDetailsDto | null = null;
  seats: SeatAvailabilityDto[] = [];
  sections: { name: string; tier: string; seats: SeatAvailabilityDto[] }[] = [];
  isLoading = true;

  selectedSeat: SeatAvailabilityDto | null = null;
  showSeatEditor = false;
  saveSuccess = false;

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id') || '1');
    this.eventService.getEventById(eventId).subscribe(ev => this.event = ev);
    this.loadSeats(eventId);
  }

  loadSeats(eventId: number): void {
    this.isLoading = true;
    this.seatService.getEventSeats(eventId).subscribe({
      next: (data) => {
        this.seats = data;
        this.groupSeatsBySection(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  groupSeatsBySection(allSeats: SeatAvailabilityDto[]): void {
    const map = new Map<string, { name: string; tier: string; seats: SeatAvailabilityDto[] }>();
    for (const seat of allSeats) {
      const secName = seat.sectionName || seat.tierName || 'General';
      if (!map.has(secName)) {
        map.set(secName, { name: secName, tier: seat.tierName || 'General', seats: [] });
      }
      map.get(secName)!.seats.push(seat);
    }
    this.sections = Array.from(map.values());
  }

  onSeatClick(seat: SeatAvailabilityDto): void {
    this.selectedSeat = { ...seat };
    this.showSeatEditor = true;
    this.saveSuccess = false;
  }

  saveSeatChanges(): void {
    if (!this.selectedSeat) return;
    const idx = this.seats.findIndex(s => (s.id || s.seatId) === (this.selectedSeat!.id || this.selectedSeat!.seatId));
    if (idx !== -1) {
      this.seats[idx] = { ...this.selectedSeat };
      this.groupSeatsBySection(this.seats);
    }
    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
      this.showSeatEditor = false;
    }, 1000);
  }
}

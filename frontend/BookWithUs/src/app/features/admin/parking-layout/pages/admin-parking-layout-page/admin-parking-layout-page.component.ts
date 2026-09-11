import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../../../../core/services/parking/parking.service';
import { EventService } from '../../../../../core/services/events/event.service';
import { ParkingAvailabilityDto } from '../../../../../core/models/parking/parking-slot.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-admin-parking-layout-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingSpinnerComponent,
    ModalComponent,
    AlertBannerComponent
  ],
  templateUrl: './admin-parking-layout-page.component.html',
  styleUrls: ['./admin-parking-layout-page.component.css']
})
export class AdminParkingLayoutPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private parkingService = inject(ParkingService);
  private eventService = inject(EventService);

  slots: ParkingAvailabilityDto[] = [];
  isLoading = true;
  selectedZone = 'all';

  // Selected slot for editor drawer
  selectedSlot: ParkingAvailabilityDto | null = null;
  showSlotEditor = false;
  saveSuccess = false;

  // Zone rates editor (LKR)
  carRate = 1500;
  vanRate = 2500;
  bikeRate = 500;
  threeWheelerRate = 800;
  ratesSaved = false;

  eventId = 2;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id') || '2');
    this.loadSlots(this.eventId);
  }

  loadSlots(eventId: number): void {
    this.isLoading = true;
    this.parkingService.getEventParkingSlots(eventId).subscribe({
      next: (data: ParkingAvailabilityDto[]) => {
        this.slots = data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredSlots(): ParkingAvailabilityDto[] {
    if (this.selectedZone === 'all') return this.slots;
    return this.slots.filter(s => s.zoneName.toLowerCase() === this.selectedZone.toLowerCase());
  }

  onSlotClick(slot: ParkingAvailabilityDto): void {
    this.selectedSlot = { ...slot };
    this.showSlotEditor = true;
    this.saveSuccess = false;
  }

  saveSlot(): void {
    if (!this.selectedSlot) return;
    const targetId = this.selectedSlot.slotId ?? this.selectedSlot.id;
    const idx = this.slots.findIndex(s => (s.slotId ?? s.id) === targetId);
    if (idx !== -1) {
      this.slots[idx] = { ...this.selectedSlot };
    }
    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
      this.showSlotEditor = false;
    }, 1000);
  }

  saveZoneRates(): void {
    this.ratesSaved = true;
    setTimeout(() => this.ratesSaved = false, 3000);
  }
}

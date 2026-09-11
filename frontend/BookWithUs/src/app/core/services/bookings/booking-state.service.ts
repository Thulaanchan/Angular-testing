import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { EventDetailsDto } from '../../models/events/event.model';
import { SeatAvailabilityDto } from '../../models/seats/seat.model';
import { ParkingAvailabilityDto } from '../../models/parking/parking-slot.model';
import { BookingDto } from '../../models/bookings/booking.model';
import { AttendeeType } from '../../models/bookings/attendee-type.model';

export interface SelectedSeatItem {
  seatId: number;
  seatCode: string;
  sectionName: string;
  rowLabel: string;
  seatNumber: number;
  originalPrice: number;
  price: number;
  attendeeType: AttendeeType | string;
  attendeeName?: string;
}

export interface BookingState {
  event: EventDetailsDto | null;
  adultCount: number;
  childCount: number;
  selectedSeats: SelectedSeatItem[];
  selectedParking: ParkingAvailabilityDto | null;
  createdBooking: BookingDto | null;
  holdSecondsRemaining: number;
  holdActive: boolean;
}

const INITIAL_STATE: BookingState = {
  event: null,
  adultCount: 2,
  childCount: 1,
  selectedSeats: [],
  selectedParking: null,
  createdBooking: null,
  holdSecondsRemaining: 15 * 60, // 15 minutes = 900 seconds
  holdActive: false
};

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  private stateSubject = new BehaviorSubject<BookingState>(this.loadState());
  public state$: Observable<BookingState> = this.stateSubject.asObservable();

  private timerSubscription: Subscription | null = null;

  constructor() {}

  public get currentState(): BookingState {
    return this.stateSubject.value;
  }

  public hasActiveSelection(): boolean {
    const s = this.stateSubject.value;
    return !!s.event && s.selectedSeats.length > 0;
  }

  public setEvent(event: EventDetailsDto): void {
    this.updateState({
      event,
      selectedSeats: [],
      selectedParking: null,
      createdBooking: null,
      holdSecondsRemaining: 15 * 60,
      holdActive: false
    });
  }

  public setTicketRequirements(adultCount: number, childCount: number): void {
    this.updateState({
      adultCount: Math.max(1, adultCount),
      childCount: Math.max(0, childCount)
    });
    this.recalculateSeatPrices();
  }

  public get totalSeatsRequired(): number {
    const s = this.stateSubject.value;
    return s.adultCount + s.childCount;
  }

  public toggleSeat(seat: SeatAvailabilityDto): boolean {
    const s = this.stateSubject.value;
    const seatId = seat.seatId ?? seat.id;
    const exists = s.selectedSeats.some(x => x.seatId === seatId);

    if (exists) {
      this.removeSeat(seatId);
      return false;
    } else {
      if (s.selectedSeats.length >= this.totalSeatsRequired) {
        return false; // Already reached limit
      }
      this.addSeat(seat);
      return true;
    }
  }

  public addSeat(seat: SeatAvailabilityDto): void {
    const s = this.stateSubject.value;
    const seatId = seat.seatId ?? seat.id;
    if (s.selectedSeats.some(x => x.seatId === seatId)) return;

    const basePrice = seat.price ?? seat.adultPrice ?? 0;
    // Assign attendee type based on adultCount vs childCount
    const currentAdults = s.selectedSeats.filter(x => x.attendeeType === AttendeeType.Adult).length;
    const attendeeType = currentAdults < s.adultCount ? AttendeeType.Adult : AttendeeType.Child;
    const price = attendeeType === AttendeeType.Child ? basePrice * 0.5 : basePrice;

    const newItem: SelectedSeatItem = {
      seatId: seatId,
      seatCode: seat.seatCode,
      sectionName: seat.sectionName || seat.tierName || 'Standard',
      rowLabel: seat.rowLabel,
      seatNumber: seat.seatNumber ?? seat.number,
      originalPrice: basePrice,
      price: price,
      attendeeType: attendeeType,
      attendeeName: ''
    };

    const newSeats = [...s.selectedSeats, newItem];
    this.updateState({ selectedSeats: newSeats });
    this.recalculateSeatPrices();
  }

  public removeSeat(seatId: number): void {
    const s = this.stateSubject.value;
    const newSeats = s.selectedSeats.filter(x => x.seatId !== seatId);
    this.updateState({ selectedSeats: newSeats });
    this.recalculateSeatPrices();
  }

  public clearSeats(): void {
    this.updateState({ selectedSeats: [] });
  }

  public selectParking(slot: ParkingAvailabilityDto | null): void {
    this.updateState({ selectedParking: slot });
  }

  public updateAttendeeName(seatId: number, name: string): void {
    const s = this.stateSubject.value;
    const updated = s.selectedSeats.map(seat => {
      if (seat.seatId === seatId) {
        return { ...seat, attendeeName: name };
      }
      return seat;
    });
    this.updateState({ selectedSeats: updated });
  }

  public setCreatedBooking(booking: BookingDto): void {
    this.updateState({ createdBooking: booking });
    this.startHoldTimer();
  }

  public get subtotalSeats(): number {
    return this.stateSubject.value.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  public get parkingFee(): number {
    return this.stateSubject.value.selectedParking?.fee || 0;
  }

  public get totalAmount(): number {
    return this.subtotalSeats + this.parkingFee;
  }

  public startHoldTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.updateState({ holdSecondsRemaining: 15 * 60, holdActive: true });

    this.timerSubscription = interval(1000).subscribe(() => {
      const remaining = this.stateSubject.value.holdSecondsRemaining - 1;
      if (remaining <= 0) {
        this.updateState({ holdSecondsRemaining: 0, holdActive: false });
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      } else {
        this.updateState({ holdSecondsRemaining: remaining });
      }
    });
  }

  public get formattedHoldTimer(): string {
    const rem = this.stateSubject.value.holdSecondsRemaining;
    const minutes = Math.floor(rem / 60);
    const seconds = rem % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  // 409 Conflict Handling for seats
  public handleSeatConflict(conflictingSeatIds: number[]): void {
    const s = this.stateSubject.value;
    const remainingSeats = s.selectedSeats.filter(seat => !conflictingSeatIds.includes(seat.seatId));
    this.updateState({ selectedSeats: remainingSeats });
    this.recalculateSeatPrices();
  }

  // 409 Conflict Handling for parking
  public handleParkingConflict(conflictingSlotId?: number): void {
    this.updateState({ selectedParking: null });
  }

  public resetFlow(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.updateState(INITIAL_STATE);
  }

  private recalculateSeatPrices(): void {
    const s = this.stateSubject.value;
    let adultsCounted = 0;

    const updated = s.selectedSeats.map(seat => {
      let attendeeType = AttendeeType.Adult;
      if (adultsCounted < s.adultCount) {
        attendeeType = AttendeeType.Adult;
        adultsCounted++;
      } else {
        attendeeType = AttendeeType.Child;
      }
      const price = attendeeType === AttendeeType.Child ? seat.originalPrice * 0.5 : seat.originalPrice;
      return { ...seat, attendeeType, price };
    });

    this.updateState({ selectedSeats: updated });
  }

  private updateState(partial: Partial<BookingState>): void {
    const updated = { ...this.stateSubject.value, ...partial };
    this.stateSubject.next(updated);
    this.saveState(updated);
  }

  private saveState(state: BookingState): void {
    try {
      sessionStorage.setItem('booking_flow_state', JSON.stringify(state));
    } catch {}
  }

  private loadState(): BookingState {
    try {
      const stored = sessionStorage.getItem('booking_flow_state');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return INITIAL_STATE;
  }
}

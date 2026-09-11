import { Injectable } from '@angular/core';
import { EventDetailsDto, EventListItemDto } from '../models/events/event.model';
import { VenueDto, VenueAvailabilityDto } from '../models/venues/venue.model';
import { CategoryDto } from '../models/categories/event-category.model';
import { CustomerDto, CustomerSummaryDto } from '../models/customers/customer.model';
import { BookingDto, BookingSummaryDto } from '../models/bookings/booking.model';
import { PaymentHistoryDto, PaymentReceiptDto, BookingPaymentDto } from '../models/payments/payment.model';
import { NotificationDto } from '../models/notifications/notification.model';
import { SeatAvailabilityDto } from '../models/seats/seat.model';
import { ParkingAvailabilityDto, ParkingSlotDto } from '../models/parking/parking-slot.model';
import { AdminDashboardSummaryDto, CustomerDashboardSummaryDto, RecentBookingDto, UpcomingEventDto } from '../models/dashboards/admin-dashboard.model';
import { BookingStatus } from '../models/bookings/booking-status.model';
import { PaymentStatus } from '../models/payments/payment-status.model';
import { PaymentMethod } from '../models/payments/payment-method.model';
import { SeatStatus } from '../models/seats/seat-status.model';
import { ParkingStatus } from '../models/parking/parking-status.model';
import { VehicleType } from '../models/parking/vehicle-type.model';
import { AttendeeType } from '../models/bookings/attendee-type.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Venues
  venues: VenueDto[] = [
    {
      id: 1,
      name: 'Unicom TIC',
      address: 'Jaffna, Sri Lanka',
      totalCapacity: 5000,
      upcomingEventsCount: 4,
      isAvailable: true,
      createdAtUtc: '2026-01-10T08:00:00Z'
    },
    {
      id: 2,
      name: 'Cinnamon Life',
      address: 'Colombo, Sri Lanka',
      totalCapacity: 4000,
      upcomingEventsCount: 3,
      isAvailable: true,
      createdAtUtc: '2026-01-15T08:00:00Z'
    },
    {
      id: 3,
      name: 'Jaffna Cultural Centre',
      address: 'Jaffna, Sri Lanka',
      totalCapacity: 1500,
      upcomingEventsCount: 2,
      isAvailable: true,
      createdAtUtc: '2026-01-20T08:00:00Z'
    },
    {
      id: 4,
      name: 'Nelum Pokuna Theatre',
      address: 'Colombo, Sri Lanka',
      totalCapacity: 1288,
      upcomingEventsCount: 5,
      isAvailable: false,
      createdAtUtc: '2026-01-25T08:00:00Z'
    },
    {
      id: 5,
      name: 'City Hall',
      address: 'Kandy, Sri Lanka',
      totalCapacity: 2000,
      upcomingEventsCount: 1,
      isAvailable: true,
      createdAtUtc: '2026-02-01T08:00:00Z'
    },
    {
      id: 6,
      name: 'BMICH Main Hall',
      address: 'Colombo, Sri Lanka',
      totalCapacity: 3000,
      upcomingEventsCount: 3,
      isAvailable: true,
      createdAtUtc: '2026-02-05T08:00:00Z'
    }
  ];

  // Categories
  categories: CategoryDto[] = [
    { id: 1, name: 'Music Concert', eventsCount: 8, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 2, name: 'Business & Networking', eventsCount: 4, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 3, name: 'Technology', eventsCount: 3, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 4, name: 'Cultural', eventsCount: 5, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 5, name: 'Sports', eventsCount: 2, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 6, name: 'Education', eventsCount: 1, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 7, name: 'Entertainment', eventsCount: 0, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 8, name: 'Community', eventsCount: 0, createdAtUtc: '2026-01-01T00:00:00Z' }
  ];

  // Customers
  customers: CustomerDto[] = [
    {
      id: 1,
      firstName: 'Leo',
      lastName: 'Thas',
      email: 'leo.thas@email.com',
      phone: '+94 77 123 4567',
      isEmailVerified: true,
      isActive: true,
      createdAt: '2026-02-15T09:00:00Z',
      bookingsCount: 4
    },
    {
      id: 2,
      firstName: 'Anna',
      lastName: 'Lee',
      email: 'anna.lee@email.com',
      phone: '+94 71 456 8921',
      isEmailVerified: true,
      isActive: true,
      createdAt: '2026-02-18T10:00:00Z',
      bookingsCount: 2
    },
    {
      id: 3,
      firstName: 'John',
      lastName: 'Silva',
      email: 'john.silva@email.com',
      phone: '+94 76 291 1145',
      isEmailVerified: true,
      isActive: false,
      createdAt: '2026-02-20T11:00:00Z',
      bookingsCount: 6
    },
    {
      id: 4,
      firstName: 'Sara',
      lastName: 'Kumar',
      email: 'sara.kumar@email.com',
      phone: '+94 75 332 8810',
      isEmailVerified: true,
      isActive: true,
      createdAt: '2026-02-22T14:00:00Z',
      bookingsCount: 3
    },
    {
      id: 5,
      firstName: 'Nimal',
      lastName: 'Perera',
      email: 'nimal.perera@email.com',
      phone: '+94 77 920 4711',
      isEmailVerified: false,
      isActive: true,
      createdAt: '2026-02-25T16:00:00Z',
      bookingsCount: 1
    },
    {
      id: 6,
      firstName: 'Kavya',
      lastName: 'Raj',
      email: 'kavya.raj@email.com',
      phone: '+94 74 511 3248',
      isEmailVerified: true,
      isActive: true,
      createdAt: '2026-03-01T08:30:00Z',
      bookingsCount: 5
    }
  ];

  // Events
  events: EventDetailsDto[] = [
    {
      id: 1,
      name: 'Rockstar Aniruth Musical Show - 2026',
      description: 'Get ready for an unforgettable night as Rockstar Aniruth takes the stage in 2026 with a power-packed live musical show! Experience chart-topping hits, stunning visuals, and an unmatched atmosphere that only a live concert can deliver. This is a major live music event designed for a premium audience experience.',
      venueId: 1,
      venueName: 'Unicom TIC',
      venueAddress: 'Jaffna, Sri Lanka',
      categoryId: 1,
      categoryName: 'Music Concert',
      eventDate: '2026-09-12',
      startTime: '12:00:00',
      endTime: '16:00:00',
      baseTicketPrice: 5000,
      totalCapacity: 624,
      bookedSeatsCount: 284,
      availableSeatsCount: 340,
      heldSeatsCount: 12,
      posterUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    },
    {
      id: 2,
      name: 'Global AI Summit 2026',
      description: 'The premier artificial intelligence and frontier technology gathering in South Asia. Keynotes from industry titans, deep-dive workshops, and startup pitching.',
      venueId: 2,
      venueName: 'Cinnamon Life',
      venueAddress: 'Colombo, Sri Lanka',
      categoryId: 3,
      categoryName: 'Technology',
      eventDate: '2026-10-03',
      startTime: '09:00:00',
      endTime: '17:00:00',
      baseTicketPrice: 3500,
      totalCapacity: 500,
      bookedSeatsCount: 198,
      availableSeatsCount: 302,
      heldSeatsCount: 0,
      posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    },
    {
      id: 3,
      name: 'Tamil Cultural Night 2026',
      description: 'A celebration of rich classical dance, vocal Carnatic music, drama, and traditional folk art performances reflecting century-old heritage.',
      venueId: 3,
      venueName: 'Jaffna Cultural Centre',
      venueAddress: 'Jaffna, Sri Lanka',
      categoryId: 4,
      categoryName: 'Cultural',
      eventDate: '2026-10-17',
      startTime: '18:00:00',
      endTime: '22:00:00',
      baseTicketPrice: 2500,
      totalCapacity: 360,
      bookedSeatsCount: 146,
      availableSeatsCount: 214,
      heldSeatsCount: 0,
      posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    },
    {
      id: 4,
      name: 'Startup Expo 2026',
      description: 'Explore high-growth startups, connect with angel investors and venture capital firms, and witness disruptive tech demos.',
      venueId: 5,
      venueName: 'City Hall',
      venueAddress: 'Kandy, Sri Lanka',
      categoryId: 2,
      categoryName: 'Business & Networking',
      eventDate: '2026-11-05',
      startTime: '09:30:00',
      endTime: '17:30:00',
      baseTicketPrice: 2000,
      totalCapacity: 450,
      bookedSeatsCount: 120,
      availableSeatsCount: 330,
      heldSeatsCount: 0,
      posterUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    },
    {
      id: 5,
      name: 'Education Future Forum',
      description: 'Shaping future education curricula with global thought leaders, ed-tech pioneers, and pedagogical innovators.',
      venueId: 6,
      venueName: 'BMICH Main Hall',
      venueAddress: 'Colombo, Sri Lanka',
      categoryId: 6,
      categoryName: 'Education',
      eventDate: '2026-11-20',
      startTime: '10:00:00',
      endTime: '16:00:00',
      baseTicketPrice: 1500,
      totalCapacity: 700,
      bookedSeatsCount: 210,
      availableSeatsCount: 490,
      heldSeatsCount: 0,
      posterUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    },
    {
      id: 6,
      name: 'Live Music Festival 2026',
      description: 'Three stages of non-stop indie, rock, pop, and acoustic music featuring prominent local bands and international guest artists.',
      venueId: 2,
      venueName: 'Cinnamon Life',
      venueAddress: 'Colombo, Sri Lanka',
      categoryId: 1,
      categoryName: 'Music Concert',
      eventDate: '2026-12-06',
      startTime: '17:00:00',
      endTime: '23:30:00',
      baseTicketPrice: 4500,
      totalCapacity: 800,
      bookedSeatsCount: 350,
      availableSeatsCount: 450,
      heldSeatsCount: 0,
      posterUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    },
    {
      id: 7,
      name: 'Titanic',
      description: 'A special remastered anniversary cinema screening of James Cameron’s legendary epic romantic motion picture.',
      venueId: 1,
      venueName: 'Jaffna Cinema Hall',
      venueAddress: 'Jaffna, Sri Lanka',
      categoryId: 7,
      categoryName: 'Entertainment',
      eventDate: '2026-09-20',
      startTime: '18:30:00',
      endTime: '21:45:00',
      baseTicketPrice: 2000,
      totalCapacity: 200,
      bookedSeatsCount: 160,
      availableSeatsCount: 40,
      heldSeatsCount: 0,
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    },
    {
      id: 8,
      name: 'Sri Lanka Build Expo 2024',
      description: 'The premier construction, architecture, and interior design exhibition connecting material suppliers and architects.',
      venueId: 6,
      venueName: 'BMICH',
      venueAddress: 'Colombo, Sri Lanka',
      categoryId: 2,
      categoryName: 'Business & Networking',
      eventDate: '2026-11-08',
      startTime: '09:00:00',
      endTime: '18:00:00',
      baseTicketPrice: 1200,
      totalCapacity: 1000,
      bookedSeatsCount: 400,
      availableSeatsCount: 600,
      heldSeatsCount: 0,
      posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    }
  ];

  // Bookings
  bookings: BookingDto[] = [
    {
      bookingId: 1,
      bookingNumber: 'GTS-8829',
      customerId: 1,
      eventId: 1,
      bookingStatus: BookingStatus.Confirmed,
      holdExpiresAtUtc: '2026-09-12T10:45:00Z',
      createdAt: '2026-08-28T14:15:00Z',
      event: {
        eventId: 1,
        eventName: 'Rockstar Aniruth Musical Show - 2026',
        eventDate: '2026-09-12',
        startTime: '12:00:00',
        endTime: '16:00:00',
        venueName: 'Unicom TIC',
        categoryName: 'Music Concert',
        posterUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600'
      },
      seats: [
        {
          seatId: 103,
          seatCode: 'P-N-03',
          rowLabel: 'N',
          seatNumber: 3,
          sectionName: 'Platinum',
          attendeeName: 'Leo Thas',
          attendeeType: AttendeeType.Adult,
          priceSnapshot: 15000
        },
        {
          seatId: 104,
          seatCode: 'G-E-05',
          rowLabel: 'E',
          seatNumber: 5,
          sectionName: 'Gold',
          attendeeName: 'Anna Thas',
          attendeeType: AttendeeType.Adult,
          priceSnapshot: 12500
        },
        {
          seatId: 105,
          seatCode: 'S-I-06',
          rowLabel: 'I',
          seatNumber: 6,
          sectionName: 'Silver',
          attendeeName: 'Junior Thas',
          attendeeType: AttendeeType.Child,
          priceSnapshot: 5000
        }
      ],
      parking: {
        parkingReservationId: 1,
        parkingSlotId: 13,
        slotCode: 'C13',
        zoneName: 'Car Zone',
        vehicleType: VehicleType.Car,
        feeSnapshot: 500,
        reservedAtUtc: '2026-08-28T14:15:00Z'
      },
      totalAmount: 33000
    },
    {
      bookingId: 2,
      bookingNumber: 'MOV-4821',
      customerId: 2,
      eventId: 7,
      bookingStatus: BookingStatus.Confirmed,
      holdExpiresAtUtc: '2026-09-20T14:30:00Z',
      createdAt: '2026-08-27T10:00:00Z',
      event: {
        eventId: 7,
        eventName: 'Titanic',
        eventDate: '2026-09-20',
        startTime: '18:30:00',
        endTime: '21:45:00',
        venueName: 'Jaffna Cinema Hall, Jaffna',
        categoryName: 'Entertainment'
      },
      seats: [
        {
          seatId: 201,
          seatCode: 'G-E-11',
          rowLabel: 'E',
          seatNumber: 11,
          sectionName: 'Gold',
          attendeeName: 'Anna Lee',
          attendeeType: AttendeeType.Adult,
          priceSnapshot: 2000
        },
        {
          seatId: 202,
          seatCode: 'G-E-12',
          rowLabel: 'E',
          seatNumber: 12,
          sectionName: 'Gold',
          attendeeName: 'Guest',
          attendeeType: AttendeeType.Adult,
          priceSnapshot: 2000
        }
      ],
      totalAmount: 4000
    },
    {
      bookingId: 3,
      bookingNumber: 'UTE-6314',
      customerId: 3,
      eventId: 4,
      bookingStatus: BookingStatus.Pending,
      holdExpiresAtUtc: '2026-11-05T09:45:00Z',
      createdAt: '2026-08-27T11:00:00Z',
      event: {
        eventId: 4,
        eventName: 'Unicom TIC Startup Expo',
        eventDate: '2026-10-03',
        startTime: '09:00:00',
        endTime: '17:00:00',
        venueName: 'Unicom TIC, Jaffna',
        categoryName: 'Business & Networking'
      },
      seats: [
        {
          seatId: 301,
          seatCode: 'S-W-08',
          rowLabel: 'W',
          seatNumber: 8,
          sectionName: 'Silver',
          attendeeName: 'John Silva',
          attendeeType: AttendeeType.Adult,
          priceSnapshot: 4000
        },
        {
          seatId: 302,
          seatCode: 'S-W-09',
          rowLabel: 'W',
          seatNumber: 9,
          sectionName: 'Silver',
          attendeeName: 'Guest',
          attendeeType: AttendeeType.Adult,
          priceSnapshot: 4000
        }
      ],
      parking: {
        parkingReservationId: 3,
        parkingSlotId: 26,
        slotCode: 'C26',
        zoneName: 'Car Zone',
        vehicleType: VehicleType.Car,
        feeSnapshot: 500,
        reservedAtUtc: '2026-08-27T11:00:00Z'
      },
      totalAmount: 8500
    },
    {
      bookingId: 4,
      bookingNumber: 'TCN-7452',
      customerId: 4,
      eventId: 3,
      bookingStatus: BookingStatus.Confirmed,
      holdExpiresAtUtc: '2026-10-17T18:45:00Z',
      createdAt: '2026-08-26T16:00:00Z',
      event: {
        eventId: 3,
        eventName: 'Tamil Cultural Night 2026',
        eventDate: '2026-10-17',
        startTime: '18:00:00',
        endTime: '22:00:00',
        venueName: 'Jaffna Cultural Centre, Jaffna',
        categoryName: 'Cultural'
      },
      seats: [
        { seatId: 401, seatCode: 'P-A-01', rowLabel: 'A', seatNumber: 1, sectionName: 'Platinum', attendeeName: 'Sara Kumar', attendeeType: AttendeeType.Adult, priceSnapshot: 3000 },
        { seatId: 402, seatCode: 'P-A-02', rowLabel: 'A', seatNumber: 2, sectionName: 'Platinum', attendeeName: 'Guest 1', attendeeType: AttendeeType.Adult, priceSnapshot: 3000 },
        { seatId: 403, seatCode: 'P-A-03', rowLabel: 'A', seatNumber: 3, sectionName: 'Platinum', attendeeName: 'Guest 2', attendeeType: AttendeeType.Adult, priceSnapshot: 3000 },
        { seatId: 404, seatCode: 'P-A-04', rowLabel: 'A', seatNumber: 4, sectionName: 'Platinum', attendeeName: 'Guest 3', attendeeType: AttendeeType.Adult, priceSnapshot: 3000 }
      ],
      parking: {
        parkingReservationId: 4,
        parkingSlotId: 5,
        slotCode: 'TW5',
        zoneName: 'Three-Wheeler Zone',
        vehicleType: VehicleType.ThreeWheeler,
        feeSnapshot: 300,
        reservedAtUtc: '2026-08-26T16:00:00Z'
      },
      totalAmount: 12300
    },
    {
      bookingId: 5,
      bookingNumber: 'EFF-2147',
      customerId: 5,
      eventId: 5,
      bookingStatus: BookingStatus.Expired,
      holdExpiresAtUtc: '2026-08-25T10:15:00Z',
      createdAt: '2026-08-25T10:00:00Z',
      event: {
        eventId: 5,
        eventName: 'Education Future Forum',
        eventDate: '2026-11-20',
        startTime: '10:00:00',
        endTime: '16:00:00',
        venueName: 'BMICH Main Hall, Colombo',
        categoryName: 'Education'
      },
      seats: [
        { seatId: 501, seatCode: 'S-A-15', rowLabel: 'A', seatNumber: 15, sectionName: 'Silver', attendeeName: 'Nimal Perera', attendeeType: AttendeeType.Adult, priceSnapshot: 1500 },
        { seatId: 502, seatCode: 'S-A-16', rowLabel: 'A', seatNumber: 16, sectionName: 'Silver', attendeeName: 'Guest', attendeeType: AttendeeType.Adult, priceSnapshot: 1500 }
      ],
      totalAmount: 3000
    },
    {
      bookingId: 6,
      bookingNumber: 'LMF-3902',
      customerId: 6,
      eventId: 6,
      bookingStatus: BookingStatus.Cancelled,
      holdExpiresAtUtc: '2026-08-24T17:15:00Z',
      createdAt: '2026-08-24T17:00:00Z',
      event: {
        eventId: 6,
        eventName: 'Live Music Festival 2026',
        eventDate: '2026-12-06',
        startTime: '17:00:00',
        endTime: '23:30:00',
        venueName: 'Cinnamon Life, Colombo',
        categoryName: 'Music Concert'
      },
      seats: [
        { seatId: 601, seatCode: 'G-M-05', rowLabel: 'M', seatNumber: 5, sectionName: 'Gold', attendeeName: 'Kavya Raj', attendeeType: AttendeeType.Adult, priceSnapshot: 4500 },
        { seatId: 602, seatCode: 'G-M-06', rowLabel: 'M', seatNumber: 6, sectionName: 'Gold', attendeeName: 'Guest', attendeeType: AttendeeType.Adult, priceSnapshot: 4500 }
      ],
      parking: {
        parkingReservationId: 6,
        parkingSlotId: 105,
        slotCode: 'V5',
        zoneName: 'Van Zone',
        vehicleType: VehicleType.Van,
        feeSnapshot: 500,
        reservedAtUtc: '2026-08-24T17:00:00Z'
      },
      totalAmount: 9500
    }
  ];

  // Payments
  payments: PaymentHistoryDto[] = [
    {
      paymentId: 1,
      bookingId: 1,
      bookingNumber: 'GTS-8829',
      eventName: 'Rockstar Aniruth Musical Show - 2026',
      venueName: 'Unicom TIC, Jaffna',
      customerName: 'Leo Thas',
      amountPaid: 33000,
      currency: 'LKR',
      paymentMethod: PaymentMethod.Card,
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: '2026-09-12T10:30:00Z'
    },
    {
      paymentId: 2,
      bookingId: 2,
      bookingNumber: 'MOV-4821',
      eventName: 'Titanic',
      venueName: 'Jaffna Cinema Hall, Jaffna',
      customerName: 'Anna Lee',
      amountPaid: 4000,
      currency: 'LKR',
      paymentMethod: PaymentMethod.Card,
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: '2026-09-20T14:15:00Z'
    },
    {
      paymentId: 3,
      bookingId: 4,
      bookingNumber: 'TCN-7452',
      eventName: 'Tamil Cultural Night 2026',
      venueName: 'Jaffna Cultural Centre',
      customerName: 'Sara Kumar',
      amountPaid: 12300,
      currency: 'LKR',
      paymentMethod: PaymentMethod.Card,
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: '2026-10-17T17:42:00Z'
    },
    {
      paymentId: 4,
      bookingId: 104,
      bookingNumber: 'BNE-4108',
      eventName: 'Business Networking Expo',
      venueName: 'BMICH',
      customerName: 'Arun Raj',
      amountPaid: 6000,
      currency: 'LKR',
      paymentMethod: PaymentMethod.Card,
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: '2026-11-01T09:15:00Z'
    },
    {
      paymentId: 5,
      bookingId: 105,
      bookingNumber: 'SPT-5127',
      eventName: 'Sports Festival 2026',
      venueName: 'Sugathadasa Stadium',
      customerName: 'Maya Perera',
      amountPaid: 7500,
      currency: 'LKR',
      paymentMethod: PaymentMethod.Card,
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: '2026-11-14T15:20:00Z'
    },
    {
      paymentId: 6,
      bookingId: 5,
      bookingNumber: 'EDU-6741',
      eventName: 'Education Future Forum',
      venueName: 'BMICH Main Hall',
      customerName: 'Nila Fernando',
      amountPaid: 3000,
      currency: 'LKR',
      paymentMethod: PaymentMethod.Card,
      paymentStatus: PaymentStatus.Completed,
      paidAtUtc: '2026-11-20T09:32:00Z'
    }
  ];

  // Notifications
  notifications: NotificationDto[] = [
    {
      notificationId: 1,
      title: 'Booking Confirmed',
      message: 'Your booking GTS-8829 has been successfully confirmed for Rockstar Aniruth Musical Show - 2026 on Sep 12, 2026 at Unicom TIC, Jaffna. 3 Seats • Parking C13',
      isRead: false,
      createdAtUtc: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      type: 'booking',
      actionUrl: '/customer/bookings/1'
    },
    {
      notificationId: 2,
      title: 'Payment Completed',
      message: 'Your simulated payment of LKR 33,000 for booking GTS-8829 was completed successfully. Ticket: LKR 32,500, Parking: LKR 500.',
      isRead: false,
      createdAtUtc: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: 'payment',
      actionUrl: '/customer/payments'
    },
    {
      notificationId: 3,
      title: 'Parking Reserved',
      message: 'Your parking slot has been reserved for Rockstar Aniruth Musical Show - 2026. Vehicle Type: Car, Parking Zone: Car Zone, Slot: C13, Fee: LKR 500.',
      isRead: false,
      createdAtUtc: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      type: 'parking',
      actionUrl: '/customer/bookings/1'
    },
    {
      notificationId: 4,
      title: 'Event Reminder',
      message: 'Rockstar Aniruth Musical Show - 2026 is coming up soon on Sep 12, 2026 at 12:00 PM (Unicom TIC, Jaffna). Remember to have your EventFlow QR Pass ready for event and parking entry.',
      isRead: true,
      createdAtUtc: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'event',
      actionUrl: '/events/1'
    }
  ];

  // Generate 624 seats for Event 1 (Rockstar Aniruth) matching the SVG layout
  generateSeatsForEvent(eventId: number): SeatAvailabilityDto[] {
    const seats: SeatAvailabilityDto[] = [];
    const sections = [
      { name: 'VIP', code: 'VIP', price: 20000, rows: ['VIP'], countPerRow: 20, isVIP: true },
      { name: 'Platinum', code: 'P', price: 15000, rows: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], countPerRow: 26 },
      { name: 'Gold', code: 'G', price: 12500, rows: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], countPerRow: 26 },
      { name: 'Silver', code: 'S', price: 10000, rows: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], countPerRow: 23 }
    ];

    let id = 1;
    for (const sec of sections) {
      for (const r of sec.rows) {
        for (let num = 1; num <= sec.countPerRow; num++) {
          const seatCode = `${sec.code}-${r}-${num < 10 ? '0' + num : num}`;
          let status = SeatStatus.Available;

          if (sec.isVIP) {
            status = 'VIP' as any;
          } else if (id % 5 === 0) {
            status = SeatStatus.Booked;
          } else if (id % 23 === 0) {
            status = SeatStatus.Held;
          }

          seats.push({
            id: id,
            seatId: id++,
            seatCode: seatCode,
            number: num,
            seatNumber: num,
            rowLabel: r,
            sectionId: 1,
            sectionCode: sec.code,
            sectionName: sec.name,
            categoryCode: sec.code,
            categoryName: sec.name,
            tierName: sec.name,
            adultPrice: sec.price,
            childPrice: sec.price * 0.5,
            price: sec.price,
            isPubliclyBookable: true,
            status: status,
            isVip: !!sec.isVIP
          });
        }
      }
    }
    return seats;
  }

  // Generate 60 Parking Slots for Event 1 matching screenshot 10
  generateParkingSlotsForEvent(eventId: number): ParkingAvailabilityDto[] {
    const slots: ParkingAvailabilityDto[] = [];
    let id = 1;

    // Motorbike Zone (Reserved / Offline)
    for (let i = 1; i <= 6; i++) {
      slots.push({
        id: id,
        slotId: id++,
        slotCode: `MB${i}`,
        zoneId: 1,
        zoneName: 'Motorbike Zone',
        zoneCode: 'MB',
        vehicleType: VehicleType.Motorbike,
        fee: 0,
        price: 0,
        status: ParkingStatus.Occupied,
        isOnlineBookable: false,
        isAvailableForBooking: false
      });
    }

    // Three-Wheeler Zone (TW1 - TW12, Fee: 300)
    for (let i = 1; i <= 12; i++) {
      const code = `TW${i}`;
      let status = ParkingStatus.Available;
      if (code === 'TW9' || code === 'TW11') status = ParkingStatus.Held;
      slots.push({
        id: id,
        slotId: id++,
        slotCode: code,
        zoneId: 2,
        zoneName: 'Three-Wheeler Zone',
        zoneCode: 'TW',
        vehicleType: VehicleType.ThreeWheeler,
        fee: 300,
        price: 300,
        status: status,
        isOnlineBookable: true,
        isAvailableForBooking: true
      });
    }

    // Van Zone (V1 - V8, Fee: 500)
    for (let i = 1; i <= 8; i++) {
      const code = `V${i}`;
      let status = ParkingStatus.Available;
      if (code === 'V3') status = ParkingStatus.Held;
      if (code === 'V8') status = ParkingStatus.Occupied;
      slots.push({
        id: id,
        slotId: id++,
        slotCode: code,
        zoneId: 3,
        zoneName: 'Van Zone',
        zoneCode: 'VAN',
        vehicleType: VehicleType.Van,
        fee: 500,
        price: 500,
        status: status,
        isOnlineBookable: true,
        isAvailableForBooking: true
      });
    }

    // Car Zone (C1 - C40, Fee: 500)
    for (let i = 1; i <= 40; i++) {
      const code = `C${i}`;
      let status = ParkingStatus.Available;
      if (code === 'C14' || code === 'C26' || code === 'C37') status = ParkingStatus.Held;
      if (code === 'C18' || code === 'C31' || code === 'C34') status = ParkingStatus.Occupied;
      slots.push({
        id: id,
        slotId: id++,
        slotCode: code,
        zoneId: 4,
        zoneName: 'Car Zone',
        zoneCode: 'CAR',
        vehicleType: VehicleType.Car,
        fee: 500,
        price: 500,
        status: status,
        isOnlineBookable: true,
        isAvailableForBooking: true
      });
    }

    return slots;
  }
}

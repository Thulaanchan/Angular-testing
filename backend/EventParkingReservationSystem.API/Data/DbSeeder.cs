using EventParkingReservationSystem.API.Data.Context;
using EventParkingReservationSystem.API.Enums.Bookings;
using EventParkingReservationSystem.API.Enums.Parking;
using EventParkingReservationSystem.API.Enums.Payments;
using EventParkingReservationSystem.API.Enums.Seats;
using EventParkingReservationSystem.API.Models.Entities.Bookings;
using EventParkingReservationSystem.API.Models.Entities.Categories;
using EventParkingReservationSystem.API.Models.Entities.Customers;
using EventParkingReservationSystem.API.Models.Entities.Events;
using EventParkingReservationSystem.API.Models.Entities.Notifications;
using EventParkingReservationSystem.API.Models.Entities.Parking;
using EventParkingReservationSystem.API.Models.Entities.ParkingReservations;
using EventParkingReservationSystem.API.Models.Entities.Payments;
using EventParkingReservationSystem.API.Models.Entities.Seats;
using EventParkingReservationSystem.API.Models.Entities.Venues;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EventParkingReservationSystem.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");

        try
        {
            logger.LogInformation("Applying database migrations...");
            await context.Database.MigrateAsync();

            if (await context.Customers.AnyAsync())
            {
                logger.LogInformation("Database already seeded. Skipping initial seed.");
                return;
            }

            logger.LogInformation("Seeding initial database records...");
            var hasher = new PasswordHasher<Customer>();

            // 1. Seed Customers & Administrators
            var leo = new Customer
            {
                FirstName = "Leo",
                LastName = "Thas",
                Email = "leo.thas@email.com",
                Phone = "+1 (555) 234-5678",
                IsActive = true,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-1)
            };
            leo.PasswordHash = hasher.HashPassword(leo, "Password123!");

            var alex = new Customer
            {
                FirstName = "Alex",
                LastName = "Morgan",
                Email = "alex.morgan@eventflow.com",
                Phone = "+1 (555) 987-6543",
                IsActive = true,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            };
            alex.PasswordHash = hasher.HashPassword(alex, "Admin123!");

            var admin = new Customer
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@bookwithus.com",
                Phone = "+1 (555) 000-1111",
                IsActive = true,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            };
            admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");

            context.Customers.AddRange(leo, alex, admin);
            await context.SaveChangesAsync();

            // 2. Seed Venues
            var venue1 = new Venue
            {
                Name = "Unicom TIC",
                Address = "A9 Road, Jaffna",
                TotalCapacity = 2500,
                CreatedAt = DateTime.UtcNow.AddMonths(-2),
                UpdatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            var venue2 = new Venue
            {
                Name = "Sugathadasa Indoor Stadium",
                Address = "Prince of Wales Ave, Colombo 14",
                TotalCapacity = 5000,
                CreatedAt = DateTime.UtcNow.AddMonths(-2),
                UpdatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            var venue3 = new Venue
            {
                Name = "Nelum Pokuna Mahinda Rajapaksa Theatre",
                Address = "110 Ananda Coomaraswamy Mawatha, Colombo 07",
                TotalCapacity = 1288,
                CreatedAt = DateTime.UtcNow.AddMonths(-2),
                UpdatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            context.Venues.AddRange(venue1, venue2, venue3);
            await context.SaveChangesAsync();

            // 3. Seed Event Categories
            var catConcert = new EventCategory { Name = "Concerts & Music", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            var catSports = new EventCategory { Name = "Sports & Fitness", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            var catTheatre = new EventCategory { Name = "Theatre & Arts", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            var catConf = new EventCategory { Name = "Conferences & Seminars", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };

            context.EventCategories.AddRange(catConcert, catSports, catTheatre, catConf);
            await context.SaveChangesAsync();

            // 4. Seed Events
            var event1 = new Event
            {
                Name = "Rockstar Aniruth Musical Show - 2026",
                Description = "Experience the electrifying musical storm by Rockstar Aniruth live in Jaffna. Featuring world-class sound, lighting, and an unforgettable repertoire of chart-topping hits.",
                VenueId = venue1.Id,
                CategoryId = catConcert.Id,
                EventDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14)),
                StartTime = new TimeOnly(18, 30),
                EndTime = new TimeOnly(22, 30),
                TicketPrice = 5000m,
                ChildDiscountPercent = 50m,
                Capacity = 2500,
                PosterUrl = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1000&q=80",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            };

            var event2 = new Event
            {
                Name = "Sri Lanka vs India T20 Showdown",
                Description = "The ultimate cricket rivalry reignites under the stadium floodlights. Watch the giants battle in an epic high-stakes T20 international encounter.",
                VenueId = venue2.Id,
                CategoryId = catSports.Id,
                EventDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(21)),
                StartTime = new TimeOnly(19, 0),
                EndTime = new TimeOnly(23, 0),
                TicketPrice = 3500m,
                ChildDiscountPercent = 50m,
                Capacity = 5000,
                PosterUrl = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            };

            var event3 = new Event
            {
                Name = "The Phantom of the Opera Musical",
                Description = "The legendary Broadway masterpiece arrives with full orchestral arrangements, magnificent sets, and transcendent vocal performances.",
                VenueId = venue3.Id,
                CategoryId = catTheatre.Id,
                EventDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
                StartTime = new TimeOnly(17, 0),
                EndTime = new TimeOnly(20, 30),
                TicketPrice = 7500m,
                ChildDiscountPercent = 40m,
                Capacity = 1288,
                PosterUrl = "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1000&q=80",
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            };

            context.Events.AddRange(event1, event2, event3);
            await context.SaveChangesAsync();

            // 5. Seed Seat Categories for Event 1
            var catVip = new EventSeatCategory { EventId = event1.Id, Name = "VIP", Code = "VIP", AdultPrice = 20000m, IsPubliclyBookable = true, DisplayOrder = 1 };
            var catPlat = new EventSeatCategory { EventId = event1.Id, Name = "Platinum", Code = "P", AdultPrice = 15000m, IsPubliclyBookable = true, DisplayOrder = 2 };
            var catGold = new EventSeatCategory { EventId = event1.Id, Name = "Gold", Code = "G", AdultPrice = 12500m, IsPubliclyBookable = true, DisplayOrder = 3 };
            var catSilv = new EventSeatCategory { EventId = event1.Id, Name = "Silver", Code = "S", AdultPrice = 10000m, IsPubliclyBookable = true, DisplayOrder = 4 };

            context.EventSeatCategories.AddRange(catVip, catPlat, catGold, catSilv);
            await context.SaveChangesAsync();

            // 6. Seed Seat Sections for Event 1
            var secVip = new SeatSection { EventId = event1.Id, EventSeatCategoryId = catVip.Id, Code = "VIP-A", Name = "VIP Ring", DisplayOrder = 1 };
            var secPlat = new SeatSection { EventId = event1.Id, EventSeatCategoryId = catPlat.Id, Code = "P-N", Name = "Platinum North", DisplayOrder = 2 };
            var secGold = new SeatSection { EventId = event1.Id, EventSeatCategoryId = catGold.Id, Code = "G-E", Name = "Gold East", DisplayOrder = 3 };
            var secSilv = new SeatSection { EventId = event1.Id, EventSeatCategoryId = catSilv.Id, Code = "S-S", Name = "Silver South", DisplayOrder = 4 };

            context.SeatSections.AddRange(secVip, secPlat, secGold, secSilv);
            await context.SaveChangesAsync();

            // 7. Seed Seats for Event 1
            var seats = new List<Seat>();

            // VIP Seats (10 seats)
            for (int i = 1; i <= 10; i++)
            {
                seats.Add(new Seat
                {
                    EventId = event1.Id,
                    SeatSectionId = secVip.Id,
                    RowLabel = "A",
                    Number = i,
                    SeatCode = $"VIP-A-{i:D2}",
                    Status = (i == 1 || i == 2) ? SeatStatus.Booked : SeatStatus.Available,
                    DisplayOrder = i,
                    PositionX = 100m + (i * 40m),
                    PositionY = 50m
                });
            }

            // Platinum Seats (20 seats)
            for (int i = 1; i <= 20; i++)
            {
                seats.Add(new Seat
                {
                    EventId = event1.Id,
                    SeatSectionId = secPlat.Id,
                    RowLabel = "B",
                    Number = i,
                    SeatCode = $"P-B-{i:D2}",
                    Status = (i == 5 || i == 6) ? SeatStatus.Booked : SeatStatus.Available,
                    DisplayOrder = 10 + i,
                    PositionX = 60m + (i * 35m),
                    PositionY = 120m
                });
            }

            // Gold Seats (20 seats)
            for (int i = 1; i <= 20; i++)
            {
                seats.Add(new Seat
                {
                    EventId = event1.Id,
                    SeatSectionId = secGold.Id,
                    RowLabel = "C",
                    Number = i,
                    SeatCode = $"G-C-{i:D2}",
                    Status = SeatStatus.Available,
                    DisplayOrder = 30 + i,
                    PositionX = 60m + (i * 35m),
                    PositionY = 190m
                });
            }

            // Silver Seats (20 seats)
            for (int i = 1; i <= 20; i++)
            {
                seats.Add(new Seat
                {
                    EventId = event1.Id,
                    SeatSectionId = secSilv.Id,
                    RowLabel = "D",
                    Number = i,
                    SeatCode = $"S-D-{i:D2}",
                    Status = SeatStatus.Available,
                    DisplayOrder = 50 + i,
                    PositionX = 60m + (i * 35m),
                    PositionY = 260m
                });
            }

            context.Seats.AddRange(seats);
            await context.SaveChangesAsync();

            // 8. Seed Parking Zones for Event 1
            var zoneA = new ParkingZone { EventId = event1.Id, Name = "Zone A - Premium Car", VehicleType = VehicleType.Car, Fee = 1500m, IsOnlineBookable = true, DisplayOrder = 1 };
            var zoneB = new ParkingZone { EventId = event1.Id, Name = "Zone B - Standard Car", VehicleType = VehicleType.Car, Fee = 1000m, IsOnlineBookable = true, DisplayOrder = 2 };
            var zoneC = new ParkingZone { EventId = event1.Id, Name = "Zone C - Motorcycle", VehicleType = VehicleType.Motorbike, Fee = 500m, IsOnlineBookable = true, DisplayOrder = 3 };
            var zoneD = new ParkingZone { EventId = event1.Id, Name = "Zone D - Van / Minibus", VehicleType = VehicleType.Van, Fee = 2500m, IsOnlineBookable = true, DisplayOrder = 4 };

            context.ParkingZones.AddRange(zoneA, zoneB, zoneC, zoneD);
            await context.SaveChangesAsync();

            // 9. Seed Parking Slots for Event 1
            var parkingSlots = new List<ParkingSlot>();
            for (int i = 1; i <= 10; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    EventId = event1.Id,
                    ParkingZoneId = zoneA.Id,
                    SlotCode = $"A-{i:D2}",
                    Status = (i == 1) ? ParkingStatus.Occupied : ParkingStatus.Available,
                    DisplayOrder = i,
                    PositionX = 50m + (i * 30m),
                    PositionY = 40m
                });
            }

            for (int i = 1; i <= 12; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    EventId = event1.Id,
                    ParkingZoneId = zoneB.Id,
                    SlotCode = $"B-{i:D2}",
                    Status = ParkingStatus.Available,
                    DisplayOrder = 10 + i,
                    PositionX = 50m + (i * 30m),
                    PositionY = 100m
                });
            }

            for (int i = 1; i <= 10; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    EventId = event1.Id,
                    ParkingZoneId = zoneC.Id,
                    SlotCode = $"C-{i:D2}",
                    Status = ParkingStatus.Available,
                    DisplayOrder = 22 + i,
                    PositionX = 50m + (i * 30m),
                    PositionY = 160m
                });
            }

            for (int i = 1; i <= 6; i++)
            {
                parkingSlots.Add(new ParkingSlot
                {
                    EventId = event1.Id,
                    ParkingZoneId = zoneD.Id,
                    SlotCode = $"D-{i:D2}",
                    Status = ParkingStatus.Available,
                    DisplayOrder = 32 + i,
                    PositionX = 50m + (i * 30m),
                    PositionY = 220m
                });
            }

            context.ParkingSlots.AddRange(parkingSlots);
            await context.SaveChangesAsync();

            // 10. Seed Sample Booking for Leo Thas
            var booking = new Booking
            {
                BookingNumber = "BWU-7821",
                CustomerId = leo.CustomerId,
                EventId = event1.Id,
                BookingStatus = BookingStatus.Confirmed,
                HoldExpiresAtUtc = DateTime.UtcNow.AddMinutes(-30),
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            };
            context.Bookings.Add(booking);
            await context.SaveChangesAsync();

            var bookedSeat1 = seats[0]; // VIP-A-01
            var bookedSeat2 = seats[1]; // VIP-A-02
            var bookingSeats = new List<BookingSeat>
            {
                new()
                {
                    BookingId = booking.BookingId,
                    SeatId = bookedSeat1.Id,
                    AttendeeName = "Leo Thas",
                    AttendeeType = AttendeeType.Adult,
                    PriceSnapshot = 20000m
                },
                new()
                {
                    BookingId = booking.BookingId,
                    SeatId = bookedSeat2.Id,
                    AttendeeName = "Priya Thas",
                    AttendeeType = AttendeeType.Adult,
                    PriceSnapshot = 20000m
                }
            };
            context.BookingSeats.AddRange(bookingSeats);

            var bookedSlot = parkingSlots[0]; // A-01
            var parkingRes = new ParkingReservation
            {
                BookingId = booking.BookingId,
                ParkingSlotId = bookedSlot.Id,
                FeeSnapshot = 1500m,
                VehicleTypeSnapshot = VehicleType.Car,
                ZoneNameSnapshot = "Zone A - Premium Car",
                ReservedAtUtc = DateTime.UtcNow.AddDays(-2)
            };
            context.ParkingReservations.Add(parkingRes);

            var payment = new Payment
            {
                BookingId = booking.BookingId,
                Amount = 41500m, // 20000 + 20000 + 1500
                Currency = "LKR",
                PaymentMethod = PaymentMethod.Card,
                Status = PaymentStatus.Completed,
                PaidAtUtc = DateTime.UtcNow.AddDays(-2),
                CreatedAtUtc = DateTime.UtcNow.AddDays(-2)
            };
            context.Payments.Add(payment);

            // 11. Seed Notifications for Leo Thas
            var notifs = new List<Notification>
            {
                new()
                {
                    CustomerId = leo.CustomerId,
                    Title = "Welcome to BookWithUs!",
                    Message = "Your account has been verified successfully. Explore upcoming events, reserve premier seats, and secure your parking spot with instant QR confirmation.",
                    IsRead = false,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-3)
                },
                new()
                {
                    CustomerId = leo.CustomerId,
                    Title = "Booking Confirmed: #BWU-7821",
                    Message = "Your booking for 'Rockstar Aniruth Musical Show - 2026' (VIP Seats: VIP-A-01, VIP-A-02) has been confirmed. Entry pass is available in your bookings tab.",
                    IsRead = false,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-2)
                },
                new()
                {
                    CustomerId = leo.CustomerId,
                    Title = "Parking Spot Reserved: A-01",
                    Message = "Your premium parking spot A-01 is secured for 'Rockstar Aniruth Musical Show - 2026' at Unicom TIC, Jaffna. Please display your digital parking pass at Gate 1.",
                    IsRead = true,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-2)
                }
            };
            context.Notifications.AddRange(notifs);

            await context.SaveChangesAsync();
            logger.LogInformation("Database seed completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating and seeding the database.");
            throw;
        }
    }
}

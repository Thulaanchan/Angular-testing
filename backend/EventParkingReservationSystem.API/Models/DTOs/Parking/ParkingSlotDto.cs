namespace EventParkingReservationSystem.API.Models.DTOs.Parking;

public class ParkingSlotDto
{
    public int Id { get; set; }

    public int EventId { get; set; }

    public int ParkingZoneId { get; set; }

    public string SlotCode { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string ZoneName { get; set; } = string.Empty;

    public string VehicleType { get; set; } = string.Empty;

    public decimal Fee { get; set; }

    public bool IsOnlineBookable { get; set; }

    public int DisplayOrder { get; set; }

    public decimal? PositionX { get; set; }

    public decimal? PositionY { get; set; }
}
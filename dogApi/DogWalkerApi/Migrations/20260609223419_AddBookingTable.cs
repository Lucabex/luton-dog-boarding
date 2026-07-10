using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DogWalkerApi.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "DropOff",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PickUp",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "TimeSlot",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Bookings",
                newName: "ServiceType");

            migrationBuilder.RenameColumn(
                name: "Nights",
                table: "Bookings",
                newName: "NumberOfNights");

            migrationBuilder.AddColumn<DateTime>(
                name: "DaycareDate",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WalkDate",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WalkSlot",
                table: "Bookings",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaycareDate",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "WalkDate",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "WalkSlot",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "ServiceType",
                table: "Bookings",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "NumberOfNights",
                table: "Bookings",
                newName: "Nights");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "DropOff",
                table: "Bookings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PickUp",
                table: "Bookings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TimeSlot",
                table: "Bookings",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}

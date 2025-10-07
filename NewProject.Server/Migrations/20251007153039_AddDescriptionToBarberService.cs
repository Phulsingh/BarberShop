using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToBarberService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "BarbarServices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "BarbarServices");
        }
    }
}

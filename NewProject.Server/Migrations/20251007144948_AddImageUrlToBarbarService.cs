using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToBarbarService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "BarbarServices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "BarbarServices");
        }
    }
}

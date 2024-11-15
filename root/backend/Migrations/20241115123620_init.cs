using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Client",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lastname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Login = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Realtor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lastname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Login = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Realtor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Realty",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Id_Owner = table.Column<int>(type: "int", nullable: false),
                    ClientsId = table.Column<int>(type: "int", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Adress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Realty", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Realty_Client_ClientsId",
                        column: x => x.ClientsId,
                        principalTable: "Client",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Conversation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    RealtyId = table.Column<int>(type: "int", nullable: false),
                    RealtorId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Conversation_Realtor_RealtorId",
                        column: x => x.RealtorId,
                        principalTable: "Realtor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Conversation_Realty_RealtyId",
                        column: x => x.RealtyId,
                        principalTable: "Realty",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_RealtorId",
                table: "Conversation",
                column: "RealtorId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_RealtyId",
                table: "Conversation",
                column: "RealtyId");

            migrationBuilder.CreateIndex(
                name: "IX_Realty_ClientsId",
                table: "Realty",
                column: "ClientsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Conversation");

            migrationBuilder.DropTable(
                name: "Realtor");

            migrationBuilder.DropTable(
                name: "Realty");

            migrationBuilder.DropTable(
                name: "Client");
        }
    }
}

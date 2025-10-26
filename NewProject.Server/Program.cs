using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NewProject.Server.Data;
using NewProject.Server.Mapping;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🟡 1️⃣ CORS — React Dev URL support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173") // React dev URLs
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// 🟡 2️⃣ Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid JWT token."
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// 🟡 3️⃣ EF Core DbContext
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConn")));

// 🟡 3.1️⃣ AutoMapper
builder.Services.AddAutoMapper(typeof(NewProject.Server.NewFolder.OffersMapping));
builder.Services.AddAutoMapper(typeof(UserProfileMapping));

// 🟡 4️⃣ JWT Auth
var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// 🟡 5️⃣ Middleware Order (IMPORTANT!)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Serve wwwroot files
app.UseDefaultFiles();    // Looks for index.html in wwwroot
app.UseStaticFiles();     // Serves static files like images, js, css

app.UseHttpsRedirection();

// ✅ CORS
app.UseCors("AllowReactApp");

// ✅ Auth — must come after CORS but before MapControllers
app.UseAuthentication();
app.UseAuthorization();

// ✅ Map Controllers
app.MapControllers();

// ✅ Fallback for React Router (SPA)
app.MapFallbackToFile("/index.html");

app.Run();

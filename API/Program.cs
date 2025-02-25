using API.Data;
using API.Entities;
using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
});

var connString = "";
if (builder.Environment.IsDevelopment())
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
else
{
    // temp for SQLLite. Uncomment below code
    connString = builder.Configuration.GetConnectionString("DefaultConnection");

    // // Use connection string provided at runtime by FlyIO.
    // var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    // // Parse connection URL to connection string for Npgsql
    // connUrl = connUrl.Replace("postgres://", string.Empty);
    // var pgUserPass = connUrl.Split("@")[0];
    // var pgHostPortDb = connUrl.Split("@")[1];
    // var pgHostPort = pgHostPortDb.Split("/")[0];
    // var pgDb = pgHostPortDb.Split("/")[1];
    // var pgUser = pgUserPass.Split(":")[0];
    // var pgPass = pgUserPass.Split(":")[1];
    // var pgHost = pgHostPort.Split(":")[0];
    // var pgPort = pgHostPort.Split(":")[1];

    // connString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
}

builder.Services.AddDbContext<DataContext>(opt =>
{
    // opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
    opt.UseSqlite(connString);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
}

app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

// below two lines are used to serve the angular files from wwwroot folder
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");//redirect to angular routing

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();

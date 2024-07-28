using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            users = new List<AppUser>();//we don't require users so delete the seed data

            var roles = new List<AppRole>
            {
                new AppRole{Name="SuperAdmin"},
                new AppRole{Name="Admin"},
                new AppRole{Name="Moderator"},
                new AppRole{Name="Accountant"},
                new AppRole{Name="Teacher"},
                new AppRole{Name="Parent"},
                new AppRole{Name="Student"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            };

            var superadmin = new AppUser
            {
                UserName = "superadmin",
                FirstName = "Super admin",
                MiddleName = "",
                LastName = "User",
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            await userManager.CreateAsync(superadmin, "ZInOoXJS#e123");
            await userManager.AddToRolesAsync(superadmin, new[] { "SuperAdmin", "Admin", "Moderator" });

            var admin = new AppUser
            {
                UserName = "admin",
                FirstName = "Admin",
                MiddleName = "",
                LastName = "User",
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            await userManager.CreateAsync(admin, "ZInOoXJS#e123");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });

            var moderator = new AppUser
            {
                UserName = "moderator",
                FirstName = "Moderator",
                MiddleName = "",
                LastName = "User",
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            await userManager.CreateAsync(moderator, "ZInOoXJS#e123");
            await userManager.AddToRolesAsync(moderator, new[] { "Moderator" });
            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();

                await userManager.CreateAsync(user, "ZInOoXJS#e123");
                await userManager.AddToRoleAsync(user, "Teacher");
            };
        }
    }
}
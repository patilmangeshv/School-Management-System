using System.Text;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<AppRole>()
            .AddDefaultTokenProviders()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddEntityFrameworkStores<DataContext>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("RequiredSuperAdminRole", policy => policy.RequireRole("SuperAdmin"));
                opt.AddPolicy("RequiredAdminRole", policy => policy.RequireRole("SuperAdmin", "Admin"));
                opt.AddPolicy("RequiredModeratorRole", policy => policy.RequireRole("SuperAdmin", "Admin", "Moderator"));
                opt.AddPolicy("RequiredAccountantRole", policy => policy.RequireRole("SuperAdmin", "Accountant"));
                opt.AddPolicy("RequiredTeacherRole", policy => policy.RequireRole("SuperAdmin", "Teacher"));
                opt.AddPolicy("RequiredParentRole", policy => policy.RequireRole("SuperAdmin", "Parent"));
                opt.AddPolicy("RequiredStudentRole", policy => policy.RequireRole("SuperAdmin", "Parent", "Student"));
            });

            return services;
        }
    }
}
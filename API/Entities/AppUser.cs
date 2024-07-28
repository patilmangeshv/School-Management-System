using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser: IdentityUser<int>
{
    public DateTime DateOfBirth { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public string Gender { get; set; }
    public List<Photo> Photos { get; set; } = new();

    public ICollection<AppUserRole> UserRoles { get; set; }

    // public int GetAge()
    // {
    //     return DateOfBirth.CalculateAge();
    // }
}
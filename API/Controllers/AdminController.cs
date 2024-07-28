using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IMailService _mailService;
        public AdminController(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IMailService mailService)
        {
            this._mailService = mailService;
            this._userManager = userManager;
            this._roleManager = roleManager;
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await this._userManager.Users
            .Where(u => u.UserName.ToLower() != "superadmin")
            .OrderBy(u => u.UserName)
            .Select(u => new
            {
                u.Id,
                Username = u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-roles")]
        public async Task<ActionResult> GetUsersRoles()
        {
            var roles = await this._roleManager.Roles
            .Where(r => r.Name != "SuperAdmin")
            .OrderBy(r => r.Name)
            .Select(r => new
            {
                r.Id,
                Rolename = r.Name,
            })
            .ToListAsync();

            return Ok(roles);
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");
            var selectedRoles = roles.Split(",").ToArray();

            var user = await this._userManager.FindByNameAsync(username);
            if (user == null) return NotFound();

            var userRoles = await this._userManager.GetRolesAsync(user);

            var result = await this._userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await this._userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await this._userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword(string username)
        {
            var user = await this._userManager.FindByNameAsync(username);
            if (user == null) return NotFound("Invalid user!");

            var randomPassword = this.CreatePassword(15);
            var resetPasswordToken = await this._userManager.GeneratePasswordResetTokenAsync(user);
            var result = await this._userManager.ResetPasswordAsync(user, resetPasswordToken, randomPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { resetPassword = randomPassword });
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpDelete("delete-user")]
        public async Task<ActionResult<bool>> DeleteUser(string username)
        {
            var user = await this._userManager.FindByNameAsync(username);
            if (user == null) return NotFound("Invalid user!");

            if (user.UserName.ToLower().Contains("admin")) return BadRequest("Cannot delete this user!");

            var result = await this._userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(true);
        }

        private string CreatePassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
            var res = new System.Text.StringBuilder();
            length -= 4;
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            res.Append("Fg@3");

            return res.ToString();
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Admins or moderators can see this");
        }
        // Currently google is not allowing to send unsecured emails using third party apps.
        // [HttpPost("send-contact-email")]
        // public async Task<ActionResult> SendContactEmail([FromForm] MailRequest request)
        // {
        //     await this._mailService.SendEmailAsync(request);

        //     return Ok();
        // }
    }
}
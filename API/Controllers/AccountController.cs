using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenSerrvice;
        public readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenSerrvice, IMapper mapper)
        {
            this._userManager = userManager;
            this._mapper = mapper;
            this._tokenSerrvice = tokenSerrvice;
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            registerDto.Username = registerDto.Username.Trim().ToLower();
            registerDto.Email = registerDto.Email.Trim().ToLower();

            if (await this.UserExists(registerDto.Username)) return BadRequest("Username is taken!");
            if (await this.UserEmailExists(registerDto.Email)) return BadRequest("User is already registered with this email address!");

            var user = this._mapper.Map<AppUser>(registerDto);

            var result = await this._userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await this._userManager.AddToRoleAsync(user, "Teacher");
            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            if (user.Email != "")
            {
                // NOTE: Pending work, once the email sending functionality is done then below pending work should be done
                // 1. below returned token to be sent to the user's email address
                var resultEmailConfirmationToken = await this._userManager.GenerateEmailConfirmationTokenAsync(user);

                // 2. Once the user recieves and clicked on the above link, below method should be used to verify the email confirmation token
                var resultEmailConfirmed = await this._userManager.ConfirmEmailAsync(user, resultEmailConfirmationToken);
                if (!resultEmailConfirmed.Succeeded) return BadRequest(resultEmailConfirmed.Errors);
            }

            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = await this._tokenSerrvice.CreateToken(user),
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                Gender = user.Gender,
            });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await this._userManager.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(user => user.UserName == loginDto.Username.ToLower());

            if (user == null) return Unauthorized("Invalid credentials!");

            var result = await this._userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result) return Unauthorized("Invalid credentials!");

            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = await this._tokenSerrvice.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                Gender = user.Gender,
            });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<ActionResult<bool>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var loggedInUsername = User.GetUsername();
            var user = await this._userManager.FindByNameAsync(loggedInUsername);
            if (user == null) return NotFound("Invalid user!");

            var result = await this._userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(true);
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword(string emailAddress)
        {
            var user = await this._userManager.FindByEmailAsync(emailAddress);
            if (user == null) return NotFound("Invalid email address!");

            // even if users email address is not confirmed it assums that it is a invalid email address
            if (!user.EmailConfirmed) return NotFound("Invalid email address!");

            var resetPasswordToken = await this._userManager.GeneratePasswordResetTokenAsync(user);
            var passwordResetLink = Url.ActionLink("reset-password", "account", new { emailAddress = user.Email, resetPasswordToken = resetPasswordToken }, Request.Scheme);

            return Ok(new { passwordResetLink = passwordResetLink });
        }

        private async Task<bool> UserExists(string UserName)
        {
            return await this._userManager.Users.AnyAsync(user => user.UserName == UserName.ToLower());
        }

        private async Task<bool> UserEmailExists(string userEmail)
        {
            return (userEmail != "" && await this._userManager.Users.AnyAsync(user => user.Email.ToLower() == userEmail));
        }
    }
}
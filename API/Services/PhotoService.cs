using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _Cloudinary;

        public PhotoService(IOptions<CloudinarySettings> config)
        {
            var ac = new Account
            (
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            this._Cloudinary = new Cloudinary(ac);
        }
        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    // Transformation = new Transformation().Height(800).Width(1600).Crop("limit"),
                    Transformation = new Transformation().Height(800).Width(1600).Crop("fill").Gravity("face"),
                    Folder = "kbl"
                };
                uploadResult = await this._Cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            return await this._Cloudinary.DestroyAsync(deleteParams);
        }
    }
}
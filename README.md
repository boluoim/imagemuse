# ImageMuse

ImageMuse is a Raycast extension for image management that supports quick upload and management of images to Cloudflare R2 storage.

## Features

- 🚀 Fast image upload to Cloudflare R2
- 📁 Support for multiple image formats (JPG, PNG, GIF, WebP)
- 🔍 Image preview functionality
- 📋 Automatic copying of image links to clipboard
- 📜 Upload history viewing
- 🔄 Paginated loading of history records
- ⚡️ Upload progress display
- 🎯 File size limit check (max 10MB)

## Installation & Configuration

1. Install ImageMuse extension from Raycast Store

2. Configure the following required parameters:
   - `accountId`: Cloudflare account ID
   - `accessKeyId`: R2 access key ID
   - `secretAccessKey`: R2 secret access key
   - `bucket`: R2 bucket name
   - `r2PublicUrl`: R2 public access URL
   - `customDomain`(optional): Custom domain

## Usage

1. Upload Images
   - Open ImageMuse using shortcut
   - Select image file to upload
   - Wait for upload to complete, link will be automatically copied to clipboard

2. View History
   - Open upload history page
   - Preview images
   - Copy historical image links
   - Open images in browser

## Tech Stack

- Raycast API
- TypeScript
- AWS SDK (S3 Client)
- Cloudflare R2

## Notes

- Image size limit: 10MB
- Supported image formats: JPG, JPEG, PNG, GIF, WebP
- Upload history stores up to 100 records

## Contributing

Issues and Pull Requests are welcome!

## License

MIT License
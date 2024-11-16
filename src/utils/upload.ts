import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getPreferenceValues } from "@raycast/api";
import { getR2Client } from "./r2";

interface UploadOptions {
  buffer: Buffer;
  filename: string;
  contentType: string;
  onProgress?: (progress: number) => void;
}

function getR2Url(filename: string) {
  const preferences = getPreferenceValues<Preferences>();
  return `${preferences.r2PublicUrl}/${filename}`;
}

export async function uploadToR2({ buffer, filename, contentType, onProgress }: UploadOptions) {
  const client = getR2Client();
  const preferences = getPreferenceValues<Preferences>();

  try {
    onProgress?.(0);
    
    await client.send(
      new PutObjectCommand({
        Bucket: preferences.bucket,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );
    
    onProgress?.(1);

    return getR2Url(filename);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('Upload failed: unknown error');
  }
} 
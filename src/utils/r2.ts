import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  customDomain?: string;
}

export function getR2Client() {
  const preferences = getPreferenceValues<Preferences>();
  
  return new S3Client({
    region: "auto",
    endpoint: `https://${preferences.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: preferences.accessKeyId,
      secretAccessKey: preferences.secretAccessKey,
    },
  });
}

export function getR2Url(key: string) {
  const preferences = getPreferenceValues<Preferences>();
  const customDomain = preferences.customDomain;
  
  if (customDomain) {
    return `https://${customDomain}/${key}`;
  }
  
  return `https://${preferences.bucket}.${preferences.accountId}.r2.cloudflarestorage.com/${key}`;
}

export async function listObjects(limit: number = 20, startAfter?: string) {
  const preferences = getPreferenceValues<Preferences>();
  const client = getR2Client();
  
  const command = new ListObjectsCommand({
    Bucket: preferences.bucket,
    MaxKeys: limit,
    Marker: startAfter
  });
  
  const response = await client.send(command);
  const contents = response.Contents || [];
  return {
    objects: contents,
    hasMore: response.IsTruncated,
    lastKey: contents[contents.length - 1]?.Key || ""
  };
} 
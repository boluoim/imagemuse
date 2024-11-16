import { Action, ActionPanel, showToast, Toast, Form, Detail } from "@raycast/api";
import { useState } from "react";
import { ImagePreview } from "./components/ImagePreview";
import { uploadToR2 } from "./utils/upload";
import { generateFileName, validateFileSize, getContentType } from "./utils/file";
import { saveUploadHistory } from "./utils/history";
import fs from "fs/promises";
import ViewCommand from "./view";

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [generatedFileName, setGeneratedFileName] = useState<string | null>(null);

  async function handleFileSubmit(values: { file: string[] }) {
    try {
      setIsLoading(true);
      setUploadProgress(0);
      const filePath = values.file[0];
      const fileStats = await fs.stat(filePath);
      
      const fileExt = filePath.split('.').pop()?.toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      if (!fileExt || !allowedTypes.includes(fileExt)) {
        throw new Error("Unsupported file type");
      }

      if (!validateFileSize(fileStats.size)) {
        throw new Error("File size exceeds limit (10MB)");
      }

      setSelectedFile(filePath);
      const fileBuffer = await fs.readFile(filePath);
      const originalFileName = filePath.split("/").pop() || "";
      const fileName = generateFileName(originalFileName, true);
      setGeneratedFileName(fileName);
      const contentType = getContentType(fileName);
      
      await showToast({
        style: Toast.Style.Animated,
        title: "Uploading...",
      });

      const url = await uploadToR2({
        buffer: fileBuffer,
        filename: fileName,
        contentType,
        onProgress: (progress: number) => {
          setUploadProgress(Math.round(progress * 100));
        },
      });

      setPreviewUrl(url);
      await saveUploadHistory({
        fileName,
        url,
        timestamp: Date.now()
      });

      await showToast({
        style: Toast.Style.Success,
        title: "Upload successful",
        message: "Image link copied to clipboard"
      });

    } catch (error: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Upload failed",
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Detail
        markdown={`
# Uploading...

Progress: ${uploadProgress}%

![Upload progress](progress-bar-${uploadProgress})
        `}
      />
    );
  }

  if (previewUrl) {
    return (
      <ImagePreview
        url={previewUrl}
        fileName={generatedFileName || 'Untitled file'}
        actions={
          <ActionPanel>
            <Action.CopyToClipboard
              title="Copy link"
              content={previewUrl}
            />
            <Action.Push
              title="View Upload History"
              target={<ViewCommand />}
            />
            <Action
              title="Re-upload"
              onAction={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
              }}
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Upload image" 
            onSubmit={handleFileSubmit} 
          />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="file"
        title="Select image"
        allowMultipleSelection={false}
        canChooseDirectories={false}
      />
    </Form>
  );
} 
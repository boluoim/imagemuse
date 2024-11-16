import { Detail } from "@raycast/api";

interface UploadProgressProps {
  progress: number;
  fileName: string;
}

export function UploadProgress({ progress, fileName }: UploadProgressProps) {
  const progressBar = createProgressBar(progress);
  
  return (
    <Detail
      markdown={`
## Uploading ${fileName}

${progressBar}
${progress}%
      `}
    />
  );
}

function createProgressBar(progress: number): string {
  const width = 20;
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;
  
  return `[${"█".repeat(filled)}${"-".repeat(empty)}]`;
} 
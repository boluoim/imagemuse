import { Grid } from "@raycast/api";

interface ImagePreviewProps {
  url: string;
  fileName: string;
  fileSize?: string;
  actions?: React.ReactNode;
}

export function ImagePreview({ url, fileName, fileSize, actions }: ImagePreviewProps) {
  return (
    <Grid columns={1}>
      <Grid.Item
        content={url}
        title={fileName}
        subtitle={fileSize}
        actions={actions}
      />
    </Grid>
  );
}
import { Grid, ActionPanel, Action } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { saveToLocalStorage } from "./utils/history";
import { listObjects } from "./utils/r2";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  r2PublicUrl: string;
  pageSize: number;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  const { isLoading, data: records, pagination } = usePromise(
    () => async (options: { page: number }) => {
      const startAfter = options.page === 1 ? undefined : records?.[records.length - 1]?.fileName;
      const result = await listObjects(preferences.pageSize, startAfter);
      
      const formattedRecords = result.objects
        .filter(obj => obj.Key)
        .map(obj => ({
          fileName: obj.Key!,
          url: `${preferences.r2PublicUrl}/${obj.Key}`,
          timestamp: obj.LastModified?.getTime() || Date.now()
        }));
      
      await saveToLocalStorage([...(records ?? []), ...formattedRecords]);
      return { data: formattedRecords, hasMore: result.hasMore ?? false };
    },
    []
  );

  return (
    <Grid 
      isLoading={isLoading}
      pagination={pagination}
    >
      <Grid.Section title="Upload History">
        {records?.map((record) => (
          <Grid.Item
            key={record.timestamp}
            title={record.fileName}
            content={record.url}
            actions={
              <ActionPanel>
                <Action.Open
                  title="Open"
                  target={record.url}
                />
                <Action.CopyToClipboard
                  title="Copy Link"
                  content={record.url}
                />
              </ActionPanel>
            }
          />
        ))}
      </Grid.Section>
    </Grid>
  );
}
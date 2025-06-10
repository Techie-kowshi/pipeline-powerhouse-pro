
export interface DataSource {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error" | "testing";
  description: string;
  lastSync: string;
  recordCount: string;
  connectionString?: string;
}

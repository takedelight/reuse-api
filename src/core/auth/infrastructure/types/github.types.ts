export interface IGithubResponse {
  id: string;
  nodeId: string;
  displayName: string | null;
  username: string;
  profileUrl: string;
  emails?: Array<{
    value: string;
    primary?: boolean;
    verified?: boolean;
  }>;
  photos?: Array<{
    value: string;
  }>;
  provider: 'github';
  _raw: string;
  _json: Record<string, any>;
}

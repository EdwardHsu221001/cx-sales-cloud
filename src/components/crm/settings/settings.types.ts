// Settings 共用型別（自 Settings.tsx 抽出）。

export type RoleKey = 'admin' | 'director' | 'manager' | 'senior' | 'rep' | 'support';

export interface UserData {
  av: string;
  g: string;
  name: string;
  email: string;
  title: string;
  role: RoleKey;
  profile: string;
  perms: string[];
  status: 'active' | 'inactive' | 'pending';
  last: string;
  since: string;
}

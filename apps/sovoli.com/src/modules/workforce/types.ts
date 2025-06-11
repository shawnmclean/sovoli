export interface Department {
  name: string;
  slug: string;
  description: string;
  image: string;
  url: string;
}

export interface Team {
  name: string;
  slug: string;
  description: string;
  image: string;
  url: string;
}

export interface Position {
  name: string;
  slug: string;
  description: string;
  image: string;
  url: string;
}

export interface WorkforceMember {
  name: string;
  slug: string;
  departments: Department[];
  teams: Team[];
  positions: Position[];
  email?: string;
  phone?: string;
  image?: string;
  bio?: string;
}

export interface WorkforceModule {
  members: WorkforceMember[];
}

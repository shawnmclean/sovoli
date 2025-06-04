export interface Program {
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface AcademicModule {
  programs: Program[];
}

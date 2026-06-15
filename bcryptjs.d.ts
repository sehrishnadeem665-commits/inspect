declare module 'bcryptjs' {
  export function hashSync(data: string, rounds: number): string;
  export function compareSync(data: string, encrypted: string): boolean;
  export function hash(data: string, rounds: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

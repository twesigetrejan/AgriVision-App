// env.d.ts

declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_KEY: string;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}
declare module '*.json' {
  const value: any;
  export default value;
}
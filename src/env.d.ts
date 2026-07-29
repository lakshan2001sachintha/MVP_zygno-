import { EnvConfig } from "./env"; // Adjust path as necessary

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {}
  }

  interface ImportMetaEnv extends EnvConfig {}
}

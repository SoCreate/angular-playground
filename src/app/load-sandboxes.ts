import { Sandbox, SandboxMenuItem } from './shared/app-state';
declare const require: any;

export function sandboxLoaderFactory(): Function {
  return (path: string): Promise<Sandbox> => require('sandboxes').getSandbox(path);
}

export function loadSandboxMenuItems(): SandboxMenuItem[] {
  return require('sandboxes').getSandboxMenuItems();
}

import { Eta as EtaCore } from "./core";
import { readFile, resolvePath } from "./file-handling";

export class Eta extends EtaCore {
  readFile = readFile;

  resolvePath = resolvePath;
}

export { EtaError } from "./err";
export { Eta as EtaCore } from "./core";
export type { Options, trimConfig } from "./config";
export type { TemplateFunction } from "./compile"

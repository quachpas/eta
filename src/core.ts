import { Cacher } from "./storage";
import { compile } from "./compile";
import { compileToString, compileBody } from "./compile-string";
import { defaultConfig } from "./config";
import { parse } from "./parse";
import { render, renderAsync, renderString, renderStringAsync } from "./render";
import { RuntimeErr, EtaError } from "./err";
import { TemplateFunction } from "./compile";

/* TYPES */
import type { EtaConfig, Options } from "./config";
/* END TYPES */

export class Eta {
  constructor(customConfig?: Partial<EtaConfig>) {
    if (customConfig) {
      this.config = { ...defaultConfig, ...customConfig };
    } else {
      this.config = { ...defaultConfig };
    }
  }

  config: EtaConfig;

  RuntimeErr = RuntimeErr;

  compile = compile;
  compileToString = compileToString;
  compileBody = compileBody;
  parse = parse;
  render: (
    template: string | TemplateFunction,
    data: object,
    meta?: { filepath: string }
  ) => string = render;
  renderAsync: (
    template: string | TemplateFunction,
    data: object,
    meta?: { filepath: string }
  ) => Promise<string> = renderAsync;
  renderString: (template: string, data: object) => string = renderString;
  renderStringAsync: (template: string, data: object) => Promise<string> = renderStringAsync;

  filepathCache: Record<string, string> = {};
  templatesSync = new Cacher<TemplateFunction>({});
  templatesAsync = new Cacher<TemplateFunction>({});

  // resolvePath takes a relative path from the "views" directory
  resolvePath: null | ((template: string, options?: Partial<Options>) => string) = null;
  readFile: null | ((path: string) => string) = null;

  // METHODS

  configure(customConfig: Partial<EtaConfig>) {
    this.config = { ...this.config, ...customConfig };
  }

  withConfig(customConfig: Partial<EtaConfig>) {
    return { ...this, config: { ...this.config, ...customConfig } };
  }

  loadTemplate(
    name: string,
    template: string | TemplateFunction, // template string or template function
    options?: { async: boolean }
  ): void {
    if (typeof template === "string") {
      const templates = options && options.async ? this.templatesAsync : this.templatesSync;

      templates.define(name, this.compile(template, options));
    } else {
      let templates = this.templatesSync;

      if (template.constructor.name === "AsyncFunction" || (options && options.async)) {
        templates = this.templatesAsync;
      }

      templates.define(name, template);
    }
  }
}

// for instance checking against thrown errors
export { EtaError };

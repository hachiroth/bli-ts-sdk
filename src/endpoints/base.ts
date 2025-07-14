import type Bli from "@/bli";
import type { HttpOption } from "@/typed/core";

export default class BaseEndpoint {
  private instance: Bli;

  constructor(instance: Bli) {
    this.instance = instance;
  }

  private mergeHeaders(...headers: object[]) {
    return { ...headers };
  }

  protected createRequest(options?: Pick<HttpOption, "headers">) {
    const headers = options?.headers ?? {};
    return {
      get: (url: string, query = {}, options?: Pick<HttpOption, "headers">) =>
        this.instance.handleRequest({
          url,
          method: "GET",
          query,
          headers: this.mergeHeaders(headers, options?.headers ?? {}),
        }),
      post: (url: string, body = {}, options?: Pick<HttpOption, "headers">) =>
        this.instance.handleRequest({
          url,
          method: "POST",
          body,
          headers: this.mergeHeaders(headers, options?.headers ?? {}),
        }),
    };
  }
}

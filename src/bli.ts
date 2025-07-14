import type { HttpOption, InitOption } from "./typed/core";

class Bli {
  private static initializing = false;
  private static instance: Bli;
  private errorHandler?: InitOption["errorHandler"];
  private responseHandler?: InitOption["responseHandler"];

  private constructor() {
    if (!Bli.initializing) {
      throw new Error("Use 'init()' to create an instance.");
    }

    if (Bli.instance) {
      return Bli.instance;
    }

    Bli.instance = this;
  }

  static init(options?: InitOption) {
    if (!Bli.instance) {
      Bli.initializing = true;
      Bli.instance = new Bli();
      Bli.initializing = false;
    }

    if (options) {
      Bli.instance.errorHandler = options.errorHandler;
      Bli.instance.responseHandler = options.responseHandler;
    }

    const { ...instance } = Bli.instance;
    return instance;
  }

  private onError = (error: any) => {
    if (this.errorHandler) {
      return this.errorHandler(error);
    } else {
      throw error;
    }
  };

  async handleRequest(options: HttpOption) {
    const { url, method, query, body, headers } = options;

    const urlObj = new URL(url);
    Object.entries(query ?? {}).forEach(([k, v]) => {
      urlObj.searchParams.append(k, v);
    });
    const input = urlObj.toString();

    const init: RequestInit = {
      method: method || "GET",
      headers: { ...(headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
    };

    const promise = fetch(input, init);

    try {
      const response = await promise;
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const error = `HTTP ${response.status} ${response.statusText}`;
        return this.onError(error);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return this.responseHandler ? this.responseHandler(data) : data;
      } else {
        const text = await response.text();
        const error = `Expected JSON, but got:", ${text.slice(0, 200)}`;
        return this.onError(error);
      }
    } catch (error) {
      return this.onError(error);
    }
  }
}

export default Bli;

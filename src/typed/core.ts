export interface HttpOption {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: object;
  body?: object;
  headers?: object;
}

export interface InitOption {
  errorHandler?: (error: any) => any;
  responseHandler?: (response: any) => any;
}

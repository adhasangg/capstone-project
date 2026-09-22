export interface ApiResponseSuccess<T> {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
}

export interface ApiResponseError {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: ReadonlyArray<string>;
  };
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

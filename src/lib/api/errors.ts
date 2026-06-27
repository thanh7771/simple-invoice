export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function readApiError(
  response: Response,
  fallback: string
): Promise<ApiError> {
  const errorText = await response.text();
  const detail = errorText ? `: ${errorText}` : "";
  return new ApiError(`${fallback} (${response.status})${detail}`, response.status);
}

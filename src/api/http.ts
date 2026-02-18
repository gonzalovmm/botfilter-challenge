export const BASE_URL = "PEGÁ_ACÁ_EL_BASE_URL_DEL_MAIL";

async function safeReadJson(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
}

export async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);
  const data = await safeReadJson(response);

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `HTTP ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return data as T;
}

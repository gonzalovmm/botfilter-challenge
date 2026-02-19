export const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

async function readBody(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return response.text(); // por si viene texto
}

export async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const body: any = await readBody(res);

  if (!res.ok) {
    // La API dice que devuelve mensajes descriptivos: los mostramos
    const msg =
      (typeof body === "object" && (body.message || body.error)) ||
      (typeof body === "string" && body) ||
      `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return body as T;
}

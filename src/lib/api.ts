// Central place to build backend URLs from Vite env vars.
// Vite env vars are available at build time; make sure to restart the dev server after changing them.

export function getApiBaseUrl() {
  const isProd = (import.meta as any).env?.VITE_IS_PROD === "true"

  const baseUrl = isProd
    ? ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined)
    : ((import.meta as any).env?.VITE_API_LOCAL_BASE_URL as string | undefined)

  // Fallback for a smoother dev experience.
  return (baseUrl ?? "http://localhost:3000").replace(/\/$/, "")
}

export function getCasesUrl() {
  return `${getApiBaseUrl()}/cases`
}


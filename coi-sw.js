// Adds cross-origin isolation headers (COOP/COEP) to every response so the page can use SharedArrayBuffer
// threads even when its host (GitHub Pages) cannot send them. Same idea as the coi-serviceworker project.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;
  e.respondWith(fetch(r).then((resp) => {
    if (resp.status === 0) return resp;                       // opaque: can't be modified
    const h = new Headers(resp.headers);
    h.set("Cross-Origin-Embedder-Policy", "require-corp");
    h.set("Cross-Origin-Opener-Policy", "same-origin");
    if (!h.has("Cross-Origin-Resource-Policy")) h.set("Cross-Origin-Resource-Policy", "cross-origin");
    return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: h });
  }).catch((err) => { console.error(err); return Response.error(); }));
});

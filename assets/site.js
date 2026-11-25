// Shared site helpers: SillyOS token, API base, nav state.
(function () {
  const API = (window.WR_API || '').replace(/\/$/, '');
  const KEY = 'webroyale_sillyos_token';
  const get = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const set = (t) => { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch (e) {} };
  const user = () => { try { return localStorage.getItem('webroyale_site_user') || ''; } catch (e) { return ''; } };
  window.WR = {
    API, token: get, setToken: set, user,
    setUser: (u) => { try { u ? localStorage.setItem('webroyale_site_user', u) : localStorage.removeItem('webroyale_site_user'); } catch (e) {} },
    signOut: () => { set(''); window.WR.setUser(''); },
    bridge: (path, body) => fetch(API + '/bridge' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    safeNext: (n) => (n && /^\/(?!\/)[\w\-\/?=&.]*$/.test(n) ? n : '/account/'),
  };
  // Old builds registered a cross-origin-isolation service worker over the whole site; only /play/ needs it now.
  if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => {
    if (new URL(r.scope).pathname === '/') r.unregister();
  })).catch(() => {});
  // Nav: signed in -> "My Account"; signed out -> Login + Sign up.
  document.addEventListener('DOMContentLoaded', () => {
    const box = document.getElementById('navAuth'); if (!box || !get()) return;
    const u = user();
    box.innerHTML = (u ? '<span class="who">' + u.replace(/[<>&"]/g, '') + '</span>' : '') +
      '<a class="btn sm gold" href="/account/">My Account</a>';
  });
})();

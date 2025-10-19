// Placeholder for visitor counter integration (Stage 2)
// For now, set year and keep a simple fallback for the counter.

document.getElementById('year').textContent = new Date().getFullYear();

(async function initVisitorCount() {
  const el = document.getElementById('visitor-count');
  try {
    // TODO: Replace with your API invoke URL in Stage 2
    // const resp = await fetch('YOUR_API_GATEWAY_INVOKE_URL');
    // const data = await resp.json();
    // el.textContent = data.count;

    // Temporary placeholder:
    el.textContent = '—';
  } catch (e) {
    el.textContent = '—';
    console.error('Visitor count error:', e);
  }
})();

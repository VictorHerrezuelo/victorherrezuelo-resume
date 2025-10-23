// Placeholder for visitor counter integration (Stage 2)
// For now, set year and keep a simple fallback for the counter.

document.getElementById('year').textContent = new Date().getFullYear();

(async function initVisitorCount() {
  const el = document.getElementById('visitor-count');
  try {
    const resp = await fetch('https://hza6zgjp33.execute-api.us-east-1.amazonaws.com/prod/counter');
    const data = await resp.json();
    console.log("API raw response:", data);
    const body = JSON.parse(data.body);
    console.log("Parsed body:", body);
    el.textContent = body.count;
  } catch (e) {
    el.textContent = '—';
    console.error('Visitor count error:', e);
  }
})();

// Fetch and display Credly certifications
(async function initCredlyBadges() {
  const gridEl = document.getElementById('certifications-grid');
  
  try {
    const response = await fetch('https://mqgrmeiggk.execute-api.us-east-2.amazonaws.com/credly/badges?email=vherrez@amazon.es');
    const badges = await response.json();
    
    // Clear placeholder
    gridEl.innerHTML = '';
    
    // Show all badges, sort by order, then by issued date
    const allBadges = badges.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.issued) - new Date(a.issued);
    });
    
    if (allBadges.length === 0) {
      gridEl.innerHTML = '<div class="certification-placeholder">No certifications found.</div>';
      return;
    }
    
    // Create badge elements with only images
    allBadges.forEach(badge => {
      const badgeEl = document.createElement('a');
      badgeEl.href = badge.url;
      badgeEl.target = '_blank';
      badgeEl.rel = 'noopener';
      badgeEl.className = 'certification-badge';
      badgeEl.title = badge.name; // Show name on hover
      
      badgeEl.innerHTML = `
        <img src="${badge.image}" alt="${badge.name}" loading="lazy">
      `;
      
      gridEl.appendChild(badgeEl);
    });
    
  } catch (error) {
    console.error('Error fetching Credly badges:', error);
    gridEl.innerHTML = '<div class="certification-placeholder">Unable to load certifications at this time.</div>';
  }
})();

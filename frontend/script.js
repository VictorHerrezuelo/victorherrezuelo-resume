/**
 * Cloud Resume JavaScript
 * Handles visitor counting and Credly certification display
 */

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

/**
 * Extracts visitor ID
 */
function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

/**
 * Visitor Counter
 */
(async function initVisitorCount() {
  const counterElement = document.getElementById('visitor-count');
  const visitorId = getVisitorId();

  try {
    const response = await fetch('https://6pbqxwiuh2.execute-api.us-east-1.amazonaws.com/Prod/counter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    counterElement.textContent = data.count;
  } catch (error) {
    counterElement.textContent = '—';
    console.error('Visitor count error:', error);
  }
})();

/**
 * Credly Badges
 */
(async function initCredlyBadges() {
  const gridElement = document.getElementById('certifications-grid');

  try {
    const response = await fetch('https://mqgrmeiggk.execute-api.us-east-2.amazonaws.com/credly/badges?email=vherrez@amazon.es');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const badges = await response.json();

    // Clear loading placeholder
    gridElement.innerHTML = '';

    // Sort badges: primary by order field, secondary by issue date (newest first)
    const sortedBadges = badges.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.issued) - new Date(a.issued);
    });

    // Handle empty results
    if (sortedBadges.length === 0) {
      gridElement.innerHTML = '<div class="certification-placeholder">No certifications found.</div>';
      return;
    }

    // Create interactive badge elements
    sortedBadges.forEach(badge => {
      const badgeLink = document.createElement('a');
      badgeLink.href = badge.url;
      badgeLink.target = '_blank';
      badgeLink.rel = 'noopener noreferrer'; // Security best practice
      badgeLink.className = 'certification-badge';
      badgeLink.title = badge.name; // Tooltip on hover

      badgeLink.innerHTML = `
        <img src="${badge.image}" alt="${badge.name}" loading="lazy">
      `;

      gridElement.appendChild(badgeLink);
    });

  } catch (error) {
    console.error('Error fetching Credly badges:', error);
    gridElement.innerHTML = '<div class="certification-placeholder">Unable to load certifications at this time.</div>';
  }
})();

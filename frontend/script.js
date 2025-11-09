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

  // Hardcoded fallback badges
  const fallbackBadges = [
    {
      name: 'AWS Certified Cloud Practitioner',
      image: 'https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png',
      url: 'https://www.credly.com/org/amazon-web-services/badge/aws-certified-cloud-practitioner'
    },
    {
      name: 'AWS Certified AI Practitioner',
      image: 'https://images.credly.com/images/4d4693bb-530e-4bca-9327-de07f3aa2348/image.png',
      url: 'https://www.credly.com/org/amazon-web-services/badge/aws-certified-ai-practitioner'
    },
    {
      name: 'AWS Certified Solutions Architect - Associate',
      image: 'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
      url: 'https://www.credly.com/org/amazon-web-services/badge/aws-certified-solutions-architect-associate'
    }
  ];

  try {
    const response = await fetch('https://mqgrmeiggk.execute-api.us-east-2.amazonaws.com/credly/badges?email=vherrez@amazon.es');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const badges = await response.json();

    // Clear loading placeholder
    gridElement.innerHTML = '';

    // Sort badges if they come from API, otherwise use fallback
    const sortedBadges = badges.length > 0 
      ? badges.sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return new Date(b.issued) - new Date(a.issued);
        })
      : fallbackBadges;

    // Create interactive badge elements
    sortedBadges.forEach(badge => {
      const badgeLink = document.createElement('a');
      badgeLink.href = badge.url;
      badgeLink.target = '_blank';
      badgeLink.rel = 'noopener noreferrer';
      badgeLink.className = 'certification-badge';
      badgeLink.title = badge.name;

      badgeLink.innerHTML = `
        <img src="${badge.image}" alt="${badge.name}" loading="lazy">
      `;

      gridElement.appendChild(badgeLink);
    });

  } catch (error) {
    console.error('Error fetching Credly badges:', error);
    // Show fallback badges on error
    gridElement.innerHTML = '';
    fallbackBadges.forEach(badge => {
      const badgeLink = document.createElement('a');
      badgeLink.href = badge.url;
      badgeLink.target = '_blank';
      badgeLink.rel = 'noopener noreferrer';
      badgeLink.className = 'certification-badge';
      badgeLink.title = badge.name;

      badgeLink.innerHTML = `
        <img src="${badge.image}" alt="${badge.name}" loading="lazy">
      `;

      gridElement.appendChild(badgeLink);
    });
  }
})();

/**
 * Architecture toggle logic
 */

document.getElementById('toggle-architecture').addEventListener('click', () => {
  const section = document.getElementById('architecture-section');
  const button = document.getElementById('toggle-architecture');

  if (section.style.display === 'none') {
    section.style.display = 'block';
    button.textContent = 'Hide Architecture';
  } else {
    section.style.display = 'none';
    button.textContent = 'Show Architecture';
  }
});

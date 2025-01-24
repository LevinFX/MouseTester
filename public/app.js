// Banner Navigation
document.querySelectorAll('#banner button').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      document.querySelectorAll('#banner button, .test-segment').forEach(el => {
        el.classList.remove('active');
      });
      
      // Add active class to clicked
      const target = btn.dataset.target;
      btn.classList.add('active');
      document.querySelector(`[data-segment="${target}"]`).classList.add('active');
    });
  });
  
  // Testausführung
  async function runTest(type) {
    const profile = await getSelectedProfile();
    if (!profile) return alert('Bitte erst ein Profil auswählen!');
  
    try {
      let result;
      switch(type) {
        case 'polling':
          result = await fetch('/api/tests/polling', {
            method: 'POST',
            body: JSON.stringify({ profileId: profile.id })
          });
          displayPollingResult(await result.json());
          break;
  
        case 'dpi':
          const distance = document.getElementById('distance').value;
          result = await fetch('/api/tests/dpi', {
            method: 'POST',
            body: JSON.stringify({ 
              profileId: profile.id,
              distance: distance 
            })
          });
          displayDpiResult(await result.json());
          break;
      }
      
      updateOverview();
    } catch (error) {
      showError(error.message);
    }
  }
  
  // Ergebnisanzeige
  function displayPollingResult(data) {
    const resultDiv = document.getElementById('polling-result');
    resultDiv.innerHTML = `
      <div class="text-lg">
        <span class="font-bold">${data.value} Hz</span>
        <span class="text-sm text-gray-600">(gemessen über ${data.duration}s)</span>
      </div>
      <div class="mt-2 text-sm">
        ${getRatingBadge(data.value, [
          { threshold: 800, label: 'Hervorragend', color: 'bg-green-500' },
          { threshold: 500, label: 'Gut', color: 'bg-blue-500' },
          { threshold: 0, label: 'Akzeptabel', color: 'bg-yellow-500' }
        ])}
      </div>
    `;
  }
  
  function getRatingBadge(value, thresholds) {
    const { label, color } = thresholds.find(t => value >= t.threshold);
    return `<span class="${color} text-white px-2 py-1 rounded-full text-xs">${label}</span>`;
  }
  
  // Initialisierung
  async function init() {
    await loadProfiles();
    initProfileSelector();
    updateOverview();
  }
  
  // Start the app
  init();
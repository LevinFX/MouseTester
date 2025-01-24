async function runPollingTest() {
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '<div class="text-gray-600">Testing... (move mouse continuously)</div>';
  
    try {
      const response = await fetch('/api/test/polling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: '/dev/input/event3' }) // Auto-detect implementieren
      });
      
      const data = await response.json();
      resultDiv.innerHTML = `
        <div class="text-green-600 font-bold">
          Polling Rate: ${data.polling_rate} Hz
        </div>
      `;
      
      updateChart(data.polling_rate);
      //saveResult(data);
      
    } catch (error) {
      resultDiv.innerHTML = `<div class="text-red-600">Error: ${error.message}</div>`;
    }
  }
  
  // Chart Initialization
  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Polling Rate (Hz)',
        data: [],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }]
    }
  });
  
  function updateChart(value) {
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(value);
    chart.update();
  }
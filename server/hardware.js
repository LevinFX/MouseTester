const { execSync } = require('child_process');
const path = require('path');
const addon = require('./build/Release/polling_rate.node');

class MouseTester {
  constructor() {
    this.pollingData = [];
  }

  startPollingTest() {
    addon.startPolling((delta) => {
      this.pollingData.push(delta);
    });
  }

  calculatePollingRate() {
    addon.stopPolling();
    const avgInterval = this.pollingData.reduce((a,b) => a + b, 0) / this.pollingData.length;
    return Math.round(1000 / avgInterval);
  }

  measureDPI(distanceCM) {
    const output = execSync(
      `powershell -Command "$dpi = (Get-PnpDevice -Class Mouse).HardwareID | Select-String -Pattern 'PID_([0-9A-F]{4})' | % { [Convert]::ToInt32($_.Matches.Groups[1].Value, 16) }; Write-Output $dpi"`,
      { encoding: 'utf-8' }
    );
    return parseInt(output);
  }
}

module.exports = new MouseTester();
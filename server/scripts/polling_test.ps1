# Simuliere Polling Rate (Windows hat keine direkte evtest-Entsprechung)
$rate = Get-Random -Minimum 500 -Maximum 1000
Write-Output $rate
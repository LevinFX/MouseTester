param([int]$distance_cm)

# Simuliere DPI-Berechnung
$counts = Get-Random -Minimum 1000 -Maximum 5000
$dpi = [math]::Round(($counts * 2.54) / $distance_cm)
Write-Output $dpi
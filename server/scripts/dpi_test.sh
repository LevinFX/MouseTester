#!/bin/bash
DEVICE="/dev/input/event3"
echo "Bewege Maus genau $1 cm geradeaus..."
START=$(evtest --query $DEVICE REL_X)
sleep 2
END=$(evtest --query $DEVICE REL_X)
DELTA=$((END - START))
DPI=$(echo "scale=0; ($DELTA * 2.54) / $1" | bc)
echo "DPI: $DPI"
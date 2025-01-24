#!/bin/bash
DEVICE="/dev/input/event3"
evtest --grab $DEVICE | grep "Event:" | wc -l
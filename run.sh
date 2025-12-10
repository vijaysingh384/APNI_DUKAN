#!/bin/bash
# Helper script to run npm commands from the root directory
cd "$(dirname "$0")/APNIDUKAN" && npm "$@"


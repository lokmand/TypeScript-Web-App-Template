#!/bin/bash

# This script allows us the development Docker container to watch for changes
# to the files (and rebuild when necessary) and serve the web app on port 80.

# Start the first process
npm run watch &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start \"gulp watch\": $status"
  exit $status
fi

# Start the second process
npm start &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start the express server: $status"
  exit $status
fi

# Check if one of the processes has quit - if so, exit the container.
while sleep 60; do
  ps aux |grep npm |grep -q -v grep
  PROCESS_1_STATUS=$?
  # If the greps above find anything, they exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 ]; then
    echo "One of the processes has exited."
    exit 1
  fi
done
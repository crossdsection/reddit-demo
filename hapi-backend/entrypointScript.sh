#!/bin/sh

# Abort on any error (including if wait-for-it fails).
set -e
# Wait for the backend to be up, if we know where it is.
echo $MONGO_HOST;
if [ -n "$MONGO_HOST" ]; then
  ./wait-for-it.sh -t 0 -h $MONGO_HOST -p $MONGO_PORT
fi
if [ -n "$REDIS_HOST" ]; then
  ./wait-for-it.sh -t 0 -h $REDIS_HOST -p $REDIS_PORT
fi
echo "Starting Backend"
# Run the main container command.
npm start

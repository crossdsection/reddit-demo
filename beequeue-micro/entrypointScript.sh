#!/bin/sh

# Abort on any error (including if wait-for-it fails).
set -e

# Wait for the backend to be up, if we know where it is.
if [ -n "$MONGODB_HOST" ]; then
  ./wait-for-it.sh -t 0 -h $MONGODB_HOST -p $MONGODB_PORT
fi
if [ -n "$REDIS_HOST" ]; then
  ./wait-for-it.sh -t 0 -h $REDIS_HOST -p $REDIS_PORT
fi

# Run the main container command.
npm start

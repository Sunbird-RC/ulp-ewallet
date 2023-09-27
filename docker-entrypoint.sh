#!/bin/bash
echo "Hello"
docker cp config.json my-ewallet:/shared/
exec "$@"
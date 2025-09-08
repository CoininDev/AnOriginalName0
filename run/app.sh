#!/bin/bash

mkdir run/tmp

run/embed.sh > /dev/null &
echo $! > run/tmp/embed.pid
sleep 3

run/server.sh > /dev/null &
echo $! > run/tmp/server.pid
sleep 3

run/client.sh > /dev/null &
echo $! > run/tmp/client.pid
sleep 3

echo "app initialized!"

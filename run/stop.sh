#!/bin/bash

kill $(cat run/tmp/embed.pid)
kill $(cat run/tmp/server.pid)
kill $(cat run/tmp/client.pid)
rm -rf run/tmp

echo "app interrupted"
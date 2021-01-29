#!/bin/bash

# Exit when any command fails
set -e

STAGE=$(${DIR}/getEC2TagValue.sh Stage)

if [[ $STAGE == "production" ]]; then
    echo "Renewing certificates on production"
    sudo certbot renew
else
    echo "Not renewing certificates on ${STAGE}"
fi

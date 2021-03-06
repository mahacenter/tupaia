#!/bin/bash
# This script deploys the repositories on startup

# Set PATH to include depencencies
export PATH=/home/ubuntu/.local/bin:/home/ubuntu/.yarn/bin:/home/ubuntu/.config/yarn/global/node_modules/.bin:/home/ubuntu/.nvm/versions/node/v12.18.3/bin:/usr/local/bin:$PATH

# Set the home directory of the user
export HOME_DIRECTORY="/home/ubuntu/tupaia"

DIR=$(dirname "$0")
export STAGE=$(${DIR}/../utility/getEC2TagValue.sh Stage)
echo "Starting up instance for ${STAGE}"

# Set the branch based on STAGE
if [[ $STAGE == "production" ]]; then
    export BRANCH="master"
else
    export BRANCH="$STAGE"
fi

# Fetch the latest code
${HOME_DIRECTORY}/packages/devops/scripts/deployment/checkoutLatest.sh

# Deploy each package based on the stage, including injecting environment variables from parameter
# store into the .env file
${HOME_DIRECTORY}/packages/devops/scripts/deployment/deployPackages.sh

# Set nginx config and start the service running
${HOME_DIRECTORY}/packages/devops/scripts/deployment/configureNginx.sh

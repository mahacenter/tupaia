#!/bin/bash

# Kill all pm2 processes
echo "Existing processes:"
pm2 list
echo "Deleting..."
pm2 delete all

# Set the path of environment variables from parameter store
if [[ $BRANCH == "master" ]]; then
    ENVIRONMENT="production"
elif [[ "$BRANCH" == *e2e ]]; then
    # The branch ends in "-e2e", use the e2e specific environment variables
    ENVIRONMENT="e2e"
else
    # Any other branch uses the default dev environment variables
    ENVIRONMENT="dev"
fi

PACKAGES=("meditrak-server" "web-config-server" "psss-server" "report-server" "web-frontend" "admin-panel" "psss")
# For each package, get the latest and deploy it
for PACKAGE in ${PACKAGES[@]}; do
    # Set up .env to match the environment variables stored in SSM parameter store
    cd ${HOME_DIRECTORY}/packages/$PACKAGE
    rm .env
    echo "Checking out ${ENVIRONMENT} environment variables for ${PACKAGE}"
    SSM_PATH="/${PACKAGE}/${ENVIRONMENT}"
    $(aws ssm get-parameters-by-path --with-decryption --path $SSM_PATH |
        jq -r '.Parameters| .[] | .Name + "=\"" + .Value + "\""  ' |
        sed -e "s~${SSM_PATH}/~~" >.env)

    # Replace any instances of the placeholder [branch-name] in the .env file with the actual branch
    # name (e.g. [branch-name]-api.tupaia.org -> specific-branch-api.tupaia.org)
    sed -i -e "s/\[branch-name\]/${BRANCH}/g" .env

    # If it's a server, start it running on pm2, otherwise build it
    echo "Preparing to start or build ${PACKAGE}"
    if [[ $PACKAGE == *server ]]; then
        # It's a server, start the pm2 process
        echo "Starting ${PACKAGE}"
        yarn build
        pm2 start --name $PACKAGE dist --wait-ready --listen-timeout 15000 --time
    else
        # It's a static site, build it
        echo "Building ${PACKAGE}"
        yarn build
    fi

    # reset cwd back to `/tupaia`
    cd ${HOME_DIRECTORY}

    if [[ $PACKAGE == 'meditrak-server' ]]; then
        # now that meditrak-server is up and listening for changes, we can run any migrations
        # if run earlier when meditrak-server isn't listening, changes will be missed from the
        # sync queues
        echo "Migrating the database"
        yarn migrate
    fi
done

echo "Finished deploying latest"

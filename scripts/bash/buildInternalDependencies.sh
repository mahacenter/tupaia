#!/bin/bash
DIR=`dirname "$0"`
concurrent_build_commands=""
for PACKAGE in $(${DIR}/getInternalDependencies.sh); do
  if [[ ${PACKAGE} != "ui-components" ]]; then # skip ui-components, as it is too resource-intensive to run in parallel
    concurrent_build_commands="${concurrent_build_commands} \"yarn workspace @tupaia/${PACKAGE} build $1\"" # $1 may pass in --watch
  fi
done
echo "Building internal dependencies in parallel"
echo "yarn concurrently ${concurrent_build_commands}"
eval "yarn concurrently ${concurrent_build_commands}"

echo "Building ui-components in serial"
yarn workspace @tupaia/ui-components build

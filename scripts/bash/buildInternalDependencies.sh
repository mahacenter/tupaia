#!/bin/bash

DIR=`dirname "$0"`

USAGE="Usage: buildInternalDependencies.sh [--watch] [--withTypes]"

watch=false
with_types=false
while [ "$1" != "" ]; do
  case $1 in
      --watch)
        shift
        watch=true
        ;;
      --withTypes)
        shift
        with_types=true
        shift
        ;;
      -h | --help )
        echo -e "$USAGE\n";
        exit
        ;;
      * )
        echo -e "$USAGE\n"
        exit 1
  esac
done

[[ $watch = "true" ]] && build_args="--watch" || build_args=""
[[ $watch = "true" ]] && build_ts_args="--watch" || build_ts_args=""

concurrent_build_commands=()
serial_build_commands=()

# Build dependencies
for PACKAGE in $(${DIR}/getInternalDependencies.sh); do
  build_command="yarn workspace @tupaia/${PACKAGE} build $build_args"
  serial_build_commands+=("${build_command}")
done

# Build types
if [ $with_types == "true" ]; then
  for PACKAGE in $(${DIR}/getTypedInternalDependencies.sh); do
    concurrent_build_commands+=("\"yarn workspace @tupaia/${PACKAGE} build:ts $build_ts_args\"")
  done
fi

echo "Serially building resource intensive internal dependencies"
for build_command in "${serial_build_commands[@]}"; do
  echo ${build_command}
  ${build_command}
done


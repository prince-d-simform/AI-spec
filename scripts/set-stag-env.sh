#!/bin/bash

#Load the environment variables from the .env.preview file for EAS builds, even if it is included in the gitignore
#https://github.com/expo/eas-cli/issues/2195#issuecomment-2299752433
set -a; source .env.preview; set +a

# Execute command passed as arguments to this script
"$@"
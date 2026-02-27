
#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo ".env file does not exist. Creating .env file..."
  touch .env
fi

# Replace content of .env file with the desired environment file
if [ "$1" == "prod" ]; then
  cp .env.production .env
elif [ "$1" == "preview" ]; then
  cp .env.preview .env
elif [ "$1" == "dev" ]; then
  cp .env.development .env
else
  echo "Invalid environment specified. Please use 'production', 'preview', or 'development'."
  exit 1
fi

echo ".env file has been updated with $1 environment variables."

#!/bin/bash

# Coffee Shop API Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

# Default to dev if no argument provided
STAGE=${1:-dev}

# Validate stage
if [[ "$STAGE" != "dev" && "$STAGE" != "prod" ]]; then
    echo "Error: Stage must be either 'dev' or 'prod'"
    echo "Usage: ./deploy.sh [dev|prod]"
    exit 1
fi

echo "Deploying to $STAGE environment..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    yarn install
fi

# Run tests
echo "Running tests..."
npm test

# Deploy using Serverless Framework
echo "Deploying with Serverless Framework..."
serverless deploy --stage $STAGE --verbose

echo "Deployment to $STAGE complete!"

# Get and display API endpoints
echo "API Endpoints:"
serverless info --stage $STAGE | grep -A 10 "endpoints:"

echo "Done!"
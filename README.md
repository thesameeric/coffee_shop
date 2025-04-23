# Coffee Shop Serverless API

A complete serverless REST API for managing coffee shop orders built with AWS Lambda, API Gateway, and DynamoDB. This project demonstrates a complete CI/CD pipeline using GitHub Actions for multistage deployments.

## Architecture

- **AWS API Gateway**: Provides the REST API endpoints
- **AWS Lambda**: Handles business logic with Node.js
- **DynamoDB**: Stores product data
- **Serverless Framework**: Infrastructure as Code
- **GitHub Actions**: CI/CD pipeline for automated deployments

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- Pushing to the `dev` branch automatically deploys to the development environment
- Pushing to the `main` branch automatically deploys to the production environment

### Setting up GitHub Secrets

To enable the CI/CD pipeline, you need to set the following secrets in your GitHub repository:

1. `AWS_ACCESS_KEY_ID`: Your AWS access key
2. `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
3. `AWS_REGION`: Your AWS region (e.g., us-east-1)
4. `SERVERLESS_ACCESS_KEY`: Serverless access key

## Development Setup

### Prerequisites

- Node.js (version 20.x or higher)
- yarn
- AWS CLI configured with appropriate credentials
- Serverless Framework
- Dynamodb


### Installation

```bash
# Clone the repository
git clone https://github.com/thesameeric/coffee_shop.git
cd coffee_shop

# Install dependencies
yarn install

# Install Serverless Framework globally
yarn global add serverless
```

### Local Development

```bash
# Run the API with hot reload
yarn offline

# Invoke a function locally
serverless invoke local --function getAll

# Start API Gateway locally for testing
serverless offline
```

### Database
To run Dynamodb locally, follow the steps [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)

### Manual Deployment

```bash
# Deploy to development
serverless deploy --stage dev

# Deploy to production
serverless deploy --stage prod
```

## Project Structure

```
coffee-shop-api/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── handlers/               # Lambda function handlers
│   │   ├── create.js
│   │   ├── delete.js
│   │   ├── getAll.js
│   │   ├── getById.js
│   │   └── update.js
│   ├── common/
│       |── utils.ts
|       |__ types.ts
|       |__ migration.ts         # Helper functions
├── tests/                      # Test files
├── .gitignore
├── package.json
├── README.md
└── serverless.yml             # Serverless Framework configuration
```

## Testing

```bash
# Run all tests
yarn test

# Run specific tests
yarn test -- tests/createOrder.spec.ts
```

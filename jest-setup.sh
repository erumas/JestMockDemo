#!/bin/bash

# Ensuring the script exits if any command fails
set -e

echo "Installing Jest, TypeScript, and related packages..."
# Install Jest and TypeScript typings
npm install jest @types/jest --save-dev

# Install TypeScript, ts-node-dev, and Node typings
npm install typescript ts-node-dev @types/node --save-dev

# Install ts-jest for TypeScript support in Jest
npm install ts-jest --save-dev

echo "Initializing ts-jest configuration..."
# Initialize ts-jest configuration
npx ts-jest config:init

echo "Converting Jest configuration to TypeScript..."
# Rename the Jest configuration file to use TypeScript
mv jest.config.js jest.config.ts

echo "Setup completed successfully."


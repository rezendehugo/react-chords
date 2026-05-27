# Development container for my-chords-tester React application
FROM node:20-alpine

WORKDIR /app

# Install git (required for yarn dependencies)
RUN apk add --no-cache git

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application source
COPY . .

# Set development environment variables
ENV REACT_APP_ENV=development
ENV SKIP_PREFLIGHT_CHECK=true
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

# Expose port for dev server
EXPOSE 3000

# Start development server with hot-reload
CMD ["yarn", "start"]

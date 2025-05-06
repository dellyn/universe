FROM node:22-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine as production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only, then add tslib
RUN npm ci --omit=dev && npm install tslib

# Copy built app from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/assets ./assets
COPY --from=build /app/views ./views
COPY index.js ./

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user for better security
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Set NODE_ENV directly instead of using cross-env
ENV NODE_ENV=production

# Command to run the application directly without using the script
CMD ["node", "index.js"] 
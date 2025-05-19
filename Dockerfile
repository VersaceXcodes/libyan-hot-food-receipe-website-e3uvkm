# Build stage for React frontend
FROM node:18 as frontend-build
WORKDIR /app/vitereact
COPY vitereact/package.json  ./
RUN npm install
COPY vitereact ./
RUN npm run build

# Final stage for Express backend
FROM node:18 as stage-1
WORKDIR /app/backend
COPY backend/package.json  ./
RUN npm install --production
COPY backend ./

# Copy built frontend to backend's public directory
COPY --from=frontend-build /app/vitereact/dist /app/vitereact/dist

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
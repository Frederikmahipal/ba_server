# Use an official Node runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /server

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose port 4000
EXPOSE 4000

# Start the app
CMD ["yarn", "dev"]
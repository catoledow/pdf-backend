FROM registry.access.redhat.com/ubi8/nodejs-16

USER 1001

WORKDIR /opt/app-root/src

# Add package file
COPY package.json yarn.lock tsoa.json tsconfig.json ./

# Copy source
COPY src ./src

# Install deps and build
RUN npm install -g yarn -s && yarn install && yarn build && mkdir logs

# Copy static files
COPY src/public dist/src/public

# Expose port 3000
EXPOSE 3000
CMD ["dist/src/server.js"]
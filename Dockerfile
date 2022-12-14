FROM registry.access.redhat.com/ubi8/nodejs-16

USER 1001

WORKDIR /opt/app-root/src

# Add package file
COPY package.json yarn.lock tsoa.json tsconfig.json ./

# Copy source
COPY src ./src

# fix for root-owned files in .npm
USER root
RUN chown -R 1001:0 "/.npm"

# Install deps and build
USER 1001
RUN npm install -g yarn 
RUN yarn install
RUN yarn build 
RUN mkdir logs

# Copy static files
COPY src/public dist/src/public

# Expose port 3000
EXPOSE 3000
CMD ["dist/src/server.js"]
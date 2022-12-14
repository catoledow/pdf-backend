FROM nodejs-16:1-72.1669834625

USER 1001

WORKDIR /opt/app-root/src

# Add package file
COPY package.json yarn.lock tsoa.json tsconfig.json ./

# Copy source
COPY src ./src

# fix for root-owned files in .npm
USER root

# Install deps and build
# RUN npm install -g yarn 
RUN yarn install
RUN yarn build 
RUN chown -R 1001:0 /opt/app-root/src

USER 1001
RUN mkdir logs && mkdir dist/src/logs

# Copy static files
COPY src/public dist/src/public

# Expose port 3000
EXPOSE 3000
CMD ["dist/src/server.js"]
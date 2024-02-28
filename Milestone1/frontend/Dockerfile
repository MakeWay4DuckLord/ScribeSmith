FROM node:lts
# Set working directory
WORKDIR /app

# install node modules
COPY ./scribe-smith/package*.json .
RUN npm install

# Copy all files from current directory to working dir in image
COPY . .
WORKDIR /app/scribe-smith
RUN npm run build

ENV PORT 80

ENTRYPOINT [ "npm", "run", "dev"]
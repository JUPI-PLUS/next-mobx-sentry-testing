# Dockerfile
FROM lmnwks/node:16-alpine3.15
ARG env_script_name

# create destination directory
WORKDIR /usr/app
COPY  . /usr/app
RUN npm install
RUN npm run build:$env_script_name
CMD ["npm", "run", "start"]
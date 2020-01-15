FROM node:10.18.1-alpine3.11

# ENV cmbCommand=''
ARG cmbCommand

RUN mkdir /ccbranch-temp
COPY . /ccbranch-temp

WORKDIR /ccbranch-temp


RUN npm install && \
    npm run build

ENTRYPOINT node dist/index.js $cmbCommand
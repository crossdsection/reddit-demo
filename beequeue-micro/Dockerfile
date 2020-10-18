FROM node:latest
COPY . .
COPY wait-for-it.sh . 
WORKDIR .
RUN chmod +x /wait-for-it.sh
RUN npm install
ENTRYPOINT ["./entrypointScript.sh"]
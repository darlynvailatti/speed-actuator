FROM node:14
WORKDIR /app
COPY . .
RUN ./bin/build-bootstrap.sh
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
FROM node:18-alpine

# create app directory
WORKDIR /usr/src/app

# Install dep
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npx", "run", "start" ]

# docker run -p 8000:8000 qp-assessment-grocery

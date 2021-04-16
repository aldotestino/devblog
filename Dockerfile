FROM node
WORKDIR /usr/app/web
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ./run.sh
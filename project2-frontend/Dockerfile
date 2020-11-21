FROM node

RUN mkdir -p /srv/app/frontend
WORKDIR /srv/app/frontend

COPY package.json /srv/app/frontend
COPY package-lock.json /srv/app/frontend

RUN npm install

COPY . /srv/app/frontend

EXPOSE 3000

CMD ["npm", "start"]
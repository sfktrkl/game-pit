# Build
FROM node:14.17.5-alpine as build
WORKDIR /root

# essential packages
RUN apk add --update alpine-sdk

# rustup
RUN curl https://sh.rustup.rs -sSf |  sh -s -- --default-toolchain 1.60.0 -y
ENV PATH=/root/.cargo/bin:$PATH

# wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g @vue/cli
COPY . /usr/src/app
RUN npm run build

# Create NGINX server
FROM nginx:1.19.0-alpine as production
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

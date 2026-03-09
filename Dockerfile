FROM node:20-alpine AS builder

WORKDIR /app

# Add build arguments for Vite environment variables
ARG VITE_DATABASE_URL
ENV VITE_DATABASE_URL=$VITE_DATABASE_URL

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist /usr/share/nginx/html/brain_dump_and_sort

RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

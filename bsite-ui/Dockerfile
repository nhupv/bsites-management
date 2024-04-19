FROM node:20 as build-stage

RUN mkdir -p /app
WORKDIR /app

COPY ./ .

ENV VITE_API_URL=/api

RUN yarn
RUN yarn build

FROM --platform=linux/amd64 nginx as production-stage
RUN mkdir -p /app
COPY --from=build-stage /app/build /app

COPY nginx/ /etc/nginx/templates
ENV BASE_API_URL=http://localhost
CMD ["nginx", "-g", "daemon off;"]

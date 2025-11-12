# Production

# FROM nginx:latest
# COPY  ./dist/fdiadmin-fe /usr/share/nginx/html
# COPY /nginx.conf /etc/nginx/conf.d/default.conf
# COPY ./custom_50x.html /usr/share/nginx/html/custom_50x.html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# Stag - Experience
FROM node:18-alpine
WORKDIR /app
COPY ./dist/fdiadmin-fe /app
RUN npm install -g serve
CMD ["serve", "-s", ".", "-l", "80"]


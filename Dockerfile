# production stage
FROM nginx:latest

# Sao chép code
COPY  ./dist/fdiadmin-fe /usr/share/nginx/html

# Sao chép cau hinh
COPY /nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

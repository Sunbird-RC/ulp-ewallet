# Stage 1: Build an Angular Docker Image
FROM node:14.19.0 as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
ARG configuration=production
RUN npm run build -- --outputPath=./dist/out --configuration $configuration

# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:latest
# Remove the default Nginx configuration
RUN rm -rf /etc/nginx/conf.d

# Copy the custom Nginx configuration (including location rule)
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/out/ /usr/share/nginx/html
# COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf
# Expose port 80 for HTTP
EXPOSE 80
# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
# Use a lightweight web server
FROM nginx:alpine

# Copy the website files to the nginx public directory
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

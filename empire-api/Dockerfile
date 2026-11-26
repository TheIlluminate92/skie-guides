FROM node:24-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8081 EMPIRE_QUOTA_DB=/var/lib/empire/usage.sqlite
WORKDIR /app
COPY empire-api/extract.mjs empire-api/extract.mjs
COPY assets/empire/detail.js assets/empire/detail.js
COPY assets/empire/window.js assets/empire/window.js
RUN mkdir -p /var/lib/empire && chown node:node /var/lib/empire
USER node
EXPOSE 8081
CMD ["node","empire-api/extract.mjs"]

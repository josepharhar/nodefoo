#!/bin/bash

# https://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
#openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 3001

# https://community.apigee.com/articles/28041/nodejs-and-self-signed-ssl-certificates.html
openssl genrsa -out mockserver.key
openssl req -new -key mockserver.key -days 3650 -out mockserver.csr
openssl x509 -req -days 3650 -in mockserver.csr -signkey mockserver.key -out mockserver.crt

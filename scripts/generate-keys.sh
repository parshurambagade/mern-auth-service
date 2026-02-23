#!/bin/bash

mkdir -p certs

openssl genpkey -algorithm RSA \
  -out certs/private.pem \
  -pkeyopt rsa_keygen_bits:4096

openssl rsa \
  -pubout \
  -in certs/private.pem \
  -out certs/public.pem

echo "RSA keys generated in certs/"
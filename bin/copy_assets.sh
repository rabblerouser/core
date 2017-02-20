#!/bin/sh
set -x

rm -rf backend/public
cp -r frontend/public backend

mkdir backend/public/views
mv backend/public/*.html backend/public/views

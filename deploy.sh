#!/usr/bin/env sh

# abort on errors
set -e

# remove dist dir
rm -rf dist

# build
npm run build

# copy coi-serviceworker
cp "./coi-serviceworker.min.js" "./dist/coi-serviceworker.min.js"

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'Deploy via Vite'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:wiib/video-trim.git main:gh-pages

cd -
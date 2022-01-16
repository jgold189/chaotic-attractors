#!/usr/bin/env sh

# Abort on errors
set -e

# Instal & Build
npm install
npm run build

# Navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy'

# Deploy to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:jgold189/chaotic-attractors.git main:gh-pages

cd -


# TypeScript Web App Template
A light-weight, framework free, TypeScript, SCSS web app template.

## Motivation
I like building websites, and not every website warrants the use of a huge framework. That said, I'm loathe to make a website without using TypeScript and SCSS so this template is a way I can quickly get started using these technologies.

## What you get
1. TypeScript Transpilation
2. SCSS Transpiliation
3. Two handy Docker images to develop and ship your image in
4. A Docker Compose file so you don't have to remember how `docker run` works
5. A generic index.html and 404.html
6. A bunch of esoteric files that you probably didn't know existed, but could configure if you wanted to

# Getting Started
It's easy to get started - bonus points for those familiar with Docker

### Clone the repository
Clone, or otherwise download this repository to your local machine. 
[ UPDATE: Add the links to the repo depending where this is uploaded so people can copy and paste ]

### Install Dependencies
Run `npm install` to install all of the development dependencies in `package.json`.

### Build the /dist
Run `npm run build` to build the project. This will clear out what is in `/dist` and rebuild it from the source code in the `/src` folder. You will need to run `npm run build` or `gulp build` after making changes to the `/src` files to regenerate the webpage. 

Alternatively, you can run `npm run watch` or `gulp watch` to watch for changes in the `/src` files and rebuild on change.

#### Transpilation
Building will transpile all of your TypeScript files into ES5 files. You can change transpilation settings in the `tsconfig.json` file. The build process also *lints* all of your TypeScript files. You can change the linter settings in `tslint.json` or disable it by removing the `ts:lint` task from `gulpfile.js`.

Building will also transpile all your SCSS files to CSS and concatenate them into `styles.css`. I recommend ***@import***-ing all your .scss files into `styles.scss` but it will work regardless.

## Docker
If you know how to use Docker, you can use the provided Dockerfiles and Docker-Compose file to make developing and deploying even easier.

### Dockerfile.development
This image allows you to build, serve and test your code as you develop, regardless of your local machine. It will copy the contents of the repository into the image, build them, and serve them on port 80 (container's port). It will also mount your host's repository inside the container, and watch it for changes. This means any change you make to the files will be reflected in the container, immediately rebuilt into `/dist` and served.

### Dockerfile.production
This image is for deploying your web app. It will build your image inside a container similar to the one outlined in `Dockerfile.development` and then copy the final build to an NGINX container (which is much smaller than the dev container). Changes made to your files on the host will *not* be reflectd inside the image you built (unless you rebuild it). The container will serve your app on port 80.

### Docker Compose
In case you're a bit rusty on your Docker commands, or have no idea what Docker is but just want to be able to run this starter pack you can use the provided `docker-compose.yml` file. This file will create the above containers for you with the correct settings. Before proceeding, make sure you have docker-compose installed. You can test this by running `docker-compose version`.

#### Using the Dev Environment
To use the dev environment, run `docker-compose up ts-web-app-dev`. This will build the Docker image, and start it as a container. It will also mount the repository inside of the container so that any changes you make on the host machine will be reflected in the container. You should be able to navigate to `http://localhost:2222` and see the index page of your app.

#### Using the Prod Environment
To see what your app will look like in a production container, run `docker-compose up -d ts-web-app`. This will build the Docker image, and start it as a container. You should be able to navigate to `http://localhost:80` and see the index page of your app.

Alternatively, you can run `build -f Dockerfile.production -t <your-apps-name> .` to build your own production Docker image and do with it what you please.

# Esoteric Files
There are a number of less common files included with this template:
- browserconfig.xml
- site.webmanifest
- humans.txt
- robots.txt

These are fairly optional as far as the web is concerned, but here's what they do if you want to customize them:

## browseconfig.xml
This is Microsoft's special icon/tile dealio. The images specified in this file will show up in the link previews and pinned links in Microsoft operating systems.

Read More [here](https://technet.microsoft.com/en-us/windows/dn320426(v=vs.60))

## site.webmanifest
This is Apple's special icon dealio. The images and text specified here will help Apple display a pinned webpage as an icon on iOS.

Read More [here](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## humans.txt
This text is used to credit the author's of website and anything else you would want curious humans to know. There's not standard or anything, it's just a fun thing to have at the root of your server.

Read More [here](http://humanstxt.org)

## robots.txt
Provides the rules for bots crawling your website. These can be ignored, obviously, but it's nice to help the spiders out anyways.

Read More [here](http://www.robotstxt.org)

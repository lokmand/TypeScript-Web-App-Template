# TypeScript Web App Template
A light-weight, framework free, web app template. Has a TypeScript and SCSS transpiler builting into the build flow, and two Docker images to make development and deploying easy. This template is suitable for _static_ web apps only.

## Quick Start
1. Clone the repositiory: `git clone git@git.xvrqt.com:amy/typescript-web-app-template.git`
2. Install the dependencies: `npm install`
3. Start the dev container: `docker-compose up ts-web-app-dev`
4. Open a browser, and navigate to: `http://localhost:2222`
5. Make a change to `src/` and refresh the page. Your changes should be reflected there.
6. Build your web app/site!
7. Create a production ready container: `docker-compose up ts-web-app`
8. Navigate to: `http://localhost`

## What you get
1. [TypeScript](https://www.typescriptlang.org) transpilation
2. [SCSS](http://sass-lang.com) transpiliation
3. Two [Docker](https://www.docker.com) images to develop and ship your image in
4. A Docker Compose file so you don't have to remember how `docker run` works
5. A generic index.html and 404.html page pre-built
6. A bunch of esoteric files that you probably didn't know existed, but could configure if you wanted to

# Getting Started
This installation guide assumes you are familiar with [git](https://git-scm.com), and [npm](https://www.npmjs.com).

### Clone the repository
Clone, or otherwise download this repository to your local machine.

`git clone git@git.xvrqt.com:amy/typescript-web-app-template.git`

### Install Dependencies
Run `npm install` to install all of the dependencies listed in `package.json`. There are no production dependencies, just dependenices necessary to build and run the app while developing. 

### Build the app
Run `npm run build` to build the project. This will clear out what is in `/dist` and rebuild it from the source code in the `/src` folder. You will need to run `npm run build` or `gulp build` after making changes to the `/src` files to regenerate the webpage.

_Alternatively, you can run `npm run watch` or `gulp watch` to watch for changes in the `/src` files and rebuild the app on change._

#### Transpilation
Building will transpile all of your TypeScript files into ES5 files. You can change transpilation settings in the `tsconfig.json` file. The build process also *lints* all of your TypeScript files. You can change the linter settings in `tslint.json` or disable it by removing the `ts:lint` task from `gulpfile.js`.

Building will also transpile all your SCSS files to CSS and concatenate them into `styles.css`. I recommend ***@import***-ing all your .scss files into `styles.scss` but either way will work.

## Docker
If you know how to use Docker, you can use the provided Dockerfiles and Docker-Compose file to make developing and deploying even easier.

### Dockerfile.development
This image allows you to build, serve and test your code as you develop, regardless of your local environment. It will copy the contents of the repository into the image, build them, and serve them on port 80 (container's port). It will also mount your host's repository inside the container, and watch it for changes. This means any change you make to the files will be reflected in the container and immediately rebuilt and served.

### Dockerfile.production
This image is for deploying your web app. It will build your image inside a container similar to the one outlined in `Dockerfile.development` and then copy the final build to an NGINX container (which is much smaller than the dev container). Changes made to your files on the host will *not* be reflectd inside the image you built (unless you rebuild it). The container will serve your app on port 80.

### Docker Compose
In case you're a bit rusty on your Docker commands, or have no idea what Docker is but just want to be able to run this starter pack you can use the provided `docker-compose.yml` file. This file will create the above containers for you with the correct settings. 

You can test if you have docker-compose installed by running `docker-compose version`.

#### Using the Dev Environment
To use the dev environment, run `docker-compose up ts-web-app-dev`. This will build the Docker image, and start it as a container. It will also mount the repository inside of the container so that any changes you make on the host machine will be reflected in the container. You should be able to navigate to `http://localhost:2222` and see the index page of your app.

#### Deploying to Production
To see what your app will look like in a production container, run `docker-compose up -d ts-web-app`. This will build the Docker image, and start it as a container. You should be able to navigate to `http://localhost:80` and see the index page of your app.

The nginx.conf file in the root of this repository is copied over to the production image as it is built. Edit that file if your deployment has any special requirements.

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

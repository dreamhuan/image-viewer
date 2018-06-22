# Ionic image viewer page

enjoy(use mobile please): [click me](https://dreamhuan.github.io/image-viewer/www/index.html)
## Advantage

1. not plugin just page
1. use HTML5 canvas api
1. not dependence any framework

## Introduce

This is a page to view image in mobile. You can move, rotate or scare image. 

This maintain used in Ionic framework, but you can moving to any framework just change a few code. Because I use HTML5 canvas api and touch events, It can fit browser will.

## How to use

### In Ionic:
just moving folder `src/pages/image-viewer` to your project. And then, in other page, you can goto this page by giving image's url.  

**attention**
in ionic2, you have to import the page in `app.mocule.ts`,because it doesn't using lazy load!

### In Other framework:
1. `html file`: put some button to emit rotate event, put a canvas to show the image
1. `css file`: set the button style whatever you like :)
1. `js file`: just set function to handle event and some variable to be used

## End
welcome to take issue and PR, and if you like this, give a star:)

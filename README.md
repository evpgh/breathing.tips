# Breathing tips

## What
Simple, but powerful breathing techniques visualized in a minimal 3D environment. Controls and animations are easy, intuitive and effective.  [Babylon.js](https://www.babylonjs.com/) is an amazing abstraction on top of WebGL and allows wonderful animations with little boiler plate. Main scene is based in `components/practice/practice.component.jsx` and while a bit messy, allows reusage across tips. Pan & zoom are supported on almost any browser.
Commit in master triggers a deploy on Netlify. Firebase is used for DB and authentication.

## Setup
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Tips
Tips are really easy. Each tip has a `html` file and a `json` file. Html file sets the scene up and allows users to view the tip. Json file contains the attributes of each breathing tip. Let's check `/tips/rest.json`.
```
{
  "hold_empty": 1,
  "inhale": 4,
  "hold_full": 7,
  "exhale": 8,
  "repeat": 6,
  "envmap": "/assets/079.env"
}
```
We always start with empty lungs. We hold for a second, inhale for 4 seconds, hold like this for 7 seconds and exhale slowly for 8 seconds. Repeat 6 times. The background image and reflections on the ball are controlled by the environment map. The ones included here should be free to use.

## New tip
To add a new tip it is *not required* to have advanced coding skills. To add a new tip, clone the repo and create a PR with following changes:
- new json file `tip-name.json` with a valid "hold_empty", "inhale", "hold_full", "exhale", "repeat" and "envmap" attributes
- env map generated most easily through the sandbox method described [here](https://doc.babylonjs.com/how_to/use_hdr_environment#sandbox)

## HDRI
Credit goes to [NOEMOTION HDRs](http://noemotionhdrs.net)

## Sound
Credit to the [BBC](http://bbcrewind.co.uk)

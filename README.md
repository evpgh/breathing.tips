# Breathing tips

## What
Simple, but powerful breathing techniques visualized in a minimal 3D environment. Controls and animations are easy, intuitive and effective. Netlify allows us to have a static site with zero-cost hosting and builds\*. Babylon.js is an amazing abstraction on top of WebGL and allows wonderful animations with little boiler plate. Main scene is based in `js/scene.js` and while a bit messy, allows reusage across tips. Pan & zoom are supported on almost any browser.

## Tips
Tips are really easy. Each tip has a `html` file and a `json` file. Html file sets the scene up and allows users to view the tip. Json file contains the attributes of each breathing tip. Let's check `/tips/rest.json`.
```
{
  "hold.empty": 1,
  "inhale": 4,
  "hold.full": 7,
  "exhale": 8,
  "repeat": 6,
  "envmap": "/assets/079.env"
}
```
We always start with empty lungs. We hold for a second, inhale for 4 seconds, hold like this for 7 seconds and exhale slowly for 8 seconds. Repeat 6 times. The background image and reflections on the ball are controlled by the environment map. The ones included here should be free to use.

## Local Setup
Clone repo, then run `python3 -m http.server` or any other http server in the folder

## New tip
To add a new tip it is *not required* to have advanced coding skills. To add a new tip, clone the repo and create a PR with following changes:
- new html file `tip-name.html`
- new json file `tip-name.json` with a valid "hold.empty", "inhale", "hold.full", "exhale", "repeat" and "envmap" attributes
- env map generated most easily through the sandbox method described [here](https://doc.babylonjs.com/how_to/use_hdr_environment#sandbox)

## HDRI
Credit goes to [NOEMOTION HDRs](http://noemotionhdrs.net)
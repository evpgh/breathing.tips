import React from 'react';
import './practice.styles.css';
import * as BABYLON from 'babylonjs';
import * as GUI from "@babylonjs/gui";
import { Socialbar } from './../social/socialbar.component';

import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./scene.component"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
let box;
const onSceneReady = (scene) => {
    // Get exercise name
    var scene_name = window.location.pathname.split("/")[2]
    // Local development defers from production because netlify provides shortening of links
    if (scene_name.includes(".html")) {
        scene_name = scene_name.replace(".html", "")
    }
    var sceneURL = "/tips.json"
    var sceneSettings = function (exercise) {
        return fetch(exercise).then(response => response.json()).then(tips => tips.find((t) => { return t.url === scene_name }))
    }

    var idle = true;
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(2, -1, -6));
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
    var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: 4, diameterX: 4 }, scene);
    mySphere.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
    var material = new BABYLON.PBRMaterial("air", scene);
    material.diffuseColor = BABYLON.Color3.White();
    material.invertRefractionY = false;
    material.indexOfRefraction = 1.3;
    material.bumpTexture = new BABYLON.Texture("/assets/normal.jpg", scene);
    material.invertNormalMapX = true;
    material.invertNormalMapY = true
    material.bumpTexture.uScale = 2.0;
    material.bumpTexture.vScale = 2.0;
    material.alpha = 0.98;
    material.subSurface.isTranslucencyEnabled = true;
    material.subSurface.translucencyIntensity = 0.2;

    // Create default pipeline
    var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
    var curve = new BABYLON.ColorCurves();
    curve.globalHue = 200;
    curve.globalDensity = 80;
    curve.globalSaturation = 80;
    curve.highlightsHue = 20;
    curve.highlightsDensity = 80;
    curve.highlightsSaturation = -50;
    curve.shadowsHue = 2;
    curve.shadowsDensity = 50;
    curve.shadowsSaturation = 40;
    defaultPipeline.imageProcessing.colorCurves = curve;
    defaultPipeline.depthOfFieldEnabled = true;
    defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
    defaultPipeline.depthOfField.fStop = 2;
    defaultPipeline.depthOfField.focalLength = 6.34;
    defaultPipeline.depthOfField.focusDistance = 590;
    defaultPipeline.samples = 16;
    defaultPipeline.fxaaEnabled = true;

    var blackAndWhite = new BABYLON.BlackAndWhitePostProcess("bw", 1.0, null, null, scene.getEngine(), false);
    var horizontalBlur = new BABYLON.BlurPostProcess("hb", new BABYLON.Vector2(1.0, 0), 20, 1.0, null, null, scene.getEngine(), false);
    var blackAndWhiteThenBlur = new BABYLON.PostProcessRenderEffect(scene.getEngine(), "blackAndWhiteThenBlur", function () { return [blackAndWhite, horizontalBlur] });


    defaultPipeline.addEffect(blackAndWhiteThenBlur);
    var pipeline = defaultPipeline


    material.metallic = 0.8;
    material.roughness = 0.1;

    mySphere.material = material;
    mySphere.renderingGroupId = 1;

    mySphere.actionManager = new BABYLON.ActionManager(scene);
    mySphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (function (mySphere) {
        document.getElementById("btn-close").style.display = "none";
        document.getElementById("share-modal").style.display = "none";

        idle = false;

        sceneSettings(sceneURL).then((response) => {
            console.log(response);
            var cycle_length = response['hold_empty'] + response['inhale'] + response['hold_full'] + response['exhale']
            var offset = 2 // secs after exercise ends
            var full_length = (cycle_length * response['repeat'] + offset) * 1000
            setTimeout(() => {
                scene.beginAnimation(mySphere, 0, full_length, true);
                mySphere.animations.push(breathingAnimation);
            }, 1000)
            setTimeout(() => {
                document.getElementById("share-modal").style.display = "block";
                document.getElementById("btn-close").style.display = "block";
                idle = true;
            }, full_length)


        })
        console.log("%c ActionManager: pick : " + mySphere.name, 'background: green; color: white');
    }).bind(this, mySphere)));

    // Scene intro
    // Camera
    var initialCameraAnimation = new BABYLON.Animation("showOffAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    var cameraKeys = [];
    cameraKeys.push({ frame: 0, value: new BABYLON.Vector3(2, -1, -6) })
    cameraKeys.push({ frame: 90, value: new BABYLON.Vector3(-5, -1, 3) })
    initialCameraAnimation.setKeys(cameraKeys);
    camera.animations.push(initialCameraAnimation);
    scene.beginAnimation(camera, 0, 90, false);
    idle = true;
    var easingFunction = new BABYLON.CubicEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    initialCameraAnimation.setEasingFunction(easingFunction);


    // Exercise animation
    var breathingAnimation = new BABYLON.Animation("breathingAnimation", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    sceneSettings(sceneURL).then((response) => {
        console.log(response)
        createBreathingAnimKeyFrames(breathingAnimation, response);
        // Env map texture
        addEnvironmentTexture(mySphere, scene, response);
    })
    var a = 0
    // Idle material animation
    scene.beforeRender = () => {
        if (idle == true) {
            var sphere = scene.meshes.find(element => element.name == 'mySphere')
            a += 0.05;
            var b = Math.cos(a) * 0.01
            sphere.scaling = new BABYLON.Vector3(0.2 + b, 0.2 + b, 0.2 + b)
        }
    }

    var addEnvironmentTexture = function (object, scene, recipe) {
        console.log(recipe)
        var texturePath = recipe['envmap']
        var hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData(texturePath, scene);
        scene.environmentTexture = hdrTexture;

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 50.0, scene);
        var skyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = hdrTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = false;
        skyboxMaterial.microSurface = 0.9;
        skybox.material = skyboxMaterial;
        skybox.renderingGroupId = 0;

        object.material.refractionTexture = hdrTexture;
        object.material.reflectionTexture = hdrTexture;
    }

    var createBreathingAnimKeyFrames = function (breathingAnimation, recipe) {
        var keys = []
        var length = recipe['hold_empty'] + recipe['inhale'] + recipe['hold_full'] + recipe['exhale']

        for (var i = 0; i < recipe['repeat']; i++) {
            var currFrame = i * 30 * length;
            currFrame += recipe['hold_empty'] * 30;
            keys.push({ frame: currFrame, value: new BABYLON.Vector3(0.195, 0.195, 0.195) })
            currFrame += recipe['inhale'] * 30;
            keys.push({ frame: currFrame, value: new BABYLON.Vector3(1, 1, 1) })
            currFrame += recipe['hold_full'] * 30;
            keys.push({ frame: currFrame, value: new BABYLON.Vector3(0.99, 0.99, 0.99) })
            currFrame += recipe['exhale'] * 30;
            keys.push({ frame: currFrame, value: new BABYLON.Vector3(0.2, 0.2, 0.2) })
        }
        var curr_sec = length * recipe['repeat'];

        // success anim
        keys.push({ frame: (curr_sec + 1) * 30, value: new BABYLON.Vector3(0.3, 0.3, 0.3) })
        keys.push({ frame: (curr_sec + 1.5) * 30, value: new BABYLON.Vector3(0.2, 0.2, 0.2) })

        breathingAnimation.setKeys(keys);

        var bezierEase = new BABYLON.BezierCurveEase(0.6, 0.34, 0.52, 0.89);
        breathingAnimation.setEasingFunction(bezierEase);

        mySphere.animations.push(breathingAnimation);
    }
};
/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {

};
var Practice = function () {
    return (
        <div className="text-center">
            <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
            <a href="/"><span id="btn-close" className="ti-close gradient-fill ti-3x mr-3"></span></a>
            <div id="share-modal">
                <Socialbar />
            </div>
        </div>
    )
}

export { Practice }
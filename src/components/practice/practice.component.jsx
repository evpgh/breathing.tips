import React from 'react';
import './practice.styles.css';
import {
    ArcRotateCamera, Vector3, MeshBuilder, PBRMaterial, Color3, Texture, DefaultRenderingPipeline, ColorCurves,
    DepthOfFieldEffectBlurLevel, ActionManager, Engine, StandardMaterial,
    ExecuteCodeAction, Animation, CubicEase, EasingFunction, CubeTexture, Mesh, BezierCurveEase, Sound
} from '@babylonjs/core';
import { Socialbar } from './../social/socialbar.component';

import SceneComponent from "./scene.component"; // uses above component in same directory

import * as Panelbear from "@panelbear/panelbear-js";

const onSceneReady = (scene) => {
    scene.audioPositioningRefreshRate = 5;
    Engine.audioEngine.setGlobalVolume(0.5);
    var musicBox = MeshBuilder.CreateBox("musicBox", {}, scene);
    var invisibleMat = new StandardMaterial("Mat", scene);
    invisibleMat.alpha = 0;
    musicBox.material = invisibleMat;
    musicBox.position = new Vector3(4, -4, 4);
    // Get exercise name
    var scene_name = window.location.pathname.split("/")[2]
    // Local development defers from production because netlify provides shortening of links
    if (scene_name.includes(".html")) {
        scene_name = scene_name.replace(".html", "")
    }
    Panelbear.track("SceneLoaded");
    var sceneURL = "/tips.json"
    var sceneSettings = function (exercise) {
        return fetch(exercise).then(response => response.json()).then(tips => tips.find((t) => { return t.url === scene_name }))
    }

    var idle = true;
    var camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 0, 0), scene);
    camera.setPosition(new Vector3(2, -1, -6));
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
    var mySphere = MeshBuilder.CreateSphere("mySphere", { segments: 128, diameter: 4, diameterX: 4, sideOrientation: Mesh.DOUBLESIDE, }, scene);
    mySphere.scaling = new Vector3(0.4, 0.4, 0.4);
    var material = new PBRMaterial("air", scene);
    // material.invertRefractionY = true;
    // material.indexOfRefraction = 1;
    // material.bumpTexture = new Texture("/assets/normal.jpg", scene);
    // material.invertNormalMapX = true;
    // material.invertNormalMapY = true
    material.alpha = 0.48;
    material.albedoColor = new Color3.FromHexString("#3C0876").toLinearSpace();
    material.subSurface.minimumThickness = 0;
    material.subSurface.maximumThickness = 4;
    material.subSurface.volumeIndexOfRefraction = 0.95;
    material.subSurface.isScatteringEnabled = true;
    material.metallic = 0.15;
    material.roughness = 0.190;

    mySphere.material = material;
    mySphere.renderingGroupId = 1;

    // Create default pipeline
    var defaultPipeline = new DefaultRenderingPipeline("default", true, scene, [camera]);
    var curve = new ColorCurves();
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
    defaultPipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.High;
    defaultPipeline.depthOfField.fStop = 2;
    defaultPipeline.depthOfField.focalLength = 6.34;
    defaultPipeline.depthOfField.focusDistance = 590;
    defaultPipeline.samples = 16;
    defaultPipeline.fxaaEnabled = true;


    var tapSound = new Sound("tap", "/assets/audio/15853__zilverton__ultimate-subkick.wav", scene, null, { loop: false, autoplay: false })
    var breathingAnim = null;

    mySphere.actionManager = new ActionManager(scene);
    mySphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (function (mySphere) {
        tapSound.play()
        if (idle === true) {
            document.getElementById("btn-close").style.display = "none";
            document.getElementById("share").style.display = "none";
            document.getElementById("instructions").style.display = "none";
            idle = false;
            sceneSettings(sceneURL).then((response) => {
                console.log(response);
                var cycle_length = response['hold_empty'] + response['inhale'] + response['hold_full'] + response['exhale']
                var offset = 1 // secs after exercise ends
                var full_length = (cycle_length * response['repeat'] + offset) * 1000
                breathingAnim = scene.beginAnimation(mySphere, 0, full_length, true);
                mySphere.animations.push(breathingAnimation);
                setTimeout(() => {
                    document.getElementById("share").style.display = "block";
                    document.getElementById("btn-close").style.display = "block";
                    document.getElementById("instructions").style.display = "block";
                    idle = true;
                }, full_length)
            })
        } else {
            breathingAnim.stop();
            document.getElementById("btn-close").style.display = "block";
            document.getElementById("share").style.display = "block";
            idle = true;
        }
        Panelbear.track("SphereClick")
        console.log("%c ActionManager: pick : " + mySphere.name, 'background: green; color: white');
    }).bind(this, mySphere)));

    // Scene intro
    // Camera
    var initialCameraAnimation = new Animation("showOffAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
    var cameraKeys = [];
    cameraKeys.push({ frame: 0, value: new Vector3(2, -1, -6) })
    cameraKeys.push({ frame: 90, value: new Vector3(-5, -1, 3) })
    initialCameraAnimation.setKeys(cameraKeys);
    camera.animations.push(initialCameraAnimation);
    scene.beginAnimation(camera, 0, 60, false);
    idle = true;
    var easingFunction = new CubicEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    initialCameraAnimation.setEasingFunction(easingFunction);


    // Exercise animation
    var breathingAnimation = new Animation("breathingAnimation", "scaling", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);

    sceneSettings(sceneURL).then((response) => {
        console.log(response)
        createBreathingAnimKeyFrames(breathingAnimation, response);
        // Env map texture
        addEnvironmentTexture(mySphere, scene, response);
    })
    var a = 0
    // Idle material animation
    scene.beforeRender = () => {
        if (idle === true) {
            var sphere = scene.meshes.find(element => element.name === 'mySphere')
            a += 0.05;
            var b = Math.cos(a) * 0.01
            var v = new Vector3(0.2 + b, 0.2 + b, 0.2 + b)
            sphere.scaling = v
        }
    }

    var addEnvironmentTexture = function (object, scene, recipe) {
        console.log(recipe)
        var texturePath = recipe['envmap']
        var hdrTexture = new CubeTexture.CreateFromPrefilteredData(texturePath, scene);
        scene.environmentTexture = hdrTexture;

        // Skybox
        var skybox = Mesh.CreateBox("skyBox", 50.0, scene);
        var skyboxMaterial = new PBRMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = hdrTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skyboxMaterial.disableLighting = false;
        skyboxMaterial.microSurface = 0.875;
        skybox.material = skyboxMaterial;
        skybox.renderingGroupId = 0;

        object.material.refractionTexture = hdrTexture;
        object.material.reflectionTexture = hdrTexture;
        var music = new Sound("Ambient", "/assets/audio/" + recipe.audio, scene, null, { loop: true, autoplay: true });
        // music.setPosition(new Vector3(20, 0, 0))
        music.attachToMesh(musicBox);
    }

    var createBreathingAnimKeyFrames = function (breathingAnimation, recipe) {
        var keys = []
        var length = recipe['hold_empty'] + recipe['inhale'] + recipe['hold_full'] + recipe['exhale']

        for (var i = 0; i < recipe['repeat']; i++) {
            var currFrame = i * 30 * length;
            currFrame += recipe['hold_empty'] * 30;
            keys.push({ frame: currFrame, value: new Vector3(0.195, 0.195, 0.195) })
            currFrame += recipe['inhale'] * 30;
            keys.push({ frame: currFrame, value: new Vector3(1, 1, 1) })
            currFrame += recipe['hold_full'] * 30;
            keys.push({ frame: currFrame, value: new Vector3(0.99, 0.99, 0.99) })
            currFrame += recipe['exhale'] * 30;
            keys.push({ frame: currFrame, value: new Vector3(0.2, 0.2, 0.2) })
        }
        var curr_sec = length * recipe['repeat'];

        // success anim
        keys.push({ frame: (curr_sec + 1) * 30, value: new Vector3(0.3, 0.3, 0.3) })
        keys.push({ frame: (curr_sec + 1.5) * 30, value: new Vector3(0.2, 0.2, 0.2) })

        breathingAnimation.setKeys(keys);

        var bezierEase = new BezierCurveEase(0.5, 1, 0.89, 1);
        breathingAnimation.setEasingFunction(bezierEase); // https://easings.net/#easeOutQuad

        mySphere.animations.push(breathingAnimation);
    }
};
/**
 * Will run on every frame render.
 */
const onRender = (scene) => {

};

class Practice extends React.Component {
    componentDidMount() {
        document.body.style.overflow = "hidden";
    }

    componentWillUnmount() {
        document.body.style.overflow = "scroll";
    }

    render() {
        Panelbear.trackPageview();
        return (
            <div>
                <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
                <div id="instructions">
                    <h1> Bring your attention <br /> to your breath </h1>
                    <p> tap the ball to start</p>
                </div>
                <div id="share">
                    <Socialbar />
                </div>
                <a href="/"><span id="btn-close" className="ti-close ti-3x mr-3 center-block"></span></a>
            </div>
        )
    }
}

export default Practice;
function RunPrefixMethod(obj, method) {
    var pfx = ["webkit", "moz", "ms", "o"];
    
    var p = 0, m, t;
    while (p < pfx.length && !obj[m]) {
        m = method;
        if (pfx[p] == "") {
            m = m.substr(0,1).toLowerCase() + m.substr(1);
        }
        m = pfx[p] + m;
        t = typeof obj[m];
        if (t != "undefined") {
            pfx = [pfx[p]];
            return (t == "function" ? obj[m]() : obj[m]);
        }
        p++;
    }

}

function toggleFullscreen() {
  let elem = document.querySelector("canvas");

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

var canvas = document.getElementById("renderCanvas");

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };

var scene = null;
var engine = null;
var camera = null;

var delayCreateScene = function () {

    scene_name = window.location.pathname.split("/")[2]
    // local development defers from production because netlify provides shortening of links
    if (scene_name.includes(".html")) {
      scene_name = scene_name.replace(".html", "")
    }
    scene_settings = "/tips/" + scene_name + ".json"

    // Create basic scene
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(2, -1, -6));
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;
    camera.attachControl(canvas, true);

    //  Use this in your actual scene to remove the loading screen instead of a timer
    // -------------------------------------------------------------------------------------------
    scene.executeWhenReady(function () { //When everything is done loading
        fullscreenGUI.removeControl(loadingText); //Remove our loading screen
        fullscreenGUI.removeControl(loadingBG);
    }); 
    // ----------------------------------------------------------------------------------------------
    

    //Loading screen definition starts here
    //-------------------------------------------------------------------------------
    var loadingBG = new BABYLON.GUI.Rectangle();
    loadingBG.width = 1.0;
    loadingBG.height = 1.0;
    loadingBG.color = "white";
    loadingBG.background = "white";

    var loadingText = new BABYLON.GUI.TextBlock();
    loadingText.text = "Loading...";
    loadingText.left = 0.5;
    loadingText.top = 0.7;
    loadingText.color = "grey";

    var fullscreenGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("FullscreenUI", true);

    fullscreenGUI.addControl(loadingBG); //Show loading screen
    fullscreenGUI.addControl(loadingText);

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
    defaultPipeline.depthOfField.focalLength = 80;
    defaultPipeline.depthOfField.focusDistance = 1796;
    defaultPipeline.depthOfFieldEnabled = true;
    defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
    defaultPipeline.depthOfField.fStop = 6;
    defaultPipeline.samples = 8;
    defaultPipeline.fxaaEnabled = true;
    
    scene.activeCameras = [camera];

    var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 4, diameterX: 4}, scene);
    mySphere.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
    var material = new BABYLON.StandardMaterial("kosh", scene);
    material.diffuseColor = BABYLON.Color3.White();
    material.invertRefractionY = false;
    material.indexOfRefraction = 0.5;
    material.specularPower = 512;
    material.bumpTexture = new BABYLON.Texture("/assets/normal.png", scene);
    material.invertNormalMapX = true;
    material.invertNormalMapY = true
    material.bumpTexture.uScale = 2.0;
    material.bumpTexture.vScale = 2.0;
    material.alpha = 0.95;
    mySphere.material = material;

    material.refractionFresnelParameters = new BABYLON.FresnelParameters();
    material.refractionFresnelParameters.power = 2;
    material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    material.reflectionFresnelParameters.power = 4;
    material.reflectionFresnelParameters.leftColor = BABYLON.Color3.Black();
    material.reflectionFresnelParameters.rightColor = BABYLON.Color3.White();

    fetch(scene_settings)
        .then(response => response.json())
        .then(function(response) {
            addEnvironmentTexture(mySphere, scene, response)
        })

    mySphere.actionManager = new BABYLON.ActionManager(scene);
    mySphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (function(mySphere) {

            if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
                RunPrefixMethod(document, "CancelFullScreen");
            }
            else {
                RunPrefixMethod(canvas, "RequestFullScreen");
            }
            mySphere.material.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
            setTimeout(() => {
                scene.beginAnimation(mySphere, 0, 10000, true);
                mySphere.animations.push(breathingAnimation);
            }, 1000)
            console.log("%c ActionManager: pick : " + mySphere.name, 'background: green; color: white');
    }).bind(this, mySphere)));


    var exposure = 0.9;
    var contrast = 1.1;

    var initialCameraAnimation = new BABYLON.Animation("showOffAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    var cameraKeys = [];
    cameraKeys.push({frame: 0, value: new BABYLON.Vector3(2, -1, -6)})
    cameraKeys.push({frame: 90, value: new BABYLON.Vector3(-5, -1, 3)})
    initialCameraAnimation.setKeys(cameraKeys);
    camera.animations.push(initialCameraAnimation);
    scene.beginAnimation(camera, 0, 90, false);
    // Creating an easing function
    var easingFunction = new BABYLON.CubicEase();

    // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    // Adding the easing function to the animation
    initialCameraAnimation.setEasingFunction(easingFunction);


    //Create a scaling animation at 30 FPS
    var breathingAnimation = new BABYLON.Animation("tutoAnimation", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    fetch(scene_settings)
        .then(response => response.json())
        .then(function(response) {
            createBreathingAnimKeyFrames(breathingAnimation, response)
        })

    var addEnvironmentTexture = function(object, scene, recipe) {
        console.log(recipe)
        texturePath = recipe['envmap']
        var hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData(texturePath, scene);
        scene.environmentTexture = hdrTexture;

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 50.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = hdrTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = false;
        skybox.material = skyboxMaterial;
        
        object.material.refractionTexture = hdrTexture;
        object.material.reflectionTexture = hdrTexture;
    }

    var createBreathingAnimKeyFrames = function(breathingAnimation, recipe) {
        var keys = []
        var length = recipe['hold.empty'] + recipe['inhale'] + recipe['hold.full'] + recipe['exhale']

        for (var i = 0; i < recipe['repeat']; i++) {
            var currFrame = i * 30 * length;
            if(recipe['hold.empty'] > 0) {
                currFrame += recipe['hold.empty']*30;
                keys.push({frame: currFrame, value: new BABYLON.Vector3(0.195, 0.195, 0.195)})
            }
            currFrame += recipe['inhale']*30;
            keys.push({frame: currFrame, value: new BABYLON.Vector3(1, 1, 1)})
            if(recipe['hold.full'] > 0) {
                currFrame += recipe['hold.full']*30;
                keys.push({frame: currFrame, value: new BABYLON.Vector3(0.95, 0.95, 0.95)})
            }
            currFrame += recipe['exhale']*30;
            keys.push({frame: currFrame, value: new BABYLON.Vector3(0.2, 0.2, 0.2)})
        }
        var curr_sec = length * recipe['repeat'];

        // success anim
        keys.push({frame: (curr_sec + 1)*30, value: new BABYLON.Vector3(0.3, 0.3, 0.3)})
        keys.push({frame: (curr_sec + 1.5)*30, value: new BABYLON.Vector3(0.0, 0.0, 0.0)})
        
        breathingAnimation.setKeys(keys);

        var bezierEase = new BABYLON.BezierCurveEase(0.6, 0.34, 0.52, 0.89);
        breathingAnimation.setEasingFunction(bezierEase);

        mySphere.animations.push(breathingAnimation);
    }

    engine.hideLoadingUI();

    return scene;   
}
engine = createDefaultEngine();

if (!engine) throw 'engine should not be null.';

scene = delayCreateScene();

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

window.addEventListener("resize", function () {
    engine.resize();
});
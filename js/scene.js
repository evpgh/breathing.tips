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

// gif exporter
// var capturer = new CCapture( { format: 'gif', workersPath: '/js/', framerate: 24, verbose: true, quality: 80 } );

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };

var scene = null;
var engine = null;
var camera = null;
var idle = null;


var delayCreateScene = function () {

    sceneSettings = function(exercise){
        return fetch(exercise).then(response => response.json())
    }

    // Loading screen
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
    loadingText.fontSize = 25;

    // Get exercise name
    scene_name = window.location.pathname.split("/")[2]
    // Local development defers from production because netlify provides shortening of links
    if (scene_name.includes(".html")) {
      scene_name = scene_name.replace(".html", "")
    }
    sceneURL = "/tips/" + scene_name + ".json"

    // Create basic scene
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(2, -1, -6));
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;
    camera.attachControl(canvas, true);
    // scene.debugLayer.show();

    //  Remove the loading screen
    scene.executeWhenReady(function () { //When everything is done loading
        fullscreenGUI.removeControl(loadingText); //Remove our loading screen
        fullscreenGUI.removeControl(loadingBG);
    }); 

    var fullscreenGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("FullscreenUI", true);

    fullscreenGUI.addControl(loadingBG);
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
    defaultPipeline.depthOfFieldEnabled = true;
    defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
    defaultPipeline.depthOfField.fStop = 2;
    defaultPipeline.depthOfField.focalLength = 6.34;
    defaultPipeline.depthOfField.focusDistance = 590;
    defaultPipeline.samples = 16;
    defaultPipeline.fxaaEnabled = true;
    
    var blackAndWhite = new BABYLON.BlackAndWhitePostProcess("bw", 1.0, null, null, engine, false);
    var horizontalBlur = new BABYLON.BlurPostProcess("hb", new BABYLON.Vector2(1.0, 0), 20, 1.0, null, null, engine, false);
    var blackAndWhiteThenBlur = new BABYLON.PostProcessRenderEffect(engine, "blackAndWhiteThenBlur", function() { return [blackAndWhite, horizontalBlur] });
    

    defaultPipeline.addEffect(blackAndWhiteThenBlur);
    pipeline = defaultPipeline
    
    // UI
    // Adjust pipeline.depthOfField.fStop, kernelSize, focusDistance, focalLength
    var cameraSettingsUI = new BABYLON.ArcRotateCamera("BGCamera", Math.PI / 2 + Math.PI / 7, Math.PI / 2, 100,
        new BABYLON.Vector3(0, 20, 0),
        scene);
    cameraSettingsUI.layerMask = 0x10000000;
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.layer.layerMask = 0x10000000;
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanel);
    var params = [
        {name: "fStop", min:1.2,max:3},
        {name: "focusDistance", min:0,max:1000},
        {name: "focalLength", min:0,max:50}
    ]
    params.forEach(function(param){
        var header = new BABYLON.GUI.TextBlock();
        header.text = param.name+":"+pipeline.depthOfField[param.name].toFixed(2);
        header.height = "40px";
        header.color = "black";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        header.paddingTop = "10px";
        UiPanel.addControl(header); 
        var slider = new BABYLON.GUI.Slider();
        slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        slider.minimum = param.min;
        slider.maximum = param.max;
        slider.color = "#636e72";
        slider.value = pipeline.depthOfField[param.name];
        slider.height = "20px";
        slider.width = "205px";
        UiPanel.addControl(slider); 
        slider.onValueChangedObservable.add(function(v){
            pipeline.depthOfField[param.name] = v;
            header.text = param.name+":"+pipeline.depthOfField[param.name].toFixed(2);
            moveFocusDistance = false;
        }) 
    })

    // scene.activeCameras = [scene.activeCamera, cameraSettingsUI];

    scene.activeCameras = [scene.activeCamera];


    var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 4, diameterX: 4}, scene);
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


    material.metallic = 0.8;
    material.roughness = 0.1;

    mySphere.material = material;
    mySphere.renderingGroupId = 1;

    // material.refractionFresnelParameters = new BABYLON.FresnelParameters();
    // material.refractionFresnelParameters.power = 2;
    // material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    // material.reflectionFresnelParameters.power = 4;
    // material.reflectionFresnelParameters.leftColor = BABYLON.Color3.Black();
    // material.reflectionFresnelParameters.rightColor = BABYLON.Color3.White();


    mySphere.actionManager = new BABYLON.ActionManager(scene);
    mySphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (function(mySphere) {
        document.getElementById("btn-close").style.display = "none";
        document.getElementById("share-modal").style.display = "none";

        idle = false;

        if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
            RunPrefixMethod(document, "CancelFullScreen");
        }
        else {
            // RunPrefixMethod(canvas, "RequestFullScreen");
        }

        sceneSettings(sceneURL).then((response) => {

            var cycle_length = response['hold_empty'] + response['inhale'] + response['hold_full'] + response['exhale']
            offset = 2 // secs after exercise ends
            var full_length = (cycle_length * response['repeat'] + offset) * 1000
            // setTimeout(() => {
            //     // capturer.stop()
            //     // console.log("%c Gif capture stop", 'background: green; color: white');
            //     // capturer.save()
            //     // console.log("%c Gif capture save", 'background: green; color: white');
            // }, 1000 + cycle_length * 1000)
            setTimeout(() => {
                scene.beginAnimation(mySphere, 0, full_length, true);
                mySphere.animations.push(breathingAnimation);
                // capturer.start();
                // console.log("%c Gif capture start : " + mySphere.name, 'background: green; color: white');
            }, 1000)
            setTimeout(() => {
                if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
                    RunPrefixMethod(document, "CancelFullScreen");
                }
                document.getElementById("share-modal").style.display = "block";
                document.getElementById("btn-close").style.display = "block";
                idle=true;
            }, full_length)


        })
        // console.log("%c ActionManager: pick : " + mySphere.name, 'background: green; color: white');
    }).bind(this, mySphere)));

    // Scene intro
    // Camera
    var initialCameraAnimation = new BABYLON.Animation("showOffAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    var cameraKeys = [];
    cameraKeys.push({frame: 0, value: new BABYLON.Vector3(2, -1, -6)})
    cameraKeys.push({frame: 90, value: new BABYLON.Vector3(-5, -1, 3)})
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
        createBreathingAnimKeyFrames(breathingAnimation, response);
        // Env map texture
        addEnvironmentTexture(mySphere, scene, response);
    })
    a = 0
    // Idle material animation
    scene.beforeRender = () => {
        if (idle == true) {
            sphere = scene.meshes.find(element => element.name == 'mySphere')
            a += 0.05;
            b = Math.cos(a) * 0.01
            sphere.scaling = new BABYLON.Vector3(0.2 + b, 0.2 + b, 0.2 + b)
        }
    }

    var addEnvironmentTexture = function(object, scene, recipe) {
        console.log(recipe)
        texturePath = recipe['envmap']
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

    var createBreathingAnimKeyFrames = function(breathingAnimation, recipe) {
        var keys = []
        var length = recipe['hold_empty'] + recipe['inhale'] + recipe['hold_full'] + recipe['exhale']

        for (var i = 0; i < recipe['repeat']; i++) {
            var currFrame = i * 30 * length;
            currFrame += recipe['hold_empty']*30;
            keys.push({frame: currFrame, value: new BABYLON.Vector3(0.195, 0.195, 0.195)})
            currFrame += recipe['inhale']*30;
            keys.push({frame: currFrame, value: new BABYLON.Vector3(1, 1, 1)})
            currFrame += recipe['exhale']*30;
            keys.push({frame: currFrame, value: new BABYLON.Vector3(0.2, 0.2, 0.2)})
            currFrame += recipe['hold_full']*30;
            keys.push({frame: currFrame, value: new BABYLON.Vector3(0.195, 0.195, 0.195)})
        }
        var curr_sec = length * recipe['repeat'];

        // success anim
        keys.push({frame: (curr_sec + 1)*30, value: new BABYLON.Vector3(0.3, 0.3, 0.3)})
        keys.push({frame: (curr_sec + 1.5)*30, value: new BABYLON.Vector3(0.2, 0.2, 0.2)})
        
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

BABYLON.SceneOptimizer.OptimizeAsync(scene)

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
        // capturer.capture(engine.getRenderingCanvasRect);
    }
});

window.addEventListener("resize", function () {
    engine.resize();
});
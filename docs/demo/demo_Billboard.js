/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demoSrc/common.js":
/*!***************************!*\
  !*** ./demoSrc/common.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initScene\": () => (/* binding */ initScene),\n/* harmony export */   \"initLight\": () => (/* binding */ initLight),\n/* harmony export */   \"initCamera\": () => (/* binding */ initCamera),\n/* harmony export */   \"initControl\": () => (/* binding */ initControl),\n/* harmony export */   \"initRenderer\": () => (/* binding */ initRenderer),\n/* harmony export */   \"initHelper\": () => (/* binding */ initHelper),\n/* harmony export */   \"initSceneSet\": () => (/* binding */ initSceneSet),\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ \"./node_modules/three/examples/jsm/controls/OrbitControls.js\");\n\n\n\n\nfunction initScene() {\n  const scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();\n  return scene;\n}\nfunction initLight(scene) {\n  const ambientLight = new three__WEBPACK_IMPORTED_MODULE_0__.AmbientLight(0xffffff, 1.0);\n  scene.add(ambientLight);\n  return ambientLight;\n}\nfunction initCamera(scene, W, H) {\n  const camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(45, W / H, 1, 400);\n  camera.position.set(0, 0, 100);\n  camera.updateMatrixWorld(false);\n  scene.add(camera);\n  return camera;\n}\nfunction initControl(camera, render) {\n  const control = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__.OrbitControls(camera, render.domElement);\n  control.update();\n  return control;\n}\nfunction initRenderer(W, H) {\n  const renderOption = {\n    canvas: document.getElementById(\"webgl-canvas\"),\n    antialias: true\n  };\n  const renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer(renderOption);\n  renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_0__.Color(0x000000));\n  renderer.setSize(W, H);\n  renderer.setPixelRatio(window.devicePixelRatio);\n  return renderer;\n}\nfunction initHelper(scene) {\n  const axesHelper = new three__WEBPACK_IMPORTED_MODULE_0__.AxesHelper(30);\n  scene.add(axesHelper);\n}\nfunction initSceneSet(W, H) {\n  const scene = initScene();\n  initLight(scene);\n  const camera = initCamera(scene, W, H);\n  const renderer = initRenderer(W, H);\n  const control = initControl(camera, renderer);\n  initHelper(scene);\n  render(control, renderer, scene, camera);\n  return scene;\n}\nfunction render(control, renderer, scene, camera) {\n  const rendering = () => {\n    control.update();\n    renderer.render(scene, camera);\n    requestAnimationFrame(rendering);\n  };\n\n  rendering();\n}\n\n//# sourceURL=webpack://threejs-billboard/./demoSrc/common.js?");

/***/ }),

/***/ "./demoSrc/demo_Billboard.js":
/*!***********************************!*\
  !*** ./demoSrc/demo_Billboard.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/ */ \"./lib/index.js\");\n/* harmony import */ var _lib___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib___WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ \"./demoSrc/common.js\");\n\n\nconst W = 640;\nconst H = 480;\n\nconst onDomContentsLoaded = () => {\n  const scene = (0,_common__WEBPACK_IMPORTED_MODULE_1__.initSceneSet)(W, H);\n  initBillBoard(scene);\n};\n\nconst initBillBoard = scene => {\n  const billboard = new _lib___WEBPACK_IMPORTED_MODULE_0__.BillBoard(\"./map01.png\", 0.1);\n  scene.add(billboard);\n  const billboard2 = new _lib___WEBPACK_IMPORTED_MODULE_0__.BillBoard(\"./map01.png\", 0.1);\n  billboard.position.set(-30, 0, 0);\n  scene.add(billboard2);\n};\n\nwindow.onload = onDomContentsLoaded;\n\n//# sourceURL=webpack://threejs-billboard/./demoSrc/demo_Billboard.js?");

/***/ }),

/***/ "./lib/BillBoard.js":
/*!**************************!*\
  !*** ./lib/BillBoard.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.BillBoard = exports.BillBoardOptionUtil = void 0;\n\nvar BillBoardController_1 = __webpack_require__(/*! ./BillBoardController */ \"./lib/BillBoardController.js\");\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar BillBoardOptionUtil =\n/** @class */\nfunction () {\n  function BillBoardOptionUtil() {}\n\n  BillBoardOptionUtil.init = function (option) {\n    if (option == null) {\n      option = {};\n    }\n\n    if (option.minFilter == null) {\n      option.minFilter = three_1.LinearFilter;\n    }\n\n    return option;\n  };\n\n  return BillBoardOptionUtil;\n}();\n\nexports.BillBoardOptionUtil = BillBoardOptionUtil;\n/**\n * 画像ファイルをテクスチャとするビルボードクラス\n */\n\nvar BillBoard =\n/** @class */\nfunction (_super) {\n  __extends(BillBoard, _super);\n  /**\n   * コンストラクタ\n   * @param url テクスチャー画像ファイルのURL\n   * @param imageScale\n   * @param option\n   */\n\n\n  function BillBoard(url, imageScale, option) {\n    var _this = _super.call(this) || this;\n\n    option = BillBoardOptionUtil.init(option);\n    _this.obj = new BillBoardController_1.BillBoardController(_this, url, imageScale, option);\n    return _this;\n  }\n\n  Object.defineProperty(BillBoard.prototype, \"imageScale\", {\n    get: function () {\n      return this.obj.imageScale;\n    },\n\n    /**\n     * 画像のスケールを指定する。\n     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n     * @param value\n     */\n    set: function (value) {\n      this.obj.imageScale = value;\n    },\n    enumerable: false,\n    configurable: true\n  });\n  return BillBoard;\n}(three_1.Sprite);\n\nexports.BillBoard = BillBoard;\n\n//# sourceURL=webpack://threejs-billboard/./lib/BillBoard.js?");

/***/ }),

/***/ "./lib/BillBoardController.js":
/*!************************************!*\
  !*** ./lib/BillBoardController.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.BillBoardController = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/**\n * ビルボード処理に必要な機能を備えたクラス。\n * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。\n */\n\n\nvar BillBoardController =\n/** @class */\nfunction () {\n  /**\n   * コンストラクタ\n   * @param target\n   * @param url テクスチャー画像ファイルのURL\n   * @param imageScale\n   * @param option\n   */\n  function BillBoardController(target, url, imageScale, option) {\n    var _this = this;\n\n    this.isInitGeometry = false;\n    /**\n     * テクスチャ画像のアスペクト比を維持したままスケールを調整する。\n     */\n\n    this.updateScale = function () {\n      var map = _this._target.material.map;\n      if (map == null || map.image == null) return;\n      var img = map.image;\n\n      _this.initGeometry(img);\n\n      var scale = _this.calculateScale(img);\n\n      _this._target.scale.set(scale.x, scale.y, 1);\n    };\n\n    this._target = target;\n    this._imageScale = imageScale;\n    this.initDummyPlane(target);\n    var mat = this.getMaterial(target);\n    mat.visible = false;\n    this._target.material = mat;\n    new three_1.TextureLoader().load(url, function (texture) {\n      texture.minFilter = option.minFilter;\n      mat.map = texture;\n      mat.needsUpdate = true;\n      mat.visible = true;\n\n      _this.updateScale();\n    });\n  }\n\n  BillBoardController.prototype.getMaterial = function (target) {\n    if (target instanceof three_1.Mesh) {\n      return new three_1.MeshBasicMaterial({\n        blending: three_1.NormalBlending,\n        depthTest: true,\n        transparent: true\n      });\n    }\n\n    if (target instanceof three_1.Sprite) {\n      return new three_1.SpriteMaterial({\n        blending: three_1.NormalBlending,\n        depthTest: true,\n        transparent: true\n      });\n    }\n  };\n\n  BillBoardController.prototype.initDummyPlane = function (target) {\n    if (target instanceof three_1.Mesh) {\n      var size = 0.0000001;\n      target.geometry = new three_1.PlaneBufferGeometry(size, size);\n    }\n  };\n\n  BillBoardController.prototype.initGeometry = function (image) {\n    if (!(this._target instanceof three_1.Mesh)) return;\n    if (this.isInitGeometry) return;\n    this._target.geometry = new three_1.PlaneBufferGeometry(image.width, image.height);\n    this.isInitGeometry = true;\n  };\n\n  BillBoardController.prototype.calculateScale = function (img) {\n    if (this._target instanceof three_1.Sprite) {\n      return {\n        x: img.width * this._imageScale,\n        y: img.height * this._imageScale\n      };\n    }\n\n    if (this._target instanceof three_1.Mesh) {\n      return {\n        x: this._imageScale,\n        y: this._imageScale\n      };\n    }\n  };\n\n  Object.defineProperty(BillBoardController.prototype, \"imageScale\", {\n    get: function () {\n      return this._imageScale;\n    },\n\n    /**\n     * 画像のスケールを指定する。\n     *\n     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n     *\n     * @param value\n     */\n    set: function (value) {\n      this._imageScale = value;\n      this.updateScale();\n    },\n    enumerable: false,\n    configurable: true\n  });\n  return BillBoardController;\n}();\n\nexports.BillBoardController = BillBoardController;\n\n//# sourceURL=webpack://threejs-billboard/./lib/BillBoardController.js?");

/***/ }),

/***/ "./lib/BillBoardPlane.js":
/*!*******************************!*\
  !*** ./lib/BillBoardPlane.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.BillBoardPlane = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar BillBoard_1 = __webpack_require__(/*! ./BillBoard */ \"./lib/BillBoard.js\");\n\nvar BillBoardController_1 = __webpack_require__(/*! ./BillBoardController */ \"./lib/BillBoardController.js\");\n\nvar CameraChaser_1 = __webpack_require__(/*! ./CameraChaser */ \"./lib/CameraChaser.js\");\n\nvar BillBoardPlane =\n/** @class */\nfunction (_super) {\n  __extends(BillBoardPlane, _super);\n  /**\n   * コンストラクタ\n   * @param url テクスチャー画像ファイルのURL\n   * @param imageScale\n   * @param option\n   */\n\n\n  function BillBoardPlane(url, imageScale, option) {\n    var _this = _super.call(this) || this;\n\n    option = BillBoard_1.BillBoardOptionUtil.init(option);\n    _this.obj = new BillBoardController_1.BillBoardController(_this, url, imageScale, option);\n    _this.cameraChaser = new CameraChaser_1.CameraChaser(_this);\n    return _this;\n  }\n\n  Object.defineProperty(BillBoardPlane.prototype, \"imageScale\", {\n    get: function () {\n      return this.obj.imageScale;\n    },\n\n    /**\n     * 画像のスケールを指定する。\n     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n     * @param value\n     */\n    set: function (value) {\n      this.obj.imageScale = value;\n    },\n    enumerable: false,\n    configurable: true\n  });\n  return BillBoardPlane;\n}(three_1.Mesh);\n\nexports.BillBoardPlane = BillBoardPlane;\n\n//# sourceURL=webpack://threejs-billboard/./lib/BillBoardPlane.js?");

/***/ }),

/***/ "./lib/CameraChaser.js":
/*!*****************************!*\
  !*** ./lib/CameraChaser.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.CameraChaser = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar CameraChaser =\n/** @class */\nfunction () {\n  function CameraChaser(target) {\n    var _this = this;\n    /**\n     * 水平方向に回転し、カメラに追従するか否か。\n     */\n\n\n    this.isLookingCameraHorizontal = false;\n    this.cameraPos = new three_1.Vector3();\n    this.worldPos = new three_1.Vector3();\n    this.needUpdateWorldPosition = false;\n    /**\n     * Planeをカメラに向ける。lookCameraHorizontal = trueの時だけ稼働する。\n     * 回転方向はY軸を中心とした左右方向のみ。\n     * (X軸方向には回転しない。X軸方向に回転させたい場合はBillBoardクラスを利用する。)\n     *\n     * カメラ位置がPlaneの北極、南極をまたぐと急激に回転するので注意。\n     * 利用する場合はカメラの高さ方向に制限をかけた方が良い。\n     *\n     * @param render\n     * @param scene\n     * @param camera\n     * @param geometry\n     * @param material\n     * @param group\n     */\n\n    this.lookCamera = function (render, scene, camera, geometry, material, group) {\n      if (!_this.isLookingCameraHorizontal) return;\n\n      if (_this.needUpdateWorldPosition) {\n        _this.target.getWorldPosition(_this.worldPos);\n\n        _this.needUpdateWorldPosition = false;\n      }\n\n      _this.cameraPos.set(camera.position.x, _this.worldPos.y, camera.position.z);\n\n      _this.target.lookAt(_this.cameraPos);\n    };\n\n    this.target = target;\n    this.target.getWorldPosition(this.worldPos);\n    this.target.onBeforeRender = this.lookCamera;\n  }\n\n  return CameraChaser;\n}();\n\nexports.CameraChaser = CameraChaser;\n\n//# sourceURL=webpack://threejs-billboard/./lib/CameraChaser.js?");

/***/ }),

/***/ "./lib/ScaleCalculator.js":
/*!********************************!*\
  !*** ./lib/ScaleCalculator.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.ScaleCalculator = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/**\n * ビルボードのスケール値をカメラとレンダラーから算出するためのクラス。\n */\n\n\nvar ScaleCalculator =\n/** @class */\nfunction () {\n  /**\n   * コンストラクタ\n   * @param camera\n   * @param renderer\n   * @param scene\n   */\n  function ScaleCalculator(camera, renderer, scene) {\n    this.worldDirection = new three_1.Vector3();\n    this.worldPosition = new three_1.Vector3();\n    this.targetWorldPosition = new three_1.Vector3();\n    this._camera = camera;\n    this._renderer = renderer;\n    this.plane = new three_1.Plane(new three_1.Vector3(0, 0, -1));\n    this.initRenderTarget(scene);\n  }\n  /**\n   * 表示されないオブジェクトをシーンに挿入する。\n   * このオブジェクトの描画を監視して、カメラ側のプレーンを更新する。\n   * @param scene\n   */\n\n\n  ScaleCalculator.prototype.initRenderTarget = function (scene) {\n    var _this = this;\n\n    var geo = new three_1.SphereBufferGeometry(1e-4, 3, 2);\n    var mat = new three_1.MeshBasicMaterial({\n      transparent: true,\n      opacity: 0.0,\n      depthTest: false\n    });\n    var renderTarget = new three_1.Mesh(geo, mat);\n    renderTarget.renderOrder = Number.MIN_SAFE_INTEGER;\n    scene.add(renderTarget);\n\n    renderTarget.onBeforeRender = function () {\n      _this.updatePlane();\n    };\n  };\n  /**\n   * カメラ側のプレーンの位置を更新する。\n   * このプレーンはカメラの位置と向きに一致する。\n   */\n\n\n  ScaleCalculator.prototype.updatePlane = function () {\n    this.plane.setFromNormalAndCoplanarPoint(this._camera.getWorldDirection(this.worldDirection), this._camera.getWorldPosition(this.worldPosition));\n  };\n  /**\n   * targetがドットバイドット表示になるスケール値を算出する。\n   * プレーンから対象オブジェクトまでの距離を利用し、スケール値を逆算する。\n   *\n   * SpriteMaterial.sizeAttenuation = true[Default]\n   * の設定されたオブジェクト用。\n   * https://threejs.org/docs/#api/en/materials/SpriteMaterial.sizeAttenuation\n   *\n   * @param target\n   */\n\n\n  ScaleCalculator.prototype.getDotByDotScale = function (target) {\n    var size = this._renderer.getSize(new three_1.Vector2());\n\n    var distance = this.plane.distanceToPoint(target.getWorldPosition(this.targetWorldPosition));\n    return this.getFovHeight(distance) / size.height;\n  };\n  /**\n   * SpriteMaterial.sizeAttenuation = false\n   * の設定されたSprite用のスケール値を取得する。\n   */\n\n\n  ScaleCalculator.prototype.getNonAttenuateScale = function () {\n    var size = this._renderer.getSize(new three_1.Vector2());\n\n    return this.getFovHeight(1.0) / size.height;\n  };\n\n  ScaleCalculator.prototype.getFovHeight = function (distance) {\n    var halfFov = three_1.MathUtils.degToRad(this._camera.fov / 2);\n    var half_fov_height = Math.tan(halfFov) * distance;\n    return half_fov_height * 2;\n  };\n\n  return ScaleCalculator;\n}();\n\nexports.ScaleCalculator = ScaleCalculator;\n\n//# sourceURL=webpack://threejs-billboard/./lib/ScaleCalculator.js?");

/***/ }),

/***/ "./lib/StageBillBoard.js":
/*!*******************************!*\
  !*** ./lib/StageBillBoard.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.StageBillBoard = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar StageObject3D_1 = __webpack_require__(/*! ./StageObject3D */ \"./lib/StageObject3D.js\");\n\nvar StageTexture_1 = __webpack_require__(/*! ./StageTexture */ \"./lib/StageTexture.js\");\n\nvar StageBillBoard =\n/** @class */\nfunction (_super) {\n  __extends(StageBillBoard, _super);\n\n  function StageBillBoard(width, height, imageScale, option) {\n    if (imageScale === void 0) {\n      imageScale = 1;\n    }\n\n    var _this = _super.call(this) || this;\n\n    _this._imageScale = imageScale;\n\n    _this.initTexture(width, height, option);\n\n    return _this;\n  }\n\n  StageBillBoard.prototype.initTexture = function (width, height, option) {\n    var texture = new StageTexture_1.StageTexture(width, height);\n    texture.minFilter = three_1.LinearFilter;\n    this.material = new three_1.SpriteMaterial({\n      map: texture,\n      blending: three_1.NormalBlending,\n      depthTest: false,\n      transparent: true\n    });\n    this.updateScale();\n  };\n\n  Object.defineProperty(StageBillBoard.prototype, \"imageScale\", {\n    get: function () {\n      return this._imageScale;\n    },\n\n    /**\n     * 画像のスケールを指定する。\n     *\n     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n     *\n     * @param value\n     */\n    set: function (value) {\n      this._imageScale = value;\n      this.updateScale();\n    },\n    enumerable: false,\n    configurable: true\n  });\n  /**\n   * テクスチャ画像のアスペクト比を維持したままスケールを調整する。\n   */\n\n  StageBillBoard.prototype.updateScale = function () {\n    var map = this.material.map;\n    var canvas = map.domElement;\n    this.scale.set(canvas.width * this._imageScale, canvas.height * this._imageScale, 1);\n  };\n  /**\n   * オブジェクトの表示/非表示を設定する。\n   * 設定に応じてテクスチャの更新を停止/再開する。\n   * @param visible\n   */\n\n\n  StageBillBoard.prototype.setVisible = function (visible) {\n    StageObject3D_1.StageObject3D.setVisible(this, visible);\n  };\n\n  StageBillBoard.prototype.getMap = function () {\n    return this.material.map;\n  };\n\n  Object.defineProperty(StageBillBoard.prototype, \"stage\", {\n    get: function () {\n      return this.getMap().stage;\n    },\n    enumerable: false,\n    configurable: true\n  });\n\n  StageBillBoard.prototype.setNeedUpdate = function () {\n    this.getMap().setNeedUpdate();\n  };\n\n  return StageBillBoard;\n}(three_1.Sprite);\n\nexports.StageBillBoard = StageBillBoard;\n\n//# sourceURL=webpack://threejs-billboard/./lib/StageBillBoard.js?");

/***/ }),

/***/ "./lib/StageObject3D.js":
/*!******************************!*\
  !*** ./lib/StageObject3D.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.StageObject3D = void 0;\n\nvar StageObject3D =\n/** @class */\nfunction () {\n  function StageObject3D() {}\n  /**\n   * オブジェクトの表示/非表示を設定する。\n   * 設定に応じてテクスチャの更新を停止/再開する。\n   * @param object 表示オブジェクト\n   * @param visible\n   */\n\n\n  StageObject3D.setVisible = function (object, visible) {\n    if (object.visible === visible) {\n      return;\n    }\n\n    object.visible = visible;\n    var map = object.material.map;\n    if (map == null) return;\n\n    if (object.visible) {\n      map.start();\n    } else {\n      map.stop();\n    }\n  };\n\n  return StageObject3D;\n}();\n\nexports.StageObject3D = StageObject3D;\n\n//# sourceURL=webpack://threejs-billboard/./lib/StageObject3D.js?");

/***/ }),

/***/ "./lib/StagePlaneMesh.js":
/*!*******************************!*\
  !*** ./lib/StagePlaneMesh.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.StagePlaneMesh = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar CameraChaser_1 = __webpack_require__(/*! ./CameraChaser */ \"./lib/CameraChaser.js\");\n\nvar StageObject3D_1 = __webpack_require__(/*! ./StageObject3D */ \"./lib/StageObject3D.js\");\n\nvar StageTexture_1 = __webpack_require__(/*! ./StageTexture */ \"./lib/StageTexture.js\");\n/**\n * Canvasに描画可能な板オブジェクト。\n * ビルボードと異なり、カメラには追従しない。\n *\n * ジオメトリはPlaneBufferGeometryなので、中心点からずらす場合はtranslateを使用する。\n * https://threejs.org/docs/#api/en/core/BufferGeometry.translate\n */\n\n\nvar StagePlaneMesh =\n/** @class */\nfunction (_super) {\n  __extends(StagePlaneMesh, _super);\n  /**\n   * コンストラクタ\n   * @param width カンバスの幅\n   * @param height カンバスの高さ\n   * @param option テクスチャの初期化オプション\n   */\n\n\n  function StagePlaneMesh(width, height, option) {\n    var _this = _super.call(this) || this;\n\n    _this.initCanvas(width, height, option);\n\n    _this.geometry = new three_1.PlaneBufferGeometry(width, height);\n    _this.cameraChaser = new CameraChaser_1.CameraChaser(_this);\n    return _this;\n  }\n  /**\n   * 描画用カンバスを初期化し、自分自身のマテリアルに格納する。\n   * @param width\n   * @param height\n   * @param option\n   */\n\n\n  StagePlaneMesh.prototype.initCanvas = function (width, height, option) {\n    var texture = new StageTexture_1.StageTexture(width, height);\n    this.material = new three_1.MeshBasicMaterial({\n      map: texture,\n      blending: three_1.NormalBlending,\n      transparent: true,\n      depthTest: true\n    });\n  };\n  /**\n   * オブジェクトの表示/非表示を設定する。\n   * 設定に応じてテクスチャの更新を停止/再開する。\n   * @param visible\n   */\n\n\n  StagePlaneMesh.prototype.setVisible = function (visible) {\n    StageObject3D_1.StageObject3D.setVisible(this, visible);\n  };\n\n  StagePlaneMesh.prototype.getMap = function () {\n    return this.material.map;\n  };\n\n  Object.defineProperty(StagePlaneMesh.prototype, \"stage\", {\n    get: function () {\n      return this.getMap().stage;\n    },\n    enumerable: false,\n    configurable: true\n  });\n\n  StagePlaneMesh.prototype.setNeedUpdate = function () {\n    this.getMap().setNeedUpdate();\n  };\n\n  return StagePlaneMesh;\n}(three_1.Mesh);\n\nexports.StagePlaneMesh = StagePlaneMesh;\n\n//# sourceURL=webpack://threejs-billboard/./lib/StagePlaneMesh.js?");

/***/ }),

/***/ "./lib/StageTexture.js":
/*!*****************************!*\
  !*** ./lib/StageTexture.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nvar __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  Object.defineProperty(o, k2, {\n    enumerable: true,\n    get: function () {\n      return m[k];\n    }\n  });\n} : function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  o[k2] = m[k];\n});\n\nvar __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {\n  Object.defineProperty(o, \"default\", {\n    enumerable: true,\n    value: v\n  });\n} : function (o, v) {\n  o[\"default\"] = v;\n});\n\nvar __importStar = this && this.__importStar || function (mod) {\n  if (mod && mod.__esModule) return mod;\n  var result = {};\n  if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n\n  __setModuleDefault(result, mod);\n\n  return result;\n};\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.StageTexture = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar PIXI = __importStar(__webpack_require__(/*! pixi.js */ \"./node_modules/pixi.js/lib/pixi.es.js\"));\n\nvar pixi_js_1 = __webpack_require__(/*! pixi.js */ \"./node_modules/pixi.js/lib/pixi.es.js\");\n\nvar StageTexture =\n/** @class */\nfunction (_super) {\n  __extends(StageTexture, _super);\n\n  function StageTexture(width, height) {\n    var _this = _super.call(this) || this;\n\n    _this.onRequestFrame = function (e) {\n      if (!_this._needUpdateCanvas) return;\n\n      _this.update();\n\n      _this._needUpdateCanvas = false;\n    };\n\n    _this.init(width, height);\n\n    return _this;\n  }\n\n  StageTexture.prototype.init = function (width, height) {\n    this._app = new PIXI.Application({\n      autoStart: false,\n      transparent: true,\n      width: width,\n      height: height\n    });\n    this.image = this._app.view;\n    this.minFilter = three_1.LinearFilter;\n    this._stage = this._app.stage;\n    this.isStart = false;\n    this.start();\n  };\n  /**\n   * テクスチャの更新を開始する\n   */\n\n\n  StageTexture.prototype.start = function () {\n    if (this.isStart) return;\n    this.isStart = true;\n    pixi_js_1.Ticker.shared.add(this.onRequestFrame);\n  };\n  /**\n   * テクスチャの更新を停止する\n   */\n\n\n  StageTexture.prototype.stop = function () {\n    if (this.isStart) return;\n    this.isStart = false;\n    pixi_js_1.Ticker.shared.remove(this.onRequestFrame);\n  };\n\n  StageTexture.prototype.update = function () {\n    this._app.render();\n\n    this.needsUpdate = true;\n  };\n\n  StageTexture.prototype.setNeedUpdate = function () {\n    this._needUpdateCanvas = true;\n  };\n\n  Object.defineProperty(StageTexture.prototype, \"stage\", {\n    /**\n     * このテクスチャに紐づけられたcreatejs.stageインスタンスを取得する。\n     * カンバスへはstage.canvasでアクセスする。\n     */\n    get: function () {\n      return this._stage;\n    },\n    enumerable: false,\n    configurable: true\n  });\n  Object.defineProperty(StageTexture.prototype, \"domElement\", {\n    get: function () {\n      return this._app.view;\n    },\n    enumerable: false,\n    configurable: true\n  });\n  return StageTexture;\n}(three_1.Texture);\n\nexports.StageTexture = StageTexture;\n\n//# sourceURL=webpack://threejs-billboard/./lib/StageTexture.js?");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  Object.defineProperty(o, k2, {\n    enumerable: true,\n    get: function () {\n      return m[k];\n    }\n  });\n} : function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  o[k2] = m[k];\n});\n\nvar __exportStar = this && this.__exportStar || function (m, exports) {\n  for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\n};\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\n\n__exportStar(__webpack_require__(/*! ./BillBoard */ \"./lib/BillBoard.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./BillBoardPlane */ \"./lib/BillBoardPlane.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./CameraChaser */ \"./lib/CameraChaser.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./ScaleCalculator */ \"./lib/ScaleCalculator.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./StageBillBoard */ \"./lib/StageBillBoard.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./StagePlaneMesh */ \"./lib/StagePlaneMesh.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./StageTexture */ \"./lib/StageTexture.js\"), exports);\n\n//# sourceURL=webpack://threejs-billboard/./lib/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	// It's empty as some runtime module handles the default behavior
/******/ 	__webpack_require__.x = x => {};
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"demo_Billboard": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./demoSrc/demo_Billboard.js","vendor"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = x => {};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkthreejs_billboard"] = self["webpackChunkthreejs_billboard"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = x => {};
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		var startup = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = startup || (x => {});
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
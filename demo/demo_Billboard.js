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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initScene\": () => (/* binding */ initScene),\n/* harmony export */   \"initLight\": () => (/* binding */ initLight),\n/* harmony export */   \"initCamera\": () => (/* binding */ initCamera),\n/* harmony export */   \"initControl\": () => (/* binding */ initControl),\n/* harmony export */   \"initRenderer\": () => (/* binding */ initRenderer),\n/* harmony export */   \"initHelper\": () => (/* binding */ initHelper),\n/* harmony export */   \"initSceneSet\": () => (/* binding */ initSceneSet),\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ \"./node_modules/three/examples/jsm/controls/OrbitControls.js\");\n\n\n\n\nfunction initScene() {\n  const scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();\n  return scene;\n}\nfunction initLight(scene) {\n  const ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 1.0);\n  scene.add(ambientLight);\n  return ambientLight;\n}\nfunction initCamera(scene, W, H) {\n  const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(45, W / H, 1, 400);\n  camera.position.set(0, 0, 100);\n  camera.updateMatrixWorld(false);\n  scene.add(camera);\n  return camera;\n}\nfunction initControl(camera, render) {\n  const control = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, render.domElement);\n  control.update();\n  return control;\n}\nfunction initRenderer(W, H) {\n  const renderOption = {\n    canvas: document.getElementById(\"webgl-canvas\"),\n    antialias: true\n  };\n  const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer(renderOption);\n  renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x000000));\n  renderer.setSize(W, H);\n  renderer.setPixelRatio(window.devicePixelRatio);\n  return renderer;\n}\nfunction initHelper(scene) {\n  const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(30);\n  scene.add(axesHelper);\n}\nfunction initSceneSet(W, H) {\n  const scene = initScene();\n  initLight(scene);\n  const camera = initCamera(scene, W, H);\n  const renderer = initRenderer(W, H);\n  const control = initControl(camera, renderer);\n  initHelper(scene);\n  render(control, renderer, scene, camera);\n  return scene;\n}\nfunction render(control, renderer, scene, camera) {\n  const rendering = () => {\n    control.update();\n    renderer.render(scene, camera);\n    requestAnimationFrame(rendering);\n  };\n\n  rendering();\n}\n\n//# sourceURL=webpack://threejs-billboard/./demoSrc/common.js?");

/***/ }),

/***/ "./demoSrc/demo_Billboard.js":
/*!***********************************!*\
  !*** ./demoSrc/demo_Billboard.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ */ \"./esm/index.js\");\n/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ \"./demoSrc/common.js\");\n\n\nconst W = 640;\nconst H = 480;\n\nconst onDomContentsLoaded = () => {\n  const scene = (0,_common__WEBPACK_IMPORTED_MODULE_1__.initSceneSet)(W, H);\n  initBillBoard(scene);\n};\n\nconst initBillBoard = scene => {\n  const billboard = new ___WEBPACK_IMPORTED_MODULE_0__.BillBoard(\"./map01.png\", 0.1);\n  scene.add(billboard);\n  const billboard2 = new ___WEBPACK_IMPORTED_MODULE_0__.BillBoard(\"./map01.png\", 0.1);\n  billboard.position.set(-30, 0, 0);\n  scene.add(billboard2);\n};\n\nwindow.onload = onDomContentsLoaded;\n\n//# sourceURL=webpack://threejs-billboard/./demoSrc/demo_Billboard.js?");

/***/ }),

/***/ "./esm/BillBoard.js":
/*!**************************!*\
  !*** ./esm/BillBoard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BillBoardOptionUtil\": () => (/* binding */ BillBoardOptionUtil),\n/* harmony export */   \"BillBoard\": () => (/* binding */ BillBoard)\n/* harmony export */ });\n/* harmony import */ var _BillBoardController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BillBoardController */ \"./esm/BillBoardController.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\nclass BillBoardOptionUtil {\n  static init(option) {\n    if (option == null) {\n      option = {};\n    }\n\n    if (option.minFilter == null) {\n      option.minFilter = three__WEBPACK_IMPORTED_MODULE_1__.LinearFilter;\n    }\n\n    return option;\n  }\n\n}\n/**\n * 画像ファイルをテクスチャとするビルボードクラス\n */\n\nclass BillBoard extends three__WEBPACK_IMPORTED_MODULE_1__.Sprite {\n  /**\n   * コンストラクタ\n   * @param url テクスチャー画像ファイルのURL\n   * @param imageScale\n   * @param option\n   */\n  constructor(url, imageScale, option) {\n    super();\n    option = BillBoardOptionUtil.init(option);\n    this.obj = new _BillBoardController__WEBPACK_IMPORTED_MODULE_0__.BillBoardController(this, url, imageScale, option);\n  }\n\n  get imageScale() {\n    return this.obj.imageScale;\n  }\n  /**\n   * 画像のスケールを指定する。\n   * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n   * @param value\n   */\n\n\n  set imageScale(value) {\n    this.obj.imageScale = value;\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/BillBoard.js?");

/***/ }),

/***/ "./esm/BillBoardController.js":
/*!************************************!*\
  !*** ./esm/BillBoardController.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BillBoardController\": () => (/* binding */ BillBoardController)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n/**\n * ビルボード処理に必要な機能を備えたクラス。\n * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。\n */\n\nclass BillBoardController {\n  /**\n   * コンストラクタ\n   * @param target\n   * @param url テクスチャー画像ファイルのURL\n   * @param imageScale\n   * @param option\n   */\n  constructor(target, url, imageScale, option) {\n    this.isInitGeometry = false;\n    /**\n     * テクスチャ画像のアスペクト比を維持したままスケールを調整する。\n     */\n\n    this.updateScale = () => {\n      const map = this._target.material.map;\n      if (map == null || map.image == null) return;\n      const img = map.image;\n      this.initGeometry(img);\n      const scale = this.calculateScale(img);\n\n      this._target.scale.set(scale.x, scale.y, 1);\n    };\n\n    this._target = target;\n    this._imageScale = imageScale;\n    this.initDummyPlane(target);\n    const mat = this.getMaterial(target);\n    mat.visible = false;\n    this._target.material = mat;\n    new three__WEBPACK_IMPORTED_MODULE_0__.TextureLoader().load(url, texture => {\n      texture.minFilter = option.minFilter;\n      mat.map = texture;\n      mat.needsUpdate = true;\n      mat.visible = true;\n      this.updateScale();\n    });\n  }\n\n  getMaterial(target) {\n    if (target instanceof three__WEBPACK_IMPORTED_MODULE_0__.Mesh) {\n      return new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n        blending: three__WEBPACK_IMPORTED_MODULE_0__.NormalBlending,\n        depthTest: true,\n        transparent: true\n      });\n    }\n\n    if (target instanceof three__WEBPACK_IMPORTED_MODULE_0__.Sprite) {\n      return new three__WEBPACK_IMPORTED_MODULE_0__.SpriteMaterial({\n        blending: three__WEBPACK_IMPORTED_MODULE_0__.NormalBlending,\n        depthTest: true,\n        transparent: true\n      });\n    }\n  }\n\n  initDummyPlane(target) {\n    if (target instanceof three__WEBPACK_IMPORTED_MODULE_0__.Mesh) {\n      const size = 0.0000001;\n      target.geometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry(size, size);\n    }\n  }\n\n  initGeometry(image) {\n    if (!(this._target instanceof three__WEBPACK_IMPORTED_MODULE_0__.Mesh)) return;\n    if (this.isInitGeometry) return;\n    this._target.geometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry(image.width, image.height);\n    this.isInitGeometry = true;\n  }\n\n  calculateScale(img) {\n    if (this._target instanceof three__WEBPACK_IMPORTED_MODULE_0__.Sprite) {\n      return {\n        x: img.width * this._imageScale,\n        y: img.height * this._imageScale\n      };\n    }\n\n    if (this._target instanceof three__WEBPACK_IMPORTED_MODULE_0__.Mesh) {\n      return {\n        x: this._imageScale,\n        y: this._imageScale\n      };\n    }\n  }\n\n  get imageScale() {\n    return this._imageScale;\n  }\n  /**\n   * 画像のスケールを指定する。\n   *\n   * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n   *\n   * @param value\n   */\n\n\n  set imageScale(value) {\n    this._imageScale = value;\n    this.updateScale();\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/BillBoardController.js?");

/***/ }),

/***/ "./esm/BillBoardPlane.js":
/*!*******************************!*\
  !*** ./esm/BillBoardPlane.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BillBoardPlane\": () => (/* binding */ BillBoardPlane)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var _BillBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BillBoard */ \"./esm/BillBoard.js\");\n/* harmony import */ var _BillBoardController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BillBoardController */ \"./esm/BillBoardController.js\");\n/* harmony import */ var _CameraChaser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CameraChaser */ \"./esm/CameraChaser.js\");\n\n\n\n\nclass BillBoardPlane extends three__WEBPACK_IMPORTED_MODULE_3__.Mesh {\n  /**\n   * コンストラクタ\n   * @param url テクスチャー画像ファイルのURL\n   * @param imageScale\n   * @param option\n   */\n  constructor(url, imageScale, option) {\n    super();\n    option = _BillBoard__WEBPACK_IMPORTED_MODULE_0__.BillBoardOptionUtil.init(option);\n    this.obj = new _BillBoardController__WEBPACK_IMPORTED_MODULE_1__.BillBoardController(this, url, imageScale, option);\n    this.cameraChaser = new _CameraChaser__WEBPACK_IMPORTED_MODULE_2__.CameraChaser(this);\n  }\n\n  get imageScale() {\n    return this.obj.imageScale;\n  }\n  /**\n   * 画像のスケールを指定する。\n   * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n   * @param value\n   */\n\n\n  set imageScale(value) {\n    this.obj.imageScale = value;\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/BillBoardPlane.js?");

/***/ }),

/***/ "./esm/CameraChaser.js":
/*!*****************************!*\
  !*** ./esm/CameraChaser.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CameraChaser\": () => (/* binding */ CameraChaser)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nclass CameraChaser {\n  constructor(target) {\n    /**\n     * 水平方向に回転し、カメラに追従するか否か。\n     */\n    this.isLookingCameraHorizontal = false;\n    this.cameraPos = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\n    this.worldPos = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\n    this.needUpdateWorldPosition = false;\n    /**\n     * Planeをカメラに向ける。lookCameraHorizontal = trueの時だけ稼働する。\n     * 回転方向はY軸を中心とした左右方向のみ。\n     * (X軸方向には回転しない。X軸方向に回転させたい場合はBillBoardクラスを利用する。)\n     *\n     * カメラ位置がPlaneの北極、南極をまたぐと急激に回転するので注意。\n     * 利用する場合はカメラの高さ方向に制限をかけた方が良い。\n     *\n     * @param render\n     * @param scene\n     * @param camera\n     * @param geometry\n     * @param material\n     * @param group\n     */\n\n    this.lookCamera = (render, scene, camera, geometry, material, group) => {\n      if (!this.isLookingCameraHorizontal) return;\n\n      if (this.needUpdateWorldPosition) {\n        this.target.getWorldPosition(this.worldPos);\n        this.needUpdateWorldPosition = false;\n      }\n\n      this.cameraPos.set(camera.position.x, this.worldPos.y, camera.position.z);\n      this.target.lookAt(this.cameraPos);\n    };\n\n    this.target = target;\n    this.target.getWorldPosition(this.worldPos);\n    this.target.onBeforeRender = this.lookCamera;\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/CameraChaser.js?");

/***/ }),

/***/ "./esm/ScaleCalculator.js":
/*!********************************!*\
  !*** ./esm/ScaleCalculator.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ScaleCalculator\": () => (/* binding */ ScaleCalculator)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n/**\n * ビルボードのスケール値をカメラとレンダラーから算出するためのクラス。\n */\n\nclass ScaleCalculator {\n  /**\n   * コンストラクタ\n   * @param camera\n   * @param renderer\n   * @param scene\n   */\n  constructor(camera, renderer, scene) {\n    this.worldDirection = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\n    this.worldPosition = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\n    this.targetWorldPosition = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\n    this._camera = camera;\n    this._renderer = renderer;\n    this.plane = new three__WEBPACK_IMPORTED_MODULE_0__.Plane(new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1));\n    this.initRenderTarget(scene);\n  }\n  /**\n   * 表示されないオブジェクトをシーンに挿入する。\n   * このオブジェクトの描画を監視して、カメラ側のプレーンを更新する。\n   * @param scene\n   */\n\n\n  initRenderTarget(scene) {\n    const geo = new three__WEBPACK_IMPORTED_MODULE_0__.SphereBufferGeometry(1e-4, 3, 2);\n    const mat = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n      transparent: true,\n      opacity: 0.0,\n      depthTest: false\n    });\n    const renderTarget = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(geo, mat);\n    renderTarget.renderOrder = Number.MIN_SAFE_INTEGER;\n    scene.add(renderTarget);\n\n    renderTarget.onBeforeRender = () => {\n      this.updatePlane();\n    };\n  }\n  /**\n   * カメラ側のプレーンの位置を更新する。\n   * このプレーンはカメラの位置と向きに一致する。\n   */\n\n\n  updatePlane() {\n    this.plane.setFromNormalAndCoplanarPoint(this._camera.getWorldDirection(this.worldDirection), this._camera.getWorldPosition(this.worldPosition));\n  }\n  /**\n   * targetがドットバイドット表示になるスケール値を算出する。\n   * プレーンから対象オブジェクトまでの距離を利用し、スケール値を逆算する。\n   *\n   * SpriteMaterial.sizeAttenuation = true[Default]\n   * の設定されたオブジェクト用。\n   * https://threejs.org/docs/#api/en/materials/SpriteMaterial.sizeAttenuation\n   *\n   * @param target\n   */\n\n\n  getDotByDotScale(target) {\n    const size = this._renderer.getSize(new three__WEBPACK_IMPORTED_MODULE_0__.Vector2());\n\n    const distance = this.plane.distanceToPoint(target.getWorldPosition(this.targetWorldPosition));\n    return this.getFovHeight(distance) / size.height;\n  }\n  /**\n   * SpriteMaterial.sizeAttenuation = false\n   * の設定されたSprite用のスケール値を取得する。\n   */\n\n\n  getNonAttenuateScale() {\n    const size = this._renderer.getSize(new three__WEBPACK_IMPORTED_MODULE_0__.Vector2());\n\n    return this.getFovHeight(1.0) / size.height;\n  }\n\n  getFovHeight(distance) {\n    const halfFov = three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(this._camera.fov / 2);\n    const half_fov_height = Math.tan(halfFov) * distance;\n    return half_fov_height * 2;\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/ScaleCalculator.js?");

/***/ }),

/***/ "./esm/StageBillBoard.js":
/*!*******************************!*\
  !*** ./esm/StageBillBoard.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"StageBillBoard\": () => (/* binding */ StageBillBoard)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var _StageObject3D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StageObject3D */ \"./esm/StageObject3D.js\");\n/* harmony import */ var _StageTexture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StageTexture */ \"./esm/StageTexture.js\");\n\n\n\nclass StageBillBoard extends three__WEBPACK_IMPORTED_MODULE_2__.Sprite {\n  constructor(width, height, imageScale = 1, option) {\n    super();\n    this._imageScale = imageScale;\n    this.initTexture(width, height, option);\n  }\n\n  initTexture(width, height, option) {\n    const texture = new _StageTexture__WEBPACK_IMPORTED_MODULE_1__.StageTexture(width, height);\n    texture.minFilter = three__WEBPACK_IMPORTED_MODULE_2__.LinearFilter;\n    this.material = new three__WEBPACK_IMPORTED_MODULE_2__.SpriteMaterial({\n      map: texture,\n      blending: three__WEBPACK_IMPORTED_MODULE_2__.NormalBlending,\n      depthTest: false,\n      transparent: true\n    });\n    this.updateScale();\n  }\n\n  get imageScale() {\n    return this._imageScale;\n  }\n  /**\n   * 画像のスケールを指定する。\n   *\n   * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。\n   *\n   * @param value\n   */\n\n\n  set imageScale(value) {\n    this._imageScale = value;\n    this.updateScale();\n  }\n  /**\n   * テクスチャ画像のアスペクト比を維持したままスケールを調整する。\n   */\n\n\n  updateScale() {\n    const map = this.material.map;\n    const canvas = map.domElement;\n    this.scale.set(canvas.width * this._imageScale, canvas.height * this._imageScale, 1);\n  }\n  /**\n   * オブジェクトの表示/非表示を設定する。\n   * 設定に応じてテクスチャの更新を停止/再開する。\n   * @param visible\n   */\n\n\n  setVisible(visible) {\n    _StageObject3D__WEBPACK_IMPORTED_MODULE_0__.StageObject3D.setVisible(this, visible);\n  }\n\n  getMap() {\n    return this.material.map;\n  }\n\n  get stage() {\n    return this.getMap().stage;\n  }\n\n  setNeedUpdate() {\n    this.getMap().setNeedUpdate();\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/StageBillBoard.js?");

/***/ }),

/***/ "./esm/StageObject3D.js":
/*!******************************!*\
  !*** ./esm/StageObject3D.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"StageObject3D\": () => (/* binding */ StageObject3D)\n/* harmony export */ });\nclass StageObject3D {\n  /**\n   * オブジェクトの表示/非表示を設定する。\n   * 設定に応じてテクスチャの更新を停止/再開する。\n   * @param object 表示オブジェクト\n   * @param visible\n   */\n  static setVisible(object, visible) {\n    if (object.visible === visible) {\n      return;\n    }\n\n    object.visible = visible;\n    const map = object.material.map;\n    if (map == null) return;\n\n    if (object.visible) {\n      map.start();\n    } else {\n      map.stop();\n    }\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/StageObject3D.js?");

/***/ }),

/***/ "./esm/StagePlaneMesh.js":
/*!*******************************!*\
  !*** ./esm/StagePlaneMesh.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"StagePlaneMesh\": () => (/* binding */ StagePlaneMesh)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var _CameraChaser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CameraChaser */ \"./esm/CameraChaser.js\");\n/* harmony import */ var _StageObject3D__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StageObject3D */ \"./esm/StageObject3D.js\");\n/* harmony import */ var _StageTexture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StageTexture */ \"./esm/StageTexture.js\");\n\n\n\n\n/**\n * Canvasに描画可能な板オブジェクト。\n * ビルボードと異なり、カメラには追従しない。\n *\n * ジオメトリはPlaneBufferGeometryなので、中心点からずらす場合はtranslateを使用する。\n * https://threejs.org/docs/#api/en/core/BufferGeometry.translate\n */\n\nclass StagePlaneMesh extends three__WEBPACK_IMPORTED_MODULE_3__.Mesh {\n  /**\n   * コンストラクタ\n   * @param width カンバスの幅\n   * @param height カンバスの高さ\n   * @param option テクスチャの初期化オプション\n   */\n  constructor(width, height, option) {\n    super();\n    this.initCanvas(width, height, option);\n    this.geometry = new three__WEBPACK_IMPORTED_MODULE_3__.PlaneBufferGeometry(width, height);\n    this.cameraChaser = new _CameraChaser__WEBPACK_IMPORTED_MODULE_0__.CameraChaser(this);\n  }\n  /**\n   * 描画用カンバスを初期化し、自分自身のマテリアルに格納する。\n   * @param width\n   * @param height\n   * @param option\n   */\n\n\n  initCanvas(width, height, option) {\n    const texture = new _StageTexture__WEBPACK_IMPORTED_MODULE_2__.StageTexture(width, height);\n    this.material = new three__WEBPACK_IMPORTED_MODULE_3__.MeshBasicMaterial({\n      map: texture,\n      blending: three__WEBPACK_IMPORTED_MODULE_3__.NormalBlending,\n      transparent: true,\n      depthTest: true\n    });\n  }\n  /**\n   * オブジェクトの表示/非表示を設定する。\n   * 設定に応じてテクスチャの更新を停止/再開する。\n   * @param visible\n   */\n\n\n  setVisible(visible) {\n    _StageObject3D__WEBPACK_IMPORTED_MODULE_1__.StageObject3D.setVisible(this, visible);\n  }\n\n  getMap() {\n    return this.material.map;\n  }\n\n  get stage() {\n    return this.getMap().stage;\n  }\n\n  setNeedUpdate() {\n    this.getMap().setNeedUpdate();\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/StagePlaneMesh.js?");

/***/ }),

/***/ "./esm/StageTexture.js":
/*!*****************************!*\
  !*** ./esm/StageTexture.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"StageTexture\": () => (/* binding */ StageTexture)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var pixi_js_legacy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js-legacy */ \"./node_modules/pixi.js-legacy/dist/esm/pixi-legacy.js\");\n\n\nclass StageTexture extends three__WEBPACK_IMPORTED_MODULE_1__.Texture {\n  constructor(width, height) {\n    super();\n\n    this.onRequestFrame = e => {\n      if (!this._needUpdateCanvas) return;\n      this.update();\n      this._needUpdateCanvas = false;\n    };\n\n    this.init(width, height);\n  }\n\n  init(width, height) {\n    this._app = new pixi_js_legacy__WEBPACK_IMPORTED_MODULE_0__.Application({\n      autoStart: false,\n      backgroundAlpha: 0.0,\n      forceCanvas: true,\n      width: width,\n      height: height\n    });\n    this.image = this._app.view;\n    this.minFilter = three__WEBPACK_IMPORTED_MODULE_1__.LinearFilter;\n    this._stage = this._app.stage;\n    this.isStart = false;\n    this.start();\n  }\n  /**\n   * テクスチャの更新を開始する\n   */\n\n\n  start() {\n    if (this.isStart) return;\n    this.isStart = true;\n    pixi_js_legacy__WEBPACK_IMPORTED_MODULE_0__.Ticker.shared.add(this.onRequestFrame);\n  }\n  /**\n   * テクスチャの更新を停止する\n   */\n\n\n  stop() {\n    if (this.isStart) return;\n    this.isStart = false;\n    pixi_js_legacy__WEBPACK_IMPORTED_MODULE_0__.Ticker.shared.remove(this.onRequestFrame);\n  }\n\n  update() {\n    this._app.render();\n\n    this.needsUpdate = true;\n  }\n\n  setNeedUpdate() {\n    this._needUpdateCanvas = true;\n  }\n  /**\n   * このテクスチャに紐づけられたstageインスタンスを取得する。\n   * カンバスへはstage.canvasでアクセスする。\n   */\n\n\n  get stage() {\n    return this._stage;\n  }\n\n  get domElement() {\n    return this._app.view;\n  }\n\n}\n\n//# sourceURL=webpack://threejs-billboard/./esm/StageTexture.js?");

/***/ }),

/***/ "./esm/index.js":
/*!**********************!*\
  !*** ./esm/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BillBoard\": () => (/* reexport safe */ _BillBoard__WEBPACK_IMPORTED_MODULE_0__.BillBoard),\n/* harmony export */   \"BillBoardOptionUtil\": () => (/* reexport safe */ _BillBoard__WEBPACK_IMPORTED_MODULE_0__.BillBoardOptionUtil),\n/* harmony export */   \"BillBoardPlane\": () => (/* reexport safe */ _BillBoardPlane__WEBPACK_IMPORTED_MODULE_1__.BillBoardPlane),\n/* harmony export */   \"CameraChaser\": () => (/* reexport safe */ _CameraChaser__WEBPACK_IMPORTED_MODULE_2__.CameraChaser),\n/* harmony export */   \"ScaleCalculator\": () => (/* reexport safe */ _ScaleCalculator__WEBPACK_IMPORTED_MODULE_3__.ScaleCalculator),\n/* harmony export */   \"StageBillBoard\": () => (/* reexport safe */ _StageBillBoard__WEBPACK_IMPORTED_MODULE_4__.StageBillBoard),\n/* harmony export */   \"StagePlaneMesh\": () => (/* reexport safe */ _StagePlaneMesh__WEBPACK_IMPORTED_MODULE_5__.StagePlaneMesh),\n/* harmony export */   \"StageTexture\": () => (/* reexport safe */ _StageTexture__WEBPACK_IMPORTED_MODULE_6__.StageTexture)\n/* harmony export */ });\n/* harmony import */ var _BillBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BillBoard */ \"./esm/BillBoard.js\");\n/* harmony import */ var _BillBoardPlane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BillBoardPlane */ \"./esm/BillBoardPlane.js\");\n/* harmony import */ var _CameraChaser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CameraChaser */ \"./esm/CameraChaser.js\");\n/* harmony import */ var _ScaleCalculator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ScaleCalculator */ \"./esm/ScaleCalculator.js\");\n/* harmony import */ var _StageBillBoard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./StageBillBoard */ \"./esm/StageBillBoard.js\");\n/* harmony import */ var _StagePlaneMesh__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./StagePlaneMesh */ \"./esm/StagePlaneMesh.js\");\n/* harmony import */ var _StageTexture__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./StageTexture */ \"./esm/StageTexture.js\");\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://threejs-billboard/./esm/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"demo_Billboard": 0
/******/ 		};
/******/ 		
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
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkthreejs_billboard"] = self["webpackChunkthreejs_billboard"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./demoSrc/demo_Billboard.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
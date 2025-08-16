(() => {
  "use strict";
  var __webpack_modules__ = [ , (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      PuzzleCanvas: () => PuzzleCanvas
    });
    var _ResourceLoader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
    var _Piece_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
    var _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
    var _state_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
    var _AudioPlayer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    class PuzzleCanvas {
      constructor(canvas, levelData = {}, options = {}) {
        var _options$alphaThresho;
        _defineProperty(this, "getTouchPos", (touchEvent => {
          const rect = this.canvas.getBoundingClientRect();
          const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
          return {
            x: (touch.clientX - rect.left) / this.scale,
            y: (touch.clientY - rect.top) / this.scale
          };
        }));
        this.debug = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.snapThreshold = options.snapThreshold || 20;
        this.alphaThreshold = (_options$alphaThresho = options.alphaThreshold) !== null && _options$alphaThresho !== void 0 ? _options$alphaThresho : 20;
        this.state = _state_js__WEBPACK_IMPORTED_MODULE_3__.G_LOADING;
        this.loader = new _ResourceLoader_js__WEBPACK_IMPORTED_MODULE_0__.ResourceLoader;
        this.audioPlayer = new _AudioPlayer_js__WEBPACK_IMPORTED_MODULE_4__.AudioPlayer;
        this.soundMuted = false;
        this.showTargetHint = false;
        this.showPreviewHint = false;
        this.levelData = levelData;
        this.options = options;
        this.targetFPS = options.fps || 30;
        this.frameInterval = 1e3 / this.targetFPS;
        this.lastTimestamp = 0;
        this.needsRedraw = false;
        this.loop = this.loop.bind(this);
        this.dragging = false;
        this.draggedPiece = null;
        this.focusedPiece = null;
        this.current_place_name_sound_piece = null;
        this.scale = 1;
        this.bgImage = this.loader.loadImage(levelData.bg_img, (() => {
          var _levelData$pieces, _levelData$startButto, _levelData$startButto2, _levelData$soundButto, _levelData$soundButto2, _levelData$restartBut, _levelData$restartBut2, _levelData$targetHint, _levelData$targetHint2, _levelData$previewHin, _levelData$previewHin2, _levelData$endButton, _levelData$endButton2;
          this.gameWidth = this.bgImage.width;
          this.gameHeight = this.bgImage.height;
          this.canvas.style.width = "96vw";
          this.canvas.style.height = "96vh";
          const scaleX = this.canvas.clientWidth / this.gameWidth;
          const scaleY = this.canvas.clientHeight / this.gameHeight;
          this.scale = Math.min(scaleX, scaleY);
          this.canvas.style.width = `${this.gameWidth * this.scale}px`;
          this.canvas.style.height = `${this.gameHeight * this.scale}px`;
          this.dpr = window.devicePixelRatio || 1;
          this.canvas.width = this.canvas.clientWidth * this.dpr;
          this.canvas.height = this.canvas.clientHeight * this.dpr;
          this.ctx.setTransform(this.scale * this.dpr, 0, 0, this.scale * this.dpr, 0, 0);
          this.bgImageGlow = this.loader.loadImage(levelData.bg_img_glow);
          if (levelData.bgm) {
            this.bgm = this.loader.loadAudio(levelData.bgm);
            this.bgm.loop = true;
            this.bgm.volume = .5;
          }
          if (levelData.piece_correct_sound) {
            this.piece_correct_sound = this.loader.loadAudio(levelData.piece_correct_sound);
            this.piece_correct_sound.volume = .5;
          }
          this.puzzle_complete_sound = this.loader.loadAudio(levelData.puzzle_complete_sound);
          this.button_up_audio = this.loader.loadAudio(levelData.button_up_sound);
          this.button_up_audio.volume = levelData.button_up_sound_volume;
          this.pieces = [];
          (_levelData$pieces = levelData.pieces) === null || _levelData$pieces === void 0 || _levelData$pieces.forEach((pieceData => {
            const piece = new _Piece_js__WEBPACK_IMPORTED_MODULE_1__.Piece(pieceData, this, this.loader, this.button_up_audio);
            this.pieces.push(piece);
          }));
          this.startButton = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
            x: levelData.startButton.x_a * this.gameWidth + levelData.startButton.x_b,
            y: levelData.startButton.y_a * this.gameHeight + levelData.startButton.y_b,
            w: levelData.startButton.w,
            h: levelData.startButton.h,
            name: "start",
            icon_path: (_levelData$startButto = levelData.startButton) === null || _levelData$startButto === void 0 ? void 0 : _levelData$startButto.icon_path,
            icon_pressed_path: (_levelData$startButto2 = levelData.startButton) === null || _levelData$startButto2 === void 0 ? void 0 : _levelData$startButto2.icon_pressed_path,
            onClick: () => {
              if (this.bgm && this.bgm.paused) {
                this.bgm.play().catch((err => {
                  console.warn("Unable to play BGM:", err);
                }));
              }
              this.state = _state_js__WEBPACK_IMPORTED_MODULE_3__.G_PLAYING;
              this.needsRedraw = true;
            },
            parent: this,
            resourceLoader: this.loader,
            button_up_audio: this.button_up_audio
          });
          const sb = levelData.soundButton || {};
          this.soundIcons = {
            unmuted: this.loader.loadImage(sb.icon_path),
            unmutedPressed: this.loader.loadImage(sb.icon_pressed_path),
            muted: this.loader.loadImage(sb.soundMutedIcon_path),
            mutedPressed: this.loader.loadImage(sb.soundMutedPressedIcon_path)
          };
          this.soundButton = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
            x: levelData.soundButton.x_a * this.gameWidth + levelData.soundButton.x_b,
            y: levelData.soundButton.y_a * this.gameHeight + levelData.soundButton.y_b,
            w: levelData.soundButton.w,
            h: levelData.soundButton.h,
            name: "sound",
            icon_path: (_levelData$soundButto = levelData.soundButton) === null || _levelData$soundButto === void 0 ? void 0 : _levelData$soundButto.icon_path,
            icon_pressed_path: (_levelData$soundButto2 = levelData.soundButton) === null || _levelData$soundButto2 === void 0 ? void 0 : _levelData$soundButto2.icon_pressed_path,
            onClick: () => {
              this.soundMuted = !this.soundMuted;
              if (this.bgm) {
                this.bgm.muted = this.soundMuted;
              }
              this.updateSoundButtonIcon(levelData);
              this.needsRedraw = true;
            },
            parent: this,
            resourceLoader: this.loader
          });
          this.updateSoundButtonIcon(levelData);
          this.restartButton = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
            x: levelData.restartButton.x_a * this.gameWidth + levelData.restartButton.x_b,
            y: levelData.restartButton.y_a * this.gameHeight + levelData.restartButton.y_b,
            w: levelData.restartButton.w,
            h: levelData.restartButton.h,
            icon_path: (_levelData$restartBut = levelData.restartButton) === null || _levelData$restartBut === void 0 ? void 0 : _levelData$restartBut.icon_path,
            icon_pressed_path: (_levelData$restartBut2 = levelData.restartButton) === null || _levelData$restartBut2 === void 0 ? void 0 : _levelData$restartBut2.icon_pressed_path,
            name: "restart",
            onClick: () => {
              this.init_game();
            },
            parent: this,
            resourceLoader: this.loader,
            button_up_audio: this.button_up_audio
          });
          this.targetHintButton = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
            x: levelData.targetHintButton.x_a * this.gameWidth + levelData.targetHintButton.x_b,
            y: levelData.targetHintButton.y_a * this.gameHeight + levelData.targetHintButton.y_b,
            w: levelData.targetHintButton.w,
            h: levelData.targetHintButton.h,
            icon_path: (_levelData$targetHint = levelData.targetHintButton) === null || _levelData$targetHint === void 0 ? void 0 : _levelData$targetHint.icon_path,
            icon_pressed_path: (_levelData$targetHint2 = levelData.targetHintButton) === null || _levelData$targetHint2 === void 0 ? void 0 : _levelData$targetHint2.icon_pressed_path,
            name: "targetHint",
            onClick: () => {
              this.showTargetHint = !this.showTargetHint;
            },
            parent: this,
            resourceLoader: this.loader,
            button_up_audio: this.button_up_audio
          });
          this.previewHintButton = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
            x: levelData.previewHintButton.x_a * this.gameWidth + levelData.previewHintButton.x_b,
            y: levelData.previewHintButton.y_a * this.gameHeight + levelData.previewHintButton.y_b,
            w: levelData.previewHintButton.w,
            h: levelData.previewHintButton.h,
            icon_path: (_levelData$previewHin = levelData.previewHintButton) === null || _levelData$previewHin === void 0 ? void 0 : _levelData$previewHin.icon_path,
            icon_pressed_path: (_levelData$previewHin2 = levelData.previewHintButton) === null || _levelData$previewHin2 === void 0 ? void 0 : _levelData$previewHin2.icon_pressed_path,
            name: "previewHint",
            onClick: () => {
              this.showPreviewHint = !this.showPreviewHint;
            },
            parent: this,
            resourceLoader: this.loader,
            button_up_audio: this.button_up_audio
          });
          this.endButton = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
            x: levelData.endButton.x_a * this.gameWidth + levelData.endButton.x_b,
            y: levelData.endButton.y_a * this.gameHeight + levelData.endButton.y_b,
            w: levelData.endButton.w,
            h: levelData.endButton.h,
            name: "end",
            icon_path: (_levelData$endButton = levelData.endButton) === null || _levelData$endButton === void 0 ? void 0 : _levelData$endButton.icon_path,
            icon_onload: () => {
              this.endButton.autoCenter(this.gameWidth, this.gameHeight);
              this.needsRedraw = true;
            },
            icon_pressed_path: (_levelData$endButton2 = levelData.endButton) === null || _levelData$endButton2 === void 0 ? void 0 : _levelData$endButton2.icon_pressed_path,
            onClick: () => {
              this.needsRedraw = true;
              if (levelData.endUrl) {
                window.location.href = levelData.endUrl;
              }
            },
            parent: this,
            resourceLoader: this.loader,
            button_up_audio: this.button_up_audio
          });
          this.endButtons = [];
            if (Array.isArray(levelData.endButtons)) {
              levelData.endButtons.forEach(btn => {
                const audio = btn.audio ? this.loader.loadAudio(btn.audio) : null;
                const button = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
                  x: btn.x_a * this.gameWidth + btn.x_b,
                  y: btn.y_a * this.gameHeight + btn.y_b,
                  w: btn.w,
                  h: btn.h,
                  name: btn.name,
                  icon_path: btn.icon_path,
                  icon_pressed_path: btn.icon_pressed_path,
                  onClick: () => {
                    if (btn.link) {
                      window.location.href = btn.link;
                    } else if (btn.action === "goToLyric") {
                      window.location.href = "lyric.html";
                    } else if (audio) {
                      audio.currentTime = 0;
                      audio.play();
                    }
                  },
                  parent: this,
                  resourceLoader: this.loader,
                  button_up_audio: this.button_up_audio
                });
                this.endButtons.push(button);
              });
            }
          // customButtons：只播放聲音
          let audioPopup = null;
          this.customButtons = [];
            if (Array.isArray(levelData.customButtons)) {
              levelData.customButtons.forEach(btn => {
                const audio = this.loader.loadAudio(btn.audio);
                const button = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
                  x: (btn.x_a || 0) * this.gameWidth + (btn.x_b || btn.x || 0),
                  y: (btn.y_a || 0) * this.gameHeight + (btn.y_b || btn.y || 0),
                  w: btn.w,
                  h: btn.h,
                  name: btn.name,
                  icon_path: btn.icon_path,
                  icon_pressed_path: btn.icon_pressed_path,
                  onClick: () => {
                    if (btn.link) {
                      window.location.href = btn.link;
                    } else {
                    audio.currentTime = 0;
                    audio.play();
                    console.log("Custom button clicked:", btn.name);
                    }
                  },
                  parent: this,
                  resourceLoader: this.loader,
                  button_up_audio: null
                });
                this.customButtons.push(button);
              });
            }
          
            console.log("Custom buttons loaded:", this.customButtons.length);
        // customButtons2：有彈窗+圖片+聲音顯示
        this.customButtons2 = [];
        if (Array.isArray(levelData.customButtons2)) {
          levelData.customButtons2.forEach(btn => {
            const audio = this.loader.loadAudio(btn.audio);
            const button = new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_2__.CanvasButton({
              x: (btn.x_a || 0) * this.gameWidth + (btn.x_b || btn.x || 0),
              y: (btn.y_a || 0) * this.gameHeight + (btn.y_b || btn.y || 0),
              w: btn.w,
              h: btn.h,
              name: btn.name,
              icon_path: btn.icon_path,
              icon_pressed_path: btn.icon_pressed_path,
              onClick: () => {
                if (!audioPopup) {
                  // 建立對話框
                  audioPopup = document.createElement("div");
                  audioPopup.style.position = "fixed";
                  audioPopup.style.zIndex = "10000";
                  audioPopup.style.padding = "20px";
                  audioPopup.style.backgroundColor = "#fff";
                  audioPopup.style.border = "3px solid #888";
                  audioPopup.style.borderRadius = "16px";
                  audioPopup.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0)";
                  audioPopup.style.textAlign = "center";
                  audioPopup.style.overflowY = "auto";
                  audioPopup.style.fontFamily = "Arial, sans-serif";
                  audioPopup.style.margin = "0 auto";

                  // 響應式定位與大小
                  if (window.innerWidth < 768) {
                    // 手機版
                    audioPopup.style.top = "0px";
                    audioPopup.style.left = "50%";
                    audioPopup.style.transform = "translateX(-50%)";
                    audioPopup.style.width = "95vw";
                    audioPopup.style.maxWidth = "560px";
                    audioPopup.style.maxHeight = "90vh";
                  } else {
                    // 桌機版
                    audioPopup.style.top = "50%";
                    audioPopup.style.left = "50%";
                    audioPopup.style.transform = "translate(-50%, -50%)";
                    audioPopup.style.width = "75vw";
                    audioPopup.style.maxWidth = "700px";
                    audioPopup.style.maxHeight = "90vh";
                  }

                  // 加入圖片
                  if (btn.popup_img) {
                    const img = document.createElement("img");
                    img.src = btn.popup_img;
                    img.style.display = "block";
                    img.style.margin = "0 auto 18px auto";
                    img.style.borderRadius = "16px";
                    img.style.maxWidth = "100%";
                    img.style.width = "100%"; // 💥 強制撐滿彈窗寬度
                    img.style.height = "auto";
                    img.style.objectFit = "contain"; // 保持比例不失真

                    img.style.maxHeight = window.innerWidth < 768 ? "60vh" : "80vh";

                    audioPopup.appendChild(img);
                  }

                  // 關閉按鈕
                  const closeButton = document.createElement("button");
                  closeButton.textContent = "✖";
                  closeButton.style.position = "absolute";
                  closeButton.style.top = "8px";
                  closeButton.style.right = "10px";
                  closeButton.style.width = "36px";
                  closeButton.style.height = "36px";
                  closeButton.style.border = "none";
                  closeButton.style.borderRadius = "50%";
                  closeButton.style.backgroundColor = "#ff5e5e";
                  closeButton.style.color = "#fff";
                  closeButton.style.fontSize = "20px";
                  closeButton.style.cursor = "pointer";
                  closeButton.onclick = () => {
                    audio.pause();
                    audio.currentTime = 0;
                    document.body.removeChild(audioPopup);
                    audioPopup = null;
                  };

                  // 標籤文字
                  const label = document.createElement("div");
                  label.textContent = "🎵 正在播放：" + btn.name;
                  label.style.marginTop = "10px";
                  label.style.fontSize = "18px";
                  label.style.fontWeight = "bold";
                  label.style.color = "#333";

                  // 加入元件
                  audioPopup.appendChild(closeButton);
                  audioPopup.appendChild(label);
                  document.body.appendChild(audioPopup);
                }

                // 播放聲音
                audio.currentTime = 0;
                audio.play();
                console.log("Custom button clicked:", btn.name);
              },
              parent: this,
              resourceLoader: this.loader,
              button_up_audio: null
            });
            this.customButtons2.push(button);
          });
        }

        console.log("Custom buttons loaded:", this.customButtons2.length);


        }));




        this.addEventListeners();
        this.loader.onAllLoaded((() => {
          this.init_game();
        }));
        this.loader.start();
        requestAnimationFrame(this.loop);
      }
      init_game() {
        for (const piece of this.pieces) {
          piece.reset();
        }
        this.state = _state_js__WEBPACK_IMPORTED_MODULE_3__.G_READY;
        this.needsRedraw = true;
        if (this.bgm) {
          this.bgm.pause();
          this.bgm.currentTime = 0;
        }
        this.focusedPiece = null;
      }
      getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
          x: (event.clientX - rect.left) / this.scale,
          y: (event.clientY - rect.top) / this.scale
        };
      }
      addEventListeners() {
        this.canvas.addEventListener("mousedown", (e => {
          const {x, y} = this.getMousePos(e);
          this.handlePointerDown(x, y);
        }));
        this.canvas.addEventListener("mousemove", (e => {
          const {x, y} = this.getMousePos(e);
          this.handlePointerMove(x, y);
        }));
        this.canvas.addEventListener("mouseup", (e => {
          const {x, y} = this.getMousePos(e);
          this.handlePointerUp(x, y);
        }));
        this.canvas.addEventListener("touchstart", (e => {
          const {x, y} = this.getTouchPos(e);
          this.handlePointerDown(x, y);
          e.preventDefault();
        }), {
          passive: false
        });
        this.canvas.addEventListener("touchmove", (e => {
          const {x, y} = this.getTouchPos(e);
          this.handlePointerMove(x, y);
          e.preventDefault();
        }), {
          passive: false
        });
        this.canvas.addEventListener("touchend", (e => {
          const {x, y} = this.getTouchPos(e);
          this.handlePointerUp(x, y);
          e.preventDefault();
        }), {
          passive: false
        });
        this.canvas.addEventListener("touchcancel", (e => {
          this.releasePiece();
          e.preventDefault();
        }), {
          passive: false
        });
      }
      handlePointerDown(x, y) {
        console.log("Pointer down at:", x, y); 

        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_READY) {
          this.startButton.handleDown(x, y);
          this.customButtons.forEach(btn => btn.handleDown(x, y));
          this.customButtons2.forEach(btn => btn.handleDown(x, y));
          return;
        }
        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_PLAYING) {
          this.soundButton.handleDown(x, y);
          this.restartButton.handleDown(x, y);
          this.previewHintButton.handleDown(x, y);
          this.customButtons.forEach(btn => btn.handleDown(x, y));
          this.customButtons2.forEach(btn => btn.handleDown(x, y));
          for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            if (p.snapped) continue;
            const clickedPiece = p.containsPoint(x, y);
            const clickedButton = this.focusedPiece === p && p.btnContainsPoint(x, y);
            
            if (!clickedPiece && !clickedButton) continue;
            if (clickedButton) {
              for (const b of p.buttons) {
                if (b.handleDown(x, y)) return;
              }
            } else {
              if (!p.isOpaqueAt(x, y, this.alphaThreshold)) continue;
              this.dragging = true;
              this.draggedPiece = p;
              this.focusedPiece = p;
              this.offsetX = x - p.x;
              this.offsetY = y - p.y;
              this.canvas.style.cursor = "grabbing";
            }
            break;
          }
        }
        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_END) {
          this.soundButton.handleDown(x, y);
          this.restartButton.handleDown(x, y);
          this.endButton.handleDown(x, y);
          this.previewHintButton.handleDown(x, y);   // ← 新增這行
          this.customButtons.forEach(btn => btn.handleDown(x, y));
          this.customButtons2.forEach(btn => btn.handleDown(x, y));
          this.endButtons.forEach(btn => btn.handleDown(x, y));
          //this.listenButton.handleDown(x, y);
          if (this.listenButton) this.listenButton.handleDown(x, y);
          return;
        }
      }
      handlePointerMove(x, y) {
        if (this.dragging && this.draggedPiece) {
          let newX = x - this.offsetX;
          let newY = y - this.offsetY;
          const piece = this.draggedPiece;
          newX = Math.max(0, Math.min(newX, this.gameWidth - piece.width));
          newY = Math.max(0, Math.min(newY, this.gameHeight - piece.height));
          piece.x = newX;
          piece.y = newY;
          piece.checkSnap(this.snapThreshold);
          this.needsRedraw = true;
        } else {
          this.canvas.style.cursor = "default";
          const buttonsToCheck = [];
          if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_READY) {
            buttonsToCheck.push(this.startButton);
          } else if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_PLAYING) {
            buttonsToCheck.push(this.soundButton, this.restartButton, this.previewHintButton);
          } else if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_END) {
            buttonsToCheck.push(this.soundButton, this.restartButton, this.endButton);
            buttonsToCheck.push(this.previewHintButton);  // ← 新增這行
            this.endButtons.forEach(btn => buttonsToCheck.push(btn));
            this.customButtons.forEach(btn => buttonsToCheck.push(btn));
            this.customButtons2.forEach(btn => buttonsToCheck.push(btn));
            if (this.listenButton) buttonsToCheck.push(this.listenButton);
          }
          this.customButtons.forEach(btn => buttonsToCheck.push(btn));

          for (const btn of buttonsToCheck) {
            if (btn.contains(x, y)) {
              this.canvas.style.cursor = "pointer";
              return;
            }
          }
          if (this.state != _state_js__WEBPACK_IMPORTED_MODULE_3__.G_LOADING) {
            for (const p of this.pieces) {
              if (!p.containsPoint(x, y)) continue;
              if (!p.snapped && p.isOpaqueAt(x, y, this.alphaThreshold)) {
                this.canvas.style.cursor = "grab";
                break;
              }
            }
          }
        }
      }
      handlePointerUp(x, y) {
        console.log("Pointer up at:", x, y);

        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_READY) {
          this.startButton.handleUp(x, y);
          this.customButtons.forEach(btn => btn.handleUp(x, y));
          this.customButtons2.forEach(btn => btn.handleUp(x, y));

          return;
        }
        if (this.state == _state_js__WEBPACK_IMPORTED_MODULE_3__.G_PLAYING) {
          this.soundButton.handleUp(x, y);
          this.restartButton.handleUp(x, y);
          this.previewHintButton.handleUp(x, y);
          this.customButtons.forEach(btn => btn.handleUp(x, y));
          this.customButtons2.forEach(btn => btn.handleUp(x, y));
          if (this.draggedPiece && this.draggedPiece.snapped) {
            this.draggedPiece.x = this.draggedPiece.targetX;
            this.draggedPiece.y = this.draggedPiece.targetY;
            var audioArr = [ this.piece_correct_sound, this.draggedPiece.place_name_sound ];
            this.audioPlayer.playNowMany(audioArr);
          }
          this.releasePiece();
          var isEnd = true;
          for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            if (p.snapped) {
              continue;
            } else {
              isEnd = false;
            }
            for (const b of p.buttons) {
              if (b.handleUp(x, y)) {
                return;
              }
            }
          }
          if (isEnd) {
            this.state = _state_js__WEBPACK_IMPORTED_MODULE_3__.G_END;
            this.audioPlayer.enqueue(this.puzzle_complete_sound);
          }
        }
        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_END) {
          this.soundButton.handleUp(x, y);
          this.restartButton.handleUp(x, y);
          this.endButton.handleUp(x, y);
          this.previewHintButton.handleUp(x, y);   // ← 新增這行
          this.customButtons.forEach(btn => btn.handleUp(x, y));
          this.customButtons2.forEach(btn => btn.handleUp(x, y));//新加
          this.endButtons.forEach(btn => btn.handleUp(x, y));//新加
          //this.listenButton.handleUp(x, y);
          if (this.listenButton) this.listenButton.handleUp(x, y);
          return;
        }
      }
      releasePiece() {
        this.dragging = false;
        this.draggedPiece = null;
        this.canvas.style.cursor = "default";
        this.needsRedraw = true;
      }
      draw() {
        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_LOADING) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillStyle = "#6cc4dc";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillStyle = "white";
          this.ctx.font = "24px sans-serif";
          this.ctx.textAlign = "center";
          let loadingWidth = this.gameWidth ? this.gameWidth : this.canvas.clientWidth;
          let loadingHeight = this.gameHeight ? this.gameHeight : this.canvas.clientHeight;
          this.ctx.fillText("Loading...", loadingWidth / 2, loadingHeight / 2);
          return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
let drawingBgImg = this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_END ? this.bgImageGlow : this.bgImage;
this.ctx.drawImage(drawingBgImg, 0, 0);

        // 1. 底層按鈕（聲音、提示、restart）
        this.soundButton.draw(this.ctx);
        this.previewHintButton.draw(this.ctx);
        this.restartButton.draw(this.ctx);
        this.customButtons.forEach(btn => btn.draw(this.ctx));
        this.customButtons2.forEach(btn => btn.draw(this.ctx));

        // ✅ 3. 中層：拼圖圖塊 pieces（畫在 startButton 之前）
        for (const p of this.pieces) {
          p.draw({
            ctx: this.ctx,
            isFocused: this.focusedPiece === p,
            snapThreshold: this.snapThreshold,
            showPreviewHint: this.showPreviewHint
          });
        }

        // 4. 顯示目標提示（可選）
        if (this.showTargetHint && this.focusedPiece) {
          const hintX = this.focusedPiece.targetX + this.focusedPiece.width / 2;
          const hintY = this.focusedPiece.targetY + this.focusedPiece.height / 2;
          const iconSizeX = 20;
          const iconSizeY = 40;
          this.ctx.drawImage(this.targetHintButton.iconPressedImage, hintX - iconSizeX / 2, hintY - iconSizeY / 2, iconSizeX, iconSizeY);
        }

        // 2. END 狀態按鈕
        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_END) {
          this.ctx.fillStyle = "rgba(0,0,0,0)";
          this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
          this.endButton.draw(this.ctx);
          this.endButtons.forEach(btn => btn.draw(this.ctx));
        }

        // ✅ 5. 最上層：Ready 狀態畫半透明遮罩與 startButton
        if (this.state === _state_js__WEBPACK_IMPORTED_MODULE_3__.G_READY) {
          this.ctx.fillStyle = "rgba(220,220,220,0.5)";
          this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
          this.startButton.draw(this.ctx); // ← 保證畫在最上層
        }



      }
      loop(timestamp) {
        this.draw();
        requestAnimationFrame(this.loop);
      }
      updateSoundButtonIcon() {
        if (!this.soundButton) return;
        if (this.soundMuted) {
          this.soundButton.iconImage = this.soundIcons.muted;
          this.soundButton.iconPressedImage = this.soundIcons.mutedPressed;
        } else {
          this.soundButton.iconImage = this.soundIcons.unmuted;
          this.soundButton.iconPressedImage = this.soundIcons.unmutedPressed;
        }
      }
    }
  }, (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      ResourceLoader: () => ResourceLoader
    });
    class ResourceLoader {
      constructor() {
        this.loadingResources = new Set;
        this.onAllLoadedCallback = null;
      }
      loadImage(src, cb) {
        const img = new Image;
        this.loadingResources.add(img);
        img.onload = () => {
          this.loadingResources.delete(img);
          if (typeof cb === "function") {
            cb(img);
          }
          this.checkIfAllLoaded();
        };
        img.onerror = () => {
          console.warn(`Image failed: ${src}`);
          this.loadingResources.delete(img);
          this.checkIfAllLoaded();
        };
        img.src = src;
        return img;
      }
      loadAudio(src, cb) {
        const audio = new Audio;
        this.loadingResources.add(audio);
        audio.oncanplaythrough = () => {
          this.loadingResources.delete(audio);
          if (typeof cb === "function") {
            cb(audio);
          }
          this.checkIfAllLoaded();
          audio.oncanplaythrough = null;
        };
        audio.onerror = () => {
          console.warn(`Audio failed: ${src}`);
          this.loadingResources.delete(audio);
          this.checkIfAllLoaded();
        };
        audio.src = src;
        audio.load();
        return audio;
      }
      start() {
        this.started = true;
        this.checkIfAllLoaded();
      }
      checkIfAllLoaded() {
        if (this.started && this.loadingResources.size === 0 && this.onAllLoadedCallback) {
          console.log("All resources loaded or failed.");
          this.onAllLoadedCallback();
        }
      }
      onAllLoaded(callback) {
        this.onAllLoadedCallback = callback;
      }
    }
  }, (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      Piece: () => Piece
    });
    var _CanvasButton_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
    class Piece {
      constructor(data, parent, resourceLoader, button_up_audio) {
        const [initX, initY] = data.init_pos.split(",").map(Number);
        const [targetX, targetY] = data.target_pos.split(",").map(Number);
        const initRot = parseFloat(data.init_rotation || 0) * Math.PI / 180;
        const targetRot = parseFloat(data.target_rotation || 0) * Math.PI / 180;
        this.x = initX;
        this.y = initY;
        this.init_pos = [ initX, initY ];
        this.init_rotation = initRot;
        this.rotation = initRot;
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetRotation = targetRot;
        this.snapped = false;
        this.offscreenCtx = null;
        this.width = 0;
        this.height = 0;
        this.radius = 0;
        this.buttons = [];
        this.parent = parent;
        this.place_name_sound = resourceLoader.loadAudio(data.place_name_sound);
        this.place_name_sound.loop = false;
        this.place_name_sound.volume = .5;
        this.place_name_sound.currentTime = 0;
        this.previewHintImg = resourceLoader.loadImage(data.preview_hint_path);
        this.img = resourceLoader.loadImage(data.path, (() => {
          this.width = this.img.width;
          this.height = this.img.height;
          this.radius = .5 * Math.hypot(this.width, this.height);
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(this.img, 0, 0);
          this.offscreenCtx = ctx;
        }));
        this.BTN_SIZE = 32;
        this.BTN_MARGIN = 4;
        this.buttons = [ new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_0__.CanvasButton({
          x: this.x,
          y: this.y - this.BTN_SIZE - 2,
          w: this.BTN_SIZE,
          h: this.BTN_SIZE,
          icon: "left",
          name: "rotate-L",
          onClick: () => this.rotate(-Math.PI / 2),
          parent: this,
          button_up_audio
        }), new _CanvasButton_js__WEBPACK_IMPORTED_MODULE_0__.CanvasButton({
          x: this.x + this.BTN_SIZE + this.BTN_MARGIN,
          y: this.y - this.BTN_SIZE - 2,
          w: this.BTN_SIZE,
          h: this.BTN_SIZE,
          icon: "right",
          name: "rotate-R",
          onClick: () => this.rotate(Math.PI / 2),
          parent: this,
          button_up_audio
        }) ];
      }
      reset() {
        this.x = this.init_pos[0];
        this.y = this.init_pos[1];
        this.rotation = this.init_rotation;
        this.snapped = false;
      }
      rotate(delta) {
        this.rotation = (this.rotation + delta + Math.PI * 2) % (Math.PI * 2);
        this.parent.needsRedraw = true;
      }
      draw({ctx, isFocused, snapThreshold, showPreviewHint}) {
        const drawX = this.snapped ? this.targetX : this.x;
        const drawY = this.snapped ? this.targetY : this.y;
        ctx.save();
        ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
        ctx.rotate(this.rotation);
        let drawingImg = showPreviewHint ? this.previewHintImg : this.img;
        ctx.drawImage(drawingImg, -this.width / 2, -this.height / 2);
        ctx.restore();
        if (isFocused && !this.snapped) {
          if (!this.snapped) {
            const btnY = drawY - this.BTN_SIZE - this.BTN_MARGIN;
            const btnLX = drawX + this.width / 2 - this.BTN_SIZE - 1;
            this.buttons[0].x = btnLX;
            this.buttons[0].y = btnY;
            this.buttons[1].x = btnLX + this.BTN_SIZE + 2;
            this.buttons[1].y = btnY;
            this.buttons.forEach((b => b.draw(ctx)));
          }
          //ctx.save();
          //ctx.strokeStyle = "gray";
          //ctx.lineWidth = 2;
          //ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
          //ctx.rotate(this.rotation);
          //ctx.strokeRect(-this.width / 2 - 4, -this.height / 2 - 4, this.width + 8, this.height + 8);
          //ctx.restore();
        }
        if (this.parent.debug) {
          ctx.save();
          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
          ctx.strokeRect(this.targetX, this.targetY, this.width, this.height);
          ctx.beginPath();
          ctx.arc(this.targetX + this.width / 2, this.targetY + this.height / 2, snapThreshold, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = "green";
          ctx.strokeRect(drawX, drawY, this.width, this.height);
          ctx.fillStyle = "blue";
          ctx.beginPath();
          ctx.arc(drawX + this.width / 2, drawY + this.height / 2, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.restore();
        }
      }
      containsPoint(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
      }
      btnContainsPoint(x, y) {
        for (const btn of this.buttons) {
          if (btn.contains(x, y)) {
            return true;
          }
        }
      }
      isOpaqueAt(x, y, alphaThreshold) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const c = Math.cos(this.rotation);
        const s = Math.sin(this.rotation);
        const localX = dx * c + dy * s + this.width / 2;
        const localY = -dx * s + dy * c + this.height / 2;
        if (localX < 0 || localY < 0 || localX >= this.width || localY >= this.height) return false;
        const a = this.offscreenCtx.getImageData(localX, localY, 1, 1).data[3];
        return a >= alphaThreshold;
      }
      checkSnap(snapThreshold) {
        const dx = this.x - this.targetX;
        const dy = this.y - this.targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angleDiff = Math.abs(this.rotation - this.targetRotation);
        this.snapped = dist <= snapThreshold && angleDiff < .1;
      }
    }
  }, (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      CanvasButton: () => CanvasButton
    });
    var _AudioPlayer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
    class CanvasButton {
      constructor({x, y, w, h, icon, icon_path, icon_pressed_path, name, onClick, parent, resourceLoader, icon_onload, icon_pressed_onload, button_up_audio}) {
        Object.assign(this, {
          x,
          y,
          w,
          h,
          icon,
          name,
          onClick,
          parent,
          button_up_audio
        });
        this.hovered = false;
        this.pressed = false;
        this.disabled = false;
        if (icon_path) {
          this.iconImage = resourceLoader.loadImage(icon_path, icon_onload);
        }
        if (icon_pressed_path) {
          this.iconPressedImage = resourceLoader.loadImage(icon_pressed_path, icon_pressed_onload);
        }
        this.audioPlayer = new _AudioPlayer_js__WEBPACK_IMPORTED_MODULE_0__.AudioPlayer;
      }
      contains(px, py) {
        return !this.disabled && px >= this.x && py >= this.y && px <= this.x + this.w && py <= this.y + this.h;
      }
      handleClick(px, py) {
        if (this.contains(px, py)) {
          var _this$onClick;
          (_this$onClick = this.onClick) === null || _this$onClick === void 0 || _this$onClick.call(this);
          this.parent.needsRedraw = true;
        }
      }
      handleClickDelayed(px, py) {
        if (this.contains(px, py)) {
          this.pressed = true;
          this.parent.needsRedraw = true;
          this.delayFrames(12, (() => {
            this.pressed = false;
            this.parent.needsRedraw = true;
          }));
          this.delayFrames(24, (() => {
            var _this$onClick2;
            (_this$onClick2 = this.onClick) === null || _this$onClick2 === void 0 || _this$onClick2.call(this);
            this.pressed = false;
            this.parent.needsRedraw = true;
          }));
        } else {
          this.pressed = false;
          this.parent.needsRedraw = true;
        }
      }
      handleDown(px, py) {
        if (this.contains(px, py)) {
          this.pressed = true;
          this.parent.needsRedraw = true;
          return true;
        }
        return false;
      }
      handleUp(px, py) {
        if (this.pressed && this.contains(px, py)) {
          var _this$onClick3;
          if (this.button_up_audio) {
            this.audioPlayer.playNow(this.button_up_audio);
          }
          (_this$onClick3 = this.onClick) === null || _this$onClick3 === void 0 || _this$onClick3.call(this);
        }
        this.pressed = false;
        this.parent.needsRedraw = true;
      }
      handleMove(px, py) {
        const h = this.contains(px, py);
        if (h !== this.hovered) {
          this.hovered = h;
          this.parent.needsRedraw = true;
        }
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.disabled ? "#666" : this.pressed ? "#111" : this.hovered ? "#333" : "#222";
        const img = this.pressed ? this.iconPressedImage : this.iconImage;
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.drawImage(img, 0, 0, this.w, this.h);
        } else if (this.icon) {
          ctx.fillStyle = "#222";
          ctx.fillRect(0, 0, this.w, this.h);
          ctx.fillStyle = "white";
          ctx.beginPath();
          if (this.icon === "left") {
            ctx.moveTo(this.w * .65, this.h * .2);
            ctx.lineTo(this.w * .35, this.h * .5);
            ctx.lineTo(this.w * .65, this.h * .8);
          } else if (this.icon === "right") {
            ctx.moveTo(this.w * .35, this.h * .2);
            ctx.lineTo(this.w * .65, this.h * .5);
            ctx.lineTo(this.w * .35, this.h * .8);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      autoCenter(gameWidth, gameHeight) {
        const img = this.iconImage;
        if (img && img.complete && img.naturalWidth) {
          this.w = img.naturalWidth;
          this.h = img.naturalHeight;
          this.x = (gameWidth - this.w) / 2;
          this.y = (gameHeight - this.h) / 2;
        }
      }
      delayFrames(n, callback) {
        if (n <= 0) {
          callback();
          return;
        }
        requestAnimationFrame((() => this.delayFrames(n - 1, callback)));
      }
    }
  }, (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      AudioPlayer: () => AudioPlayer
    });
    class AudioPlayer {
      constructor() {
        this.current = null;
        this.queue = [];
        this.isPlaying = false;
        this.muted = false;
      }
      playNow(audio) {
        this._stopCurrent();
        this.queue = [];
        this.current = audio;
        this._playAudio(audio);
      }
      playNowMany(audiosArray) {
        if (!Array.isArray(audiosArray)) return;
        this._stopCurrent();
        this.queue = [];
        for (var i = 0; i < audiosArray.length; i++) {
          var item = audiosArray[i];
          if (item instanceof Audio) {
            this.queue.push(item);
          } else {
            console.warn("Skipped non-Audio item at index", i, item);
          }
        }
        this._playNext();
      }
      enqueue(audio) {
        this.queue.push(audio);
        if (!this.isPlaying) {
          this._playNext();
        }
      }
      stop() {
        this._stopCurrent();
        this.queue = [];
      }
      setMute(isMuted) {
        this.muted = isMuted;
        if (this.current) {
          this.current.muted = isMuted;
        }
      }
      _playAudio(audio) {
        this.isPlaying = true;
        this.current = audio;
        this.current.currentTime = 0;
        this.current.muted = this.muted;
        audio.onended = () => {
          this.isPlaying = false;
          this._playNext();
        };
        audio.play();
      }
      _playNext() {
        if (this.queue.length === 0) return;
        const next = this.queue.shift();
        this._playAudio(next);
      }
      _stopCurrent() {
        if (this.current) {
          this.current.pause();
          this.current.currentTime = 0;
          this.current.onended = null;
          this.current = null;
        }
        this.isPlaying = false;
      }
    }
  }, (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      G_END: () => G_END,
      G_LOADING: () => G_LOADING,
      G_PLAYING: () => G_PLAYING,
      G_READY: () => G_READY
    });
    const G_LOADING = "loading";
    const G_READY = "ready";
    const G_PLAYING = "playing";
    const G_END = "end";
  } ];
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();
  (() => {
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    __webpack_require__.r = exports => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module"
        });
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
    };
  })();
  var __webpack_exports__ = {};
  (() => {
    __webpack_require__.r(__webpack_exports__);
    var _puzzle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
    window.PuzzleCanvas = _puzzle_js__WEBPACK_IMPORTED_MODULE_0__.PuzzleCanvas;
  })();
})();

webpackJsonp([0],{

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageViewerPageModule", function() { return ImageViewerPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__image_viewer__ = __webpack_require__(272);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ImageViewerPageModule = (function () {
    function ImageViewerPageModule() {
    }
    ImageViewerPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__image_viewer__["a" /* ImageViewerPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__image_viewer__["a" /* ImageViewerPage */]),
            ],
        })
    ], ImageViewerPageModule);
    return ImageViewerPageModule;
}());

//# sourceMappingURL=image-viewer.module.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImageViewerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(49);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ImageViewerPage = (function () {
    function ImageViewerPage(navCtrl, navParams, viewCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        // input param
        this.imageurl = '';
        this.rotate = 0;
        this.scale = 1;
        // double click flag
        this.firstClick = false;
        // double click init size or double size
        this.doubleImg = false;
        // image loading flag
        this.imageload = 0;
        // image's position(x,y) and with,height.
        this.position = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.ongoingTouches = []; //save touch event
        this.doubleImageFlag = 0;
        // get param and init image
        this.imageurl = this.navParams.get('imageurl');
        console.log(this.imageurl);
        this.image = new Image();
        this.image.src = this.imageurl;
        this.image.onload = function () {
            _this.imageload++;
            if (_this.imageload === 2) {
                _this.resetImage();
                _this.bindEvent();
            }
        };
    }
    ImageViewerPage.prototype.ionViewDidEnter = function () {
        var canvas = (this.canvas = this.canvasRef.nativeElement);
        var context = (this.context = this.canvas.getContext('2d'));
        this.canvas.width = this.contentRef.contentWidth;
        this.canvas.height = this.contentRef.contentHeight;
        this.offCanvas = document.createElement('canvas');
        this.offContext = this.offCanvas.getContext('2d');
        this.offCanvas.width = this.canvas.width;
        this.offCanvas.height = this.canvas.height;
        this.imageload++;
        if (this.imageload === 2) {
            this.resetImage();
            this.bindEvent();
        }
    };
    //set event listener
    ImageViewerPage.prototype.bindEvent = function () {
        this.canvas.addEventListener('touchstart', this.handleStart.bind(this));
        this.canvas.addEventListener('touchend', this.handleEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.handleCancel.bind(this));
        this.canvas.addEventListener('touchleave', this.handleEnd.bind(this));
        this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
        console.log('initialized.');
    };
    //touch start event
    ImageViewerPage.prototype.handleStart = function (evt) {
        evt.preventDefault(); // blocking the default behavior of the event
        console.log('touchstart.');
        var touches = evt.changedTouches;
        if (touches.length === 1) {
            if (this.doubleImageFlag === 0 || this.doubleImageFlag === 2) {
                this.doubleImageFlag++;
            }
            else {
                this.doubleImageFlag = 0;
            }
        }
        for (var i = 0; i < touches.length; i++) {
            console.log('touchstart:' + i + '...');
            this.ongoingTouches.push(touches[i]);
            console.log('touchstart:' + i + '.');
        }
    };
    // touch move event
    ImageViewerPage.prototype.handleMove = function (evt) {
        evt.preventDefault();
        var touches = evt.changedTouches;
        // one finger, move image
        if (touches.length === 1) {
            var idx = this.ongoingTouchIndexById(touches[0].identifier);
            if (idx >= 0) {
                console.log('continuing touch ' + idx);
                this.position.x =
                    this.position.x + touches[0].pageX - this.ongoingTouches[idx].pageX;
                this.position.y =
                    this.position.y + touches[0].pageY - this.ongoingTouches[idx].pageY;
                this.draw();
                this.ongoingTouches.splice(idx, 1, touches[0]); // 更新ongoingTouches中的数据
                console.log('.');
            }
            else {
                console.log("can't figure out which touch to continue");
            }
            return;
        }
        // two fingers, scare image
        if (touches.length >= 2) {
            var idx1 = this.ongoingTouchIndexById(touches[0].identifier);
            var idx2 = this.ongoingTouchIndexById(touches[1].identifier);
            if (idx1 >= 0 && idx2 > 0) {
                console.log('continuing touch ' + idx1);
                var lenPrev = this.distance(this.ongoingTouches[idx1].pageX, this.ongoingTouches[idx1].pageY, this.ongoingTouches[idx2].pageX, this.ongoingTouches[idx2].pageY);
                var lenNow = this.distance(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
                var len = lenNow - lenPrev;
                this.scale = 1 + len * 0.01;
                var _a = this.position, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
                this.position.x = x - (w / 2) * (this.scale - 1);
                this.position.y = y - (h / 2) * (this.scale - 1);
                this.position.w = w * this.scale;
                this.position.h = h * this.scale;
                this.draw();
                this.ongoingTouches.splice(idx1, 1, touches[0]); // update ongoingTouche data
                this.ongoingTouches.splice(idx2, 1, touches[1]); // update ongoingTouche data
                console.log('.');
            }
            else {
                console.log("can't figure out which touch to continue");
            }
        }
    };
    // touch end event
    ImageViewerPage.prototype.handleEnd = function (evt) {
        var _this = this;
        evt.preventDefault();
        console.log('touchend/touchleave.');
        var touches = evt.changedTouches;
        if (touches.length === 1) {
            if (this.doubleImageFlag === 1) {
                this.doubleImageFlag++;
                setTimeout(function () {
                    console.log('first click timeout! ');
                    _this.doubleImageFlag = 0;
                }, 300);
            }
            else if (this.doubleImageFlag === 3) {
                this.doubleImageFlag = 0;
                this.firstClick = false;
                if (this.doubleImg) {
                    this.resetImage();
                    this.doubleImg = false;
                }
                else {
                    this.scale = 2;
                    var _a = this.position, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
                    this.position.x = x - (w / 2) * (this.scale - 1);
                    this.position.y = y - (h / 2) * (this.scale - 1);
                    this.position.w = w * this.scale;
                    this.position.h = h * this.scale;
                    this.draw();
                    this.doubleImg = true;
                }
            }
        }
        for (var i = 0; i < touches.length; i++) {
            var idx = this.ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                this.ongoingTouches.splice(idx, 1); // remove it; we're done
            }
            else {
                console.log("can't figure out which touch to end");
            }
        }
    };
    // touch broken event
    ImageViewerPage.prototype.handleCancel = function (evt) {
        evt.preventDefault();
        console.log('touchcancel.');
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            this.ongoingTouches.splice(i, 1); // remove it; we're done
        }
    };
    // find out which touch object is active
    ImageViewerPage.prototype.ongoingTouchIndexById = function (idToFind) {
        for (var i = 0; i < this.ongoingTouches.length; i++) {
            var id = this.ongoingTouches[i].identifier;
            if (id == idToFind) {
                return i;
            }
        }
        return -1; // not found
    };
    // draw image with position
    ImageViewerPage.prototype.draw = function () {
        this.offContext.fillStyle = '#FFFFFF';
        this.offContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.offContext.save();
        this.offContext.translate(this.position.x + this.position.w / 2, this.position.y + this.position.h / 2);
        this.offContext.rotate((this.rotate / 180) * Math.PI);
        this.offContext.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.position.w / 2, -this.position.h / 2, this.position.w, this.position.h);
        this.offContext.restore();
        this.context.drawImage(this.offCanvas, 0, 0);
    };
    ImageViewerPage.prototype.distance = function (x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    };
    ImageViewerPage.prototype.clockwise = function () {
        this.rotate += 90;
        this.resetImage();
    };
    ImageViewerPage.prototype.counterclockwise = function () {
        this.rotate -= 90;
        this.resetImage();
    };
    ImageViewerPage.prototype.resetImage = function () {
        this.position.x = this.canvas.width / 2 - this.image.width / 2;
        this.position.y = this.canvas.height / 2 - this.image.height / 2;
        this.position.w = this.image.width;
        this.position.h = this.image.height;
        this.draw();
    };
    ImageViewerPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ImageViewerPage.prototype.change = function () {
        var _this = this;
        // double click
        if (this.firstClick) {
            this.firstClick = false;
        }
        else {
            this.firstClick = true;
            setTimeout(function () { return (_this.firstClick = false); }, 300);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('canvas'),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */]) === "function" && _a || Object)
    ], ImageViewerPage.prototype, "canvasRef", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('content'),
        __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* Content */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* Content */]) === "function" && _b || Object)
    ], ImageViewerPage.prototype, "contentRef", void 0);
    ImageViewerPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-image-viewer',template:/*ion-inline-start:"D:\IntelliJ IDEA\web\ionicstudy\image-viewer\src\pages\image-viewer\image-viewer.html"*/'<ion-header>\n  <div class="buttons">\n    <button class="rotate-button" (click)="clockwise()">\n      <ion-icon name="ios-redo"></ion-icon>\n      90°\n    </button>\n    <button class="rotate-button" (click)="counterclockwise()">\n      <ion-icon name="ios-undo"></ion-icon>\n      90°\n    </button>\n    <button class="rotate-button" (click)="resetImage()">\n      <ion-icon name="ios-image"></ion-icon>\n      init\n    </button>\n    <button class="cancel-button" (click)="dismiss()">close</button>\n  </div>\n</ion-header>\n\n<ion-content #content>\n  <canvas #canvas></canvas>\n</ion-content>\n'/*ion-inline-end:"D:\IntelliJ IDEA\web\ionicstudy\image-viewer\src\pages\image-viewer\image-viewer.html"*/
        }),
        __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */]) === "function" && _e || Object])
    ], ImageViewerPage);
    return ImageViewerPage;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=image-viewer.js.map

/***/ })

});
//# sourceMappingURL=0.js.map
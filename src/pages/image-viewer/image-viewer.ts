import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-image-viewer',
  templateUrl: 'image-viewer.html'
})
export class ImageViewerPage {

  // input param
  imageurl = '';

  rotate = 0;
  scale = 1;

  // double click flag
  firstClick = false;
  // double click init size or double size
  doubleImg = false;

  image;
  // image loading flag
  imageload = 0;

  // image's position(x,y) and with,height.
  position = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };

  // ref to canvas to get native element
  @ViewChild('canvas') canvasRef: ElementRef;
  // ref to content to get content with and height
  @ViewChild('content') contentRef: Content;
  // native canvas element
  canvas: HTMLCanvasElement;
  // context in canvas
  context: CanvasRenderingContext2D;
  // offscreen canvas
  offCanvas: HTMLCanvasElement;
  offContext: CanvasRenderingContext2D;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    // get param and init image
    this.imageurl = this.navParams.get('imageurl');
    console.log(this.imageurl);

    this.image = new Image();
    this.image.src = this.imageurl;
    this.image.onload = () => {
      this.imageload++;
      if (this.imageload === 2) {
        this.resetImage();
        this.bindEvent();
      }
    };
  }

  ionViewDidEnter() {
    let canvas = (this.canvas = this.canvasRef.nativeElement);
    let context = (this.context = this.canvas.getContext('2d'));
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
  }

  ongoingTouches = []; //save touch event

  //set event listener
  bindEvent() {
    this.canvas.addEventListener('touchstart', this.handleStart.bind(this));
    this.canvas.addEventListener('touchend', this.handleEnd.bind(this));
    this.canvas.addEventListener('touchcancel', this.handleCancel.bind(this));
    this.canvas.addEventListener('touchleave', this.handleEnd.bind(this));
    this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
    console.log('initialized.');
  }

  doubleImageFlag = 0;

  //touch start event
  handleStart(evt) {
    evt.preventDefault(); // blocking the default behavior of the event
    console.log('touchstart.');
    let touches = evt.changedTouches;
    if (touches.length === 1) {
      if (this.doubleImageFlag === 0 || this.doubleImageFlag === 2) {
        this.doubleImageFlag++;
      } else {
        this.doubleImageFlag = 0;
      }
    }

    for (let i = 0; i < touches.length; i++) {
      console.log('touchstart:' + i + '...');
      this.ongoingTouches.push(touches[i]);

      console.log('touchstart:' + i + '.');
    }
  }

  // touch move event
  handleMove(evt) {
    evt.preventDefault();
    let touches = evt.changedTouches;

    // one finger, move image
    if (touches.length === 1) {
      let idx = this.ongoingTouchIndexById(touches[0].identifier);

      if (idx >= 0) {
        console.log('continuing touch ' + idx);
        this.position.x =
          this.position.x + touches[0].pageX - this.ongoingTouches[idx].pageX;
        this.position.y =
          this.position.y + touches[0].pageY - this.ongoingTouches[idx].pageY;
        this.draw();
        this.ongoingTouches.splice(idx, 1, touches[0]); // 更新ongoingTouches中的数据
        console.log('.');
      } else {
        console.log("can't figure out which touch to continue");
      }
      return;
    }

    // two fingers, scare image
    if (touches.length >= 2) {
      let idx1 = this.ongoingTouchIndexById(touches[0].identifier);
      let idx2 = this.ongoingTouchIndexById(touches[1].identifier);

      if (idx1 >= 0 && idx2 > 0) {
        console.log('continuing touch ' + idx1);

        let lenPrev = this.distance(
          this.ongoingTouches[idx1].pageX,
          this.ongoingTouches[idx1].pageY,
          this.ongoingTouches[idx2].pageX,
          this.ongoingTouches[idx2].pageY
        );

        let lenNow = this.distance(
          touches[0].pageX,
          touches[0].pageY,
          touches[1].pageX,
          touches[1].pageY
        );

        let len = lenNow - lenPrev;
        this.scale = 1 + len * 0.01;
        let { x, y, w, h } = this.position;
        this.position.x = x - (w / 2) * (this.scale - 1);
        this.position.y = y - (h / 2) * (this.scale - 1);
        this.position.w = w * this.scale;
        this.position.h = h * this.scale;
        this.draw();

        this.ongoingTouches.splice(idx1, 1, touches[0]); // update ongoingTouche data
        this.ongoingTouches.splice(idx2, 1, touches[1]); // update ongoingTouche data
        console.log('.');
      } else {
        console.log("can't figure out which touch to continue");
      }
    }
  }


  // touch end event
  handleEnd(evt) {
    evt.preventDefault();
    console.log('touchend/touchleave.');
    let touches = evt.changedTouches;

    if (touches.length === 1) {
      if (this.doubleImageFlag === 1) {
        this.doubleImageFlag++;
        setTimeout(() => {
          console.log('first click timeout! ');
          this.doubleImageFlag = 0;
        }, 300);
      } else if (this.doubleImageFlag === 3) {
        this.doubleImageFlag = 0;
        this.firstClick = false;
        if (this.doubleImg) {
          this.resetImage();
          this.doubleImg = false;
        } else {
          this.scale = 2;
          let { x, y, w, h } = this.position;
          this.position.x = x - (w / 2) * (this.scale - 1);
          this.position.y = y - (h / 2) * (this.scale - 1);
          this.position.w = w * this.scale;
          this.position.h = h * this.scale;
          this.draw();
          this.doubleImg = true;
        }
      }
    }

    for (let i = 0; i < touches.length; i++) {
      let idx = this.ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        this.ongoingTouches.splice(idx, 1); // remove it; we're done
      } else {
        console.log("can't figure out which touch to end");
      }
    }
  }

  // touch broken event
  handleCancel(evt) {
    evt.preventDefault();
    console.log('touchcancel.');
    let touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      this.ongoingTouches.splice(i, 1); // remove it; we're done
    }
  }

  // find out which touch object is active
  ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < this.ongoingTouches.length; i++) {
      let id = this.ongoingTouches[i].identifier;

      if (id == idToFind) {
        return i;
      }
    }
    return -1; // not found
  }

  // draw image with position
  draw() {
    this.offContext.fillStyle = '#FFFFFF';
    this.offContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.offContext.save();
    this.offContext.translate(
      this.position.x + this.position.w / 2,
      this.position.y + this.position.h / 2
    );
    this.offContext.rotate((this.rotate / 180) * Math.PI);
    this.offContext.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      -this.position.w / 2,
      -this.position.h / 2,
      this.position.w,
      this.position.h
    );
    this.offContext.restore();

    this.context.drawImage(this.offCanvas, 0, 0);
  }

  distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  clockwise() {
    this.rotate += 90;
    this.resetImage();
  }

  counterclockwise() {
    this.rotate -= 90;
    this.resetImage();
  }

  resetImage() {
    this.position.x = this.canvas.width / 2 - this.image.width / 2;
    this.position.y = this.canvas.height / 2 - this.image.height / 2;
    this.position.w = this.image.width;
    this.position.h = this.image.height;
    this.draw();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  change() {
    // double click
    if (this.firstClick) {
      this.firstClick = false;
    } else {
      this.firstClick = true;
      setTimeout(() => (this.firstClick = false), 300);
    }
  }
}

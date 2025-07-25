// TapPuzzleCanvas.js
export class TapPuzzleCanvas {
  constructor(canvas, levelData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.levelData = levelData;
    this.pieces = []; // 將圖片與播放資訊放入
    this.audioElements = {};

    this.loadPieces();
    this.addEventListeners();
    requestAnimationFrame(() => this.render());
  }

  loadPieces() {
    const { pieces } = this.levelData;
    pieces.forEach(piece => {
      const img = new Image();
      img.src = piece.path;
      const audio = new Audio(piece.place_name_sound);
      this.audioElements[piece.place_name_sound] = audio;

      this.pieces.push({
        img,
        x: piece.target_pos.split(",")[0] * 1,
        y: piece.target_pos.split(",")[1] * 1,
        rotation: piece.target_rotation || 0,
        audio: piece.place_name_sound
      });
    });
  }

  addEventListeners() {
    this.canvas.addEventListener("click", e => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = this.pieces.length - 1; i >= 0; i--) {
        const piece = this.pieces[i];
        const w = piece.img.naturalWidth || 100; // fallback size
        const h = piece.img.naturalHeight || 100;

        // 因為有旋轉，這裡先用簡單的包圍盒判斷
        if (
          x >= piece.x &&
          x <= piece.x + w &&
          y >= piece.y &&
          y <= piece.y + h
        ) {
          const audio = this.audioElements[piece.audio];
          if (audio) {
            audio.currentTime = 0;
            audio.play();
          }
          break;
        }
      }
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const piece of this.pieces) {
      this.ctx.save();
      this.ctx.translate(piece.x, piece.y);
      this.ctx.rotate((piece.rotation * Math.PI) / 180);
      if (piece.img.complete) {
        this.ctx.drawImage(piece.img, 0, 0);
      }
      this.ctx.restore();
    }
    requestAnimationFrame(() => this.render());
  }
}

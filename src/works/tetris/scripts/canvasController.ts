import { bigBlockBox, blockSize, fieldColor, fieldHeight, fieldWidth} from "./globalData";
import { shapes } from "./shapes";



// ブロック生成
export const genBlock = function(canvas: HTMLCanvasElement, posX: number, posY: number, color: string) {
    const cfield = canvas.getContext("2d")!
  cfield.fillStyle = color;
  cfield.beginPath();
  cfield.rect(posX * blockSize, posY * blockSize, blockSize, blockSize);
  cfield.closePath();
  cfield.fill();
  if (color != fieldColor) {
    cfield.lineWidth = 1;
    cfield.strokeStyle = fieldColor;
    cfield.stroke();
  }
};

// 枠付きブロック描画
export const genStrokedBlock = function(canvas: HTMLCanvasElement, posX: number, posY: number, color: string, strokeColor: string) {
  const cfield = canvas.getContext("2d")!
  cfield.fillStyle = color;
  cfield.beginPath();
  cfield.rect(posX, posY, blockSize, blockSize);
  cfield.closePath();
  cfield.fill();
  cfield.lineWidth = 1;
  cfield.strokeStyle = strokeColor;
  cfield.stroke();
}

// 次のブロックエリアクリア
var clearNext = function(cnext: CanvasRenderingContext2D) {
  cnext.fillStyle = fieldColor;
  cnext.beginPath();
  cnext.rect(0, 0, (blockSize * 5), (blockSize * 5));
  cnext.closePath();
  cnext.fill();
}
// 次のブロック描画
var genNextBlock = function(cnext:CanvasRenderingContext2D, posX:number, posY:number, color:string, scale: number = 1) {
  cnext.fillStyle = color;
  cnext.beginPath();
  cnext.rect(posX * scale, posY * scale, blockSize * scale, blockSize * scale);
  cnext.closePath();
  cnext.fill();
  cnext.lineWidth = 1;
  cnext.strokeStyle = fieldColor;
  cnext.stroke();
};
// 次のブロック生成
export const drawNext = function(canvases: HTMLCanvasElement[], nextShape: number[], scale : (n: number) => number = () => 1) {
  for(let i = 0; i < canvases.length; i++){
    if(!canvases[i]) continue;
  const canvas2d = canvases[i].getContext("2d")!
  clearNext(canvas2d);
    if(nextShape[i] == -1 || nextShape[i] === undefined) continue
    
  
  const centerXtemp = shapes[nextShape[i]]["rot0"].map(e => e[0])
  const offsetW = (bigBlockBox - (Math.max(...centerXtemp) - Math.min(...centerXtemp) + 1) * blockSize) / 2;

    const centerYtemp = shapes[nextShape[i]]["rot0"].map(e => e[1])
  const offsetH = (bigBlockBox - (Math.max(...centerYtemp) - Math.min(...centerYtemp) + 1) * blockSize) / 2;
  for (let j=0; j<shapes[nextShape[i]]["rot0"].length; j++) {
    genNextBlock(
      canvas2d,
      offsetW + (shapes[nextShape[i]]["rot0"][j][0] - Math.min(...centerXtemp)) * blockSize,
      offsetH + (shapes[nextShape[i]]["rot0"][j][1] - Math.min(...centerYtemp)) * blockSize,
      shapes[nextShape[i]]["color"],
      scale(i)
    );
  }
  }
}

// ゲームオーバー
export const gameOver = function(cfield: CanvasRenderingContext2D, score: number) {
  cfield.font = "bold 16px Arial";
  cfield.textAlign = "center";
  cfield.fillStyle = "rgba(0,0,0, 0.85)";
  cfield.beginPath();
  cfield.rect(0, 0, fieldWidth, fieldHeight);
  cfield.closePath();
  cfield.fill();
  cfield.fillStyle = "#b30000";
  cfield.fillText("ゲームオーバー！", (fieldWidth/2), (fieldHeight/2)-70);
  cfield.font = "17px Arial";
  cfield.fillStyle = "#f8f5c5";
  cfield.fillText(new Intl.NumberFormat().format(score)+" 点", (fieldWidth/2), (fieldHeight/2)+40);
}

// ポーズ画面
export const gamePause = function(cfield: CanvasRenderingContext2D) {
  cfield.font = "bold 16px Arial";
  cfield.textAlign = "center";
  cfield.fillStyle = "rgba(0,0,0, 0.85)";
  cfield.beginPath();
  cfield.rect(0, 0, fieldWidth, fieldHeight);
  cfield.closePath();
  cfield.fill();
  cfield.fillStyle = "#fa5300";
  cfield.fillText("ポーズ中", (fieldWidth/2), (fieldHeight/2));
}
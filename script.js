function setup() {
  createCanvas(800, 800);
  vars=4;//変数の数
  makeTables();
  mouseState="up";
}


function makeTables(){
  bitState = new Array(1<<vars);//そのときの状態(0or1)
  for(var i=0;i<bitState.length;i++){
    bitState[i]=0;
  }
  table = new Array((1<<vars)+1);
  //allowToWrite = new Array((1<<vars)+1);
  for(var i=0;i<table.length;i++){
    table[i] = new Array(vars+1);
    for(var j=0;j<vars+1;j++){
      if(i==0){
        table[i][j]="N"+str(j);
        if(j==vars)table[i][j]="A";
      }else{
        if(j<vars)table[i][j]=((i-1)&(1<<(vars-1-j)))?"1":"0";
      }
    }
  }
  //vars=4のときのみ使える
  idX=[0b00,0b01,0b11,0b10];
  idY=[0b00,0b01,0b11,0b10];
  //使い方 T[x][y]=bitState[idX[x]|idY[y]<<2]
}

function drawTable(Arr,sx,sy,wid,hei){
  var cx=Arr[0].length;
  var cy=Arr.length;
  var dx=wid/cx;
  var dy=hei/cy;
  for(var h=0;h<cy;h++){
    for(var w=0;w<cx;w++){
      noFill();
      strokeWeight(1);
      stroke(0);
      rect(sx+dx*w,sy+dy*h,dx,dy);
      fill(0);
      noStroke(0);
      textSize(20);
      textAlign(CENTER,CENTER);
      text(str(Arr[h][w]), sx+dx*w+dx/2,sy+dy*h+dy/2);
    }
  }
}

function isInRect(sx,sy,dx,dy,ax,ay){
  return (sx<=ax&&ax<=sx+dx&&sy<=ay&&ay<=sy+dy);
}

function flipFlop(Arr,sx,sy,wid,hei){
  //ハードコーディングごめん
  var cx=Arr[0].length;
  var cy=Arr.length;
  var dx=wid/cx;
  var dy=hei/cy;
  for(var h=1;h<cy;h++){
    var w=cx-1;
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(sx+dx*w,sy+dy*h,dx,dy);
    if(mouseState=="down"&&isInRect(sx+dx*w,sy+dy*h,dx,dy,mouseX,mouseY)){
      bitState[h-1]=1-bitState[h-1];
    }
  }
}

function updateMouseState(){
  if(mouseIsPressed){
    if(mouseState=="up"){
      mouseState="down";
    }else{
      mouseState="pressed";
    }
  }else{
    mouseState="up";
  }
}

function draw() {
  clear();
  background(255);
  updateMouseState();
  var sx=10,sy=10,wid=200,hei=500;
  drawTable(table,sx,sy,wid,hei);
  flipFlop(table,sx,sy,wid,hei);
  for(var i=0;i<bitState.length;i++){
    table[i+1][vars]=str(bitState[i]);
  }
}


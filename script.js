function setup() {
  createCanvas(800, 800);
  vars=4;//変数の数
  makeTables();
  mouseState="up";
}

function toBin(n,k){//k桁0埋め2進数表示へ
  s=""
  for(var i=0;i<k;i++){
    s=(1<<i&n?"1":"0")+s;  
  }
  return s;
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
        if(j==0)table[i][j]="EN";
        if(j==1)table[i][j]="N2";
        if(j==2)table[i][j]="N1";
        if(j==3)table[i][j]="N0";
        if(j==4)table[i][j]="A";
      }else{
        if(j<vars)table[i][j]=((i-1)&(1<<(vars-1-j)))?"1":"0";
      }
    }
  }
  
  //これ以下vars=4のときのみ使えるコード
  idX=[0b00,0b01,0b11,0b10];
  idY=[0b00,0b01,0b11,0b10];
  Karnaugh = new Array(5);
  for(var i=0;i<Karnaugh.length;i++){
    Karnaugh[i] = new Array(5);
  }
  for(var i=1;i<Karnaugh.length;i++){
     Karnaugh[i][0]=toBin(idY[i-1],2);
  }
  for(var j=1;j<Karnaugh[0].length;j++){
    Karnaugh[0][j]=toBin(idX[j-1],2);
  }
  Karnaugh[0][0]="";
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
      if(Arr[h][w]=="1")fill(10,200,200);
      rect(sx+dx*w,sy+dy*h,dx,dy);
      fill(0);
      noStroke(0);
      textSize(min(dy-3,dx/str(Arr[h][w]).length-3));
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
  
  var sx=30,sy=30,wid=200,hei=500;
  drawTable(table,sx,sy,wid,hei);
  flipFlop(table,sx,sy,wid,hei);
  drawTable(Karnaugh,sx+300,sy,300,300);
  textSize(20);
  textAlign(LEFT,BOTTOM);
  text("クリックで変更",sx,sy);
  text(table[0][2]+" "+table[0][3]+"↓"+table[0][0]+" "+table[0][1]+"→",sx+300,sy);
  
  for(var i=0;i<bitState.length;i++){
    table[i+1][vars]=str(bitState[i]);
  }
  for(var h=0;h<4;h++){
    for(var w=0;w<4;w++){
      Karnaugh[h+1][w+1]=bitState[idX[w]<<2|idY[h]]
    }
  }
}

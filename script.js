function setup() {
  createCanvas(800, 800) 
  background(255);
  vars=4;//変数の数
  makeTables();
}


function makeTables(){
  bitState = new Array(1<<vars);//そのときの状態(0or1)
  for(var i=0;i<bitState.length;i++){
    bitState[i]=0;
  }
  table = new Array((1<<vars)+1);
  for(var i=0;i<table.length;i++){
    table[i] = new Array(vars+1);
    for(var j=0;j<vars+1;j++){
      if(i==0){
        table[i][j]="N"+str(j);
        if(j==vars)table[i][j]="A";
      }else{
        if(j<vars)table[i][j]=((i-1)&(1<<(vars-1-j)))?"1":"0";
        else table[i][j]=str(bitState[j]);
      }
    }
  }
}

function drawTable(Arr,sx,sy,wid,hei){
  var cx=Arr[0].length;
  var cy=Arr.length;
  var dx=wid/cx;
  var dy=hei/cy;
  for(var h=0;h<cy;h++){
    for(var w=0;w<cx;w++){
      noFill();
      stroke(0);
      rect(sx+dx*w,sy+dy*h,dx,dy);
      fill(0);
      textSize(20);
      textAlign(LEFT,TOP);
      text(str(Arr[h][w]), sx+dx*w,sy+dy*h);
    }
  }
}

function draw() {
  drawTable(table,10,10,140,600);
}


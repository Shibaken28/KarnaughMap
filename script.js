const EN = "EN";
const IN_0 = "IN_0";
const IN_1 = "IN_1";
const IN_2 = "IN_2";
const A = "A";

function setup() {
  createCanvas(1200, 900);
  vars=4;//変数の数
  time=0
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

function countBits(n,k){
  cnt=0;
  for(var i=0;i<k;i++){
    cnt+=(n&1<<i)?1:0;
  }
  return cnt;
}

function setTable(){
  table = new Array((1<<vars)+1);
  //allowToWrite = new Array((1<<vars)+1);
  for(var i=0;i<table.length;i++){
    table[i] = new Array(vars+1);
    for(var j=0;j<vars+1;j++){
      if(i==0){
        if(j==0)table[i][j] = EN;
        if(j==1)table[i][j] = IN_2;
        if(j==2)table[i][j] = IN_1;
        if(j==3)table[i][j] = IN_0;
        if(j==4)table[i][j] = A;
      }else{
        if(j<vars)table[i][j]=((i-1)&(1<<(vars-1-j)))?"1":"0";
      }
    }
  }
}

function makeTables(){
  result = new Array(0);
  bitState = new Array(1<<vars);//そのときの状態(0or1)
  for(var i=0;i<bitState.length;i++){
    bitState[i]=0;
  }
  setTable();
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

function getVarName(){
    for(var i=0;i<vars;i++){
        table[0][i]=document.getElementById("var"+str(i)).value;
        if(table[0][i] == ""){
            if(i==0)table[0][i] = EN;
            if(i==1)table[0][i] = IN_2;
            if(i==2)table[0][i] = IN_1;
            if(i==3)table[0][i] = IN_0;
            if(i==4)table[0][i] = A;
        }
    }
}


function setOutput(){
    output="\\begin{table}[H]\n"+
    "\\caption{caption}\n"+
    "\\label{label}\n"+
    "\\centering\n"+
    "\\begin{tabular}{|c|c|c|c|c|}\n"+
    "    \\hline\n"+
    "    \\diagbox{$"+table[0][2]+","+table[0][3]+"$}{$"+table[0][0]+","+table[0][1]+"$}&$00$&$01$&$11$&$10$\\\\ \\hline\n";
    for(var i=1;i<=vars;i++){
        for(var j=0;j<=vars;j++){
            if(j==0){
                output+="    $"+toBin(idY[i-1],2)+"$";
            }else{
                output+=" & $"+str(Karnaugh[i][j])+"$";
            }
        }
        output+=" \\\\ \\hline \n"
    }
    output+="\\end{tabular}\n"+
    "\\end{table}\n";

    document.getElementById("output").value=output;
}


function simplification(){
  var bitNum = new Array(vars+1);//出力=1であるiビット立ってる集合
  var uniquBits = new Set();//まとめたもの
  //countBits
  var i,j,k,l;
  for(i=0;i<=vars;i++){
    bitNum[i]=new Array(0);
  }
  for(i=0;i<bitState.length;i++){
    if(bitState[i]==1)bitNum[countBits(i,vars)].push(toBin(i,vars));
  }
  for(var t=0;t<=vars;t++){
    var used = new Set();
    for(i=0;i<bitNum.length;i++){
      var len=bitNum[i].length;
      var csd=i+1;
      for(j=0;j<len;j++){
        var find=false;
        if(i==bitNum.length-1){
          if(!used.has(bitNum[i][0]))uniquBits.add(bitNum[i][0]);
          bitNum[i].shift();
          continue;
        }
        for(k=0;k<bitNum[csd].length;k++){
          //i,0とi+1,xを比較
          var a=bitNum[i][0];
          var b=bitNum[csd][k];
          var dif=0;//違いの数
          var out="";
          for(l=0;l<min(a.length,b.length);l++){
            if(a.charAt(l)!=b.charAt(l)){
              dif++;
              out+="\\d{1}";
            }else{
              out+=a.charAt(l);
            }
          }
          if(dif==1){
            find=true;
            used.add(b);
            bitNum[i].push(out);
          }
        }
        if(!find&&!used.has(bitNum[i][0])){
          uniquBits.add(bitNum[i][0]);
        }
        bitNum[i].shift();
      }
    }
  }
  
  uniquArr = [...uniquBits];
  
  result = new Array(0);
  var num = uniquArr.length;
  for(i=0;i<(1<<num);i++){
    var ok=true;
    for(j=0;j<bitState.length;j++){
      if(bitState[j]==0)continue;//そもそも関係ない
      var match=false;
      for(k=0;k<num;k++){
        if(i&(1<<k)){
          var re = new RegExp(uniquArr[k]);
          if(toBin(j,vars).match(re)!=null){
            match=true;
          }
        }
      }
      if(!match)ok=false;
    }
    if(ok){
      result.push([]);
      for(k=0;k<num;k++){
        if(i&(1<<k)){
          result[result.length-1].push(uniquArr[k].replace(/\\d\{1\}/g, '*'));
        }
      }
    }
  }
}

function drawSimple(){
  fill(0);
  textSize(15);
  textAlign(LEFT,TOP);
  var sx=300,sy=400;
  text("簡略化の候補(β)",sx,sy);
  for(var i=0;i<result.length;i++){
    output=table[0][vars]+" = ";
    for(var j=0;j<result[i].length;j++){
      for(var k=0;k<vars;k++){
        var c=result[i][j].charAt(k);
        if(c=="1"){
          output+=table[0][k]+" ";
        }else if(c=="0"){
          output+="!"+table[0][k]+" ";
        }
      }
      if(j<result[i].length-1)output+="+";
    }
    sy+=20;
    text(output,sx,sy);
  }
}

function draw() {
  clear();
  background(255);
  updateMouseState();
  getVarName();
  setOutput();
  drawSimple();
  var sx=30,sy=30,wid=200,hei=500;
  drawTable(table,sx,sy,wid,hei);
  flipFlop(table,sx,sy,wid,hei);
  drawTable(Karnaugh,sx+300,sy,300,300);
  textSize(20);
  textAlign(LEFT,BOTTOM);
  text("クリックで変更",sx,sy-5);
  text(table[0][2]+" "+table[0][3]+"↓"+table[0][0]+" "+table[0][1]+"→",sx+300,sy-5);
  
  for(var i=0;i<bitState.length;i++){
    table[i+1][vars]=str(bitState[i]);
  }
  for(var h=0;h<4;h++){
    for(var w=0;w<4;w++){
      Karnaugh[h+1][w+1]=bitState[idX[w]<<2|idY[h]]
    }
  }
  time++;
  if(time%60==0){
    time=1;
    simplification();
  }
}

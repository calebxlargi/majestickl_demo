import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import './style.css';
import {t,setLanguage,translatePage} from './i18n.js';
import {LAYOUT_CONTROLS,createLayoutSettings,normalizeSetting,tablePositions} from './layout-settings.js';
import {confineInteriorCamera} from './camera-bounds.js';
const canvas=document.querySelector('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;
const scene=new THREE.Scene();scene.background=new THREE.Color('#d9d3c5');
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.4;
const camera=new THREE.PerspectiveCamera(61,innerWidth/innerHeight,.1,180);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.055;controls.minDistance=2;controls.maxDistance=57;controls.maxPolarAngle=Math.PI*.49;controls.target.set(-1,2,-4);
const architecture=new THREE.Group();scene.add(architecture);const ceiling=new THREE.Group();architecture.add(ceiling);const furniture=new THREE.Group();scene.add(furniture);
const materialCache=new Map();const mat=(color,roughness=.7,metalness=0)=>{const key=`${color}/${roughness}/${metalness}`;if(!materialCache.has(key))materialCache.set(key,new THREE.MeshStandardMaterial({color,roughness,metalness}));return materialCache.get(key)};
const cream=mat('#d8cdb9'),trim=mat('#dfcda1',.45),gold=mat('#b2924e',.28,.65),red=mat('#b3a486'),wood=mat('#4f3425',.6),black=mat('#15191b'),linen=mat('#f5eee0',.92),seat=mat('#292b30',.95),steel=mat('#bba978',.3,.8),glass=new THREE.MeshPhysicalMaterial({color:'#e5ddbe',roughness:.08,metalness:.15,transparent:true,opacity:.42,transmission:.2});
const crystalLight=new THREE.MeshStandardMaterial({color:'#fff9e8',emissive:'#fff0ce',emissiveIntensity:.65,roughness:.35});
const crystal=new THREE.MeshPhysicalMaterial({color:'#f6f3e9',roughness:.12,metalness:.12,transparent:true,opacity:.8,transmission:.12,emissive:'#fff0d0',emissiveIntensity:.28});
const glow=new THREE.MeshStandardMaterial({color:'#ffeac0',emissive:'#ffca6a',emissiveIntensity:2.4});
function box(w,h,d,m,x=0,y=0,z=0,parent=architecture){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function cyl(rt,rb,h,m,x,y,z,parent=furniture,n=24){let o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function ball(r,m,x,y,z,parent){const o=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),m);o.position.set(x,y,z);parent.add(o);return o;}
// A repeating woven carpet with curling gold botanical motifs.
function carpetTexture(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');g.fillStyle='#28213e';g.fillRect(0,0,1024,1024);
 let seed=71;const rand=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
 // Large interlocking botanical scrolls, with gold foliage and plum flower heads.
 for(let row=-1;row<4;row++)for(let col=-1;col<4;col++){
  g.save();g.translate(col*390+(row%2)*195,row*390);g.rotate((row+col)*.7);
  for(let branch=0;branch<3;branch++){
   g.save();g.rotate(branch*Math.PI*2/3);g.strokeStyle='#b7a04c';g.lineWidth=4;g.beginPath();
   for(let k=0;k<130;k++){const a=k*.058,r=8+k*1.12,x=Math.cos(a)*r,y=Math.sin(a)*r;if(k===0)g.moveTo(x,y);else g.lineTo(x,y)}g.stroke();
   for(let k=0;k<13;k++){const a=k*.48,r=28+k*8,x=Math.cos(a)*r,y=Math.sin(a)*r;g.save();g.translate(x,y);g.rotate(a+.7);g.fillStyle=k%3?'#ad9648':'#756b39';g.beginPath();g.moveTo(0,0);g.bezierCurveTo(-6,-29,30,-42,40,-47);g.bezierCurveTo(33,-10,13,2,0,0);g.fill();g.restore()}
   g.restore();
  }
  g.strokeStyle='#a04c73';g.lineWidth=5;
  for(let ring=0;ring<5;ring++){g.beginPath();for(let k=0;k<=140;k++){const a=k/140*Math.PI*2,r=22+ring*10+Math.sin(a*9)*6;const x=170+Math.cos(a)*r,y=85+Math.sin(a)*r;if(k===0)g.moveTo(x,y);else g.lineTo(x,y)}g.stroke()}
  g.restore();
 }
 for(let i=0;i<150000;i++){g.fillStyle=rand()>.5?'rgba(236,214,155,.08)':'rgba(4,0,19,.12)';g.fillRect(rand()*1024,rand()*1024,1.2,1.2)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5.2,4.4);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const carpet=carpetTexture();const floorMat=new THREE.MeshStandardMaterial({map:carpet,roughness:1,bumpMap:carpet,bumpScale:.018});box(42.5,.14,35.9,floorMat,0,-.07,0);
// Marriott metric envelope. Door, stage, coffer and chandelier positions are photo-based approximations.
const marbleCanvas=document.createElement('canvas');marbleCanvas.width=marbleCanvas.height=512;
const mg=marbleCanvas.getContext('2d');mg.fillStyle='#29272b';mg.fillRect(0,0,512,512);
// Fine branching pale veins on charcoal marble, rather than evenly spaced stripes.
let marbleSeed=113;const marbleRandom=()=>{marbleSeed=marbleSeed*16807%2147483647;return(marbleSeed-1)/2147483646};
mg.fillStyle='#161719';mg.fillRect(0,0,512,512);
for(let i=0;i<26;i++){
 let x=marbleRandom()*650-70,y=-30;
 mg.strokeStyle=i%4?'rgba(201,198,188,.28)':'rgba(235,231,217,.65)';mg.lineWidth=i%4?.65:1.7;mg.beginPath();mg.moveTo(x,y);
 while(y<540){x+=(marbleRandom()-.47)*68;y+=12+marbleRandom()*25;mg.lineTo(x,y);if(marbleRandom()>.75){mg.moveTo(x,y);mg.lineTo(x+25+marbleRandom()*40,y-15);mg.moveTo(x,y)}}mg.stroke();
}
const marbleTex=new THREE.CanvasTexture(marbleCanvas);marbleTex.colorSpace=THREE.SRGBColorSpace;const marble=new THREE.MeshStandardMaterial({map:marbleTex,roughness:.23,metalness:.08});
box(.24,6,35.9,cream,-21.37,3,0);box(.24,6,35.9,cream,21.37,3,0);
box(42.5,6,.24,cream,0,3,-18.07);box(42.5,6,.24,cream,0,3,18.07);
for(const side of [-1,1]){
 for(let z=-15;z<=15;z+=5){
  box(.22,4.7,3.9,wood,side*21.14,2.65,z);
  for(const dz of [-1.88,1.88])box(.3,4.95,.14,trim,side*20.99,2.7,z+dz);
  box(.28,.17,4.05,trim,side*20.98,5.15,z);
  for(const dz of [-.82,.82]){box(.25,4.2,1.5,gold,side*20.96,2.6,z+dz);box(.27,3.75,1.12,wood,side*20.8,2.6,z+dz)}
  box(.8,5.35,1.02,marble,side*20.94,2.75,z+2.5);
  box(.88,.22,1.18,trim,side*20.9,.16,z+2.5);
  box(.94,.23,1.22,trim,side*20.9,5.54,z+2.5);
  wallSconce(side*20.47,3.05,z+2.5,side);
 }
 box(.3,.2,35.9,wood,side*21.02,.1,0);box(.55,.2,35.9,trim,side*20.98,5.75,0);
}
for(const z of [-17.87,17.87])for(const x of [-18,-14,-10,10,14,18]){
 box(2.9,4.55,.18,gold,x,2.55,z);box(2.4,4,.22,wood,x,2.55,z);
 for(const dx of [-1.65,1.65])box(.5,5.5,.45,marble,x+dx,2.75,z);
 box(3.5,.18,.38,trim,x,5.2,z);
}
// Crystal wall lanterns project from the marble piers.
function wallSconce(x,y,z,side){
 box(.13,1.36,.3,gold,x,y,z);box(.21,1.2,.34,crystalLight,x-side*.07,y,z);
 for(let i=0;i<7;i++)box(.13,1.23,.025,crystal,x-side*.19,y,z-.16+i*.053);
 for(const dy of [-.67,.67])box(.28,.045,.4,gold,x-side*.07,y+dy,z);
}
// Warm bronze recessed panels, broad ivory mouldings and restrained metal accents.
box(42.5,.14,35.9,cream,0,6.07,0,ceiling);
const ceilingBronze=mat('#625239',.77),ceilingIvory=mat('#bfb5a1',.65);
for(let ix=0;ix<5;ix++)for(let iz=0;iz<5;iz++){
 const x=-17+ix*8.5,z=-14+iz*7;
 box(8.2,.10,6.7,wood,x,5.98,z,ceiling);box(7.92,.12,6.42,ceilingIvory,x,5.89,z,ceiling);
 box(7.52,.07,6.02,trim,x,5.81,z,ceiling);box(7.22,.06,5.72,ceilingBronze,x,5.77,z,ceiling);
 for(const side of [-1,1]){box(8.45,.24,.24,ceilingIvory,x,5.66,z+side*3.45,ceiling);box(.26,.24,6.95,ceilingIvory,x+side*4.16,5.66,z,ceiling)}
}
// Square waterfall fixtures: four dense crystal curtains step inward to a flat square base.
// Sizes and spacing are photograph-based, not surveyed fixture measurements.
const crystalMatrices=[];const prismGeometry=new THREE.CylinderGeometry(.035,.025,1,4,1);prismGeometry.rotateY(Math.PI/4);
function crystalDrop(x,y,z,height){const dummy=new THREE.Object3D();dummy.position.set(x,y,z);dummy.scale.set(1,height,1);dummy.updateMatrix();crystalMatrices.push(dummy.matrix.clone())}
function chandelier(x,z,size){
 const top=5.62,step=size>.9?.24:.17;
 box(size*2,.065,size*1.76,gold,x,top,z,ceiling);
 for(let tier=0;tier<4;tier++){
  const w=size*2*(1-tier*.17),d=w*.88,y=top-.07-tier*step;
  box(w,.045,d,crystalLight,x,y,z,ceiling);
  const nx=Math.ceil(w/.075),nz=Math.ceil(d/.075),h=step+.07;
  for(let k=0;k<=nx;k++)for(const side of [-1,1])crystalDrop(x-w/2+k*w/nx,y-h/2,z+side*d/2,h);
  for(let k=1;k<nz;k++)for(const side of [-1,1])crystalDrop(x+side*w/2,y-h/2,z-d/2+k*d/nz,h);
 }
 const base=size*.98;box(base,.035,base*.88,crystalLight,x,top-.07-4*step,z,ceiling);
 for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++)crystalDrop(x+i*base/7,top-.13-4*step,z+j*base*.88/7,.12);
}
const ceilingLights=[];
for(const z of [-13,-6.5,0,6.5,13])for(const x of [-17,-8.5,0,8.5,17]){
 chandelier(x,z,x===0?1.65:.67);
 const light=new THREE.PointLight('#fff1d5',x===0?25:9,12,2);light.position.set(x,4.7,z);scene.add(light);ceilingLights.push(light);
}
const crystalMesh=new THREE.InstancedMesh(prismGeometry,crystal,crystalMatrices.length);crystalMatrices.forEach((m,i)=>crystalMesh.setMatrixAt(i,m));ceiling.add(crystalMesh);
const hemi=new THREE.HemisphereLight('#f5eddf','#655a60',.65);scene.add(hemi);
const key=new THREE.DirectionalLight('#ffe8c6',1.2);key.position.set(-4,6,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-23,right:23,top:20,bottom:-20,near:.5,far:60});key.shadow.bias=-.00025;key.shadow.normalBias=.04;scene.add(key);
const suppliedLogo=new Image();suppliedLogo.src='/assets/majestic-logo-transparent.png';
function screenTexture(){
 const c=document.createElement('canvas');c.width=2428;c.height=500;const g=c.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,2428,500);
 if(suppliedLogo.complete&&suppliedLogo.naturalWidth){const h=380,w=h*suppliedLogo.naturalWidth/suppliedLogo.naturalHeight;g.drawImage(suppliedLogo,(2428-w)/2,60,w,h)}
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
suppliedLogo.onload=()=>{const old=screenMat.map;screenMat.map=screenTexture();old.dispose();screenMat.needsUpdate=true};
const screenMat=new THREE.MeshBasicMaterial({map:screenTexture()});function led(x,z,w,rot){const group=new THREE.Group();group.position.set(x,0,z);group.rotation.y=rot;architecture.add(group);box(w+.18,2.95,.16,black,0,3.2,0,group);box(w,2.78,.02,screenMat,0,3.2,.10,group);box(w+.3,.5,.4,black,0,1.45,0,group)}led(0,-17.62,13.5,0);
// A shared, carefully modelled banquet chair. Instances keep large layouts responsive.
const chairParts=[];function chairPart(geo,m,x,y,z,rx=0){chairParts.push({geo,m,x,y,z,rx})}
chairPart(new THREE.BoxGeometry(.48,.11,.48),seat,0,.48,0);const backShape=new THREE.Shape();backShape.moveTo(-.235,0);backShape.lineTo(.235,0);backShape.lineTo(.235,.37);backShape.quadraticCurveTo(.235,.61,0,.61);backShape.quadraticCurveTo(-.235,.61,-.235,.37);backShape.closePath();const backGeo=new THREE.ExtrudeGeometry(backShape,{depth:.07,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015});chairPart(backGeo,seat,0,.55,.205,-.055);for(const x of [-.205,.205])for(const z of [-.2,.2])chairPart(new THREE.CylinderGeometry(.018,.013,.46,7),steel,x,.23,z);chairPart(new THREE.TorusGeometry(.22,.018,6,18,Math.PI),steel,0,1.07,.225);
let chairs=[];function chair(x,z,rotation=0){chairs.push({x,z,rotation})}
function populateChairs(){for(const p of chairParts){const mesh=new THREE.InstancedMesh(p.geo,p.m,chairs.length);const dummy=new THREE.Object3D(),local=new THREE.Matrix4(),base=new THREE.Matrix4();dummy.position.set(p.x,p.y,p.z);dummy.rotation.x=p.rx;dummy.updateMatrix();local.copy(dummy.matrix);chairs.forEach((c,i)=>{dummy.position.set(c.x,0,c.z);dummy.rotation.set(0,c.rotation,0);dummy.updateMatrix();base.multiplyMatrices(dummy.matrix,local);mesh.setMatrixAt(i,base)});mesh.castShadow=true;mesh.receiveShadow=true;furniture.add(mesh)}}
function stage(){box(15,.55,4,black,0,.275,-15.5,furniture);box(15.1,.035,4.1,linen,0,.57,-15.5,furniture);for(let i=0;i<3;i++)box(2.8,.18*(i+1),.5,black,0,.09*(i+1),-12.55-i*.45,furniture);box(.7,1.05,.55,wood,-5,1.08,-14.8,furniture);box(.86,.08,.65,gold,-5,1.65,-14.8,furniture);for(const x of [-8.1,8.1])box(.65,1.6,.6,black,x,.8,-16,furniture)}
function roundTable(x,z,settings=true,chairCount=8){cyl(.98,.98,.07,linen,x,.76,z);const skirtGeo=new THREE.CylinderGeometry(.965,.99,.71,96,1,true);const v=skirtGeo.attributes.position;for(let i=0;i<v.count;i++){const a=Math.atan2(v.getZ(i),v.getX(i)),r=1+.016*Math.cos(a*48);v.setX(i,v.getX(i)*r);v.setZ(i,v.getZ(i)*r)}skirtGeo.computeVertexNormals();const skirt=new THREE.Mesh(skirtGeo,linen);skirt.position.set(x,.405,z);skirt.castShadow=true;skirt.receiveShadow=true;furniture.add(skirt);const rim=new THREE.Mesh(new THREE.TorusGeometry(.975,.016,6,48),linen);rim.rotation.x=Math.PI/2;rim.position.set(x,.8,z);furniture.add(rim);for(let k=0;k<chairCount;k++){const a=k/chairCount*Math.PI*2;chair(x+Math.sin(a)*1.37,z+Math.cos(a)*1.37,a);if(settings){let px=x+Math.sin(a)*.73,pz=z+Math.cos(a)*.73;cyl(.14,.14,.016,trim,px,.81,pz);cyl(.115,.115,.02,linen,px,.825,pz);cyl(.035,.022,.12,glass,px+.13,.87,pz+.13, furniture,10);box(.13,.015,.17,mat('#bc9458'),px,.84,pz,furniture)}}cyl(.16,.11,.25,gold,x,.92,z);for(let k=0;k<10;k++){let a=k*2.4;ball(.09,linen,x+Math.sin(a)*.21,1.09+(k%3)*.06,z+Math.cos(a)*.21,furniture)} }
const layouts={banquet:{name:'Banquet',copy:'Round tables, thoughtful details and room to celebrate.'},conference:{name:'Conference',copy:'Classroom tables with clear sightlines to the stage and screens.'},theatre:{name:'Theatre',copy:'An audience-focused setting with generous central and side aisles.'},buffet:{name:'Buffet',copy:'A relaxed dining setting with buffet stations and open serving routes.'}};let currentLayout='banquet';
const layoutSettings=createLayoutSettings();
function clearLayout(){for(const o of [...furniture.children]){furniture.remove(o);if(o.isInstancedMesh)o.dispose();else o.geometry?.dispose()}chairs=[];}
function buffetStation(x,z){box(3.8,.78,1.1,linen,x,.39,z,furniture);box(3.9,.06,1.15,trim,x,.81,z,furniture);for(let k=-1;k<=1;k++){box(.7,.08,.48,steel,x+k,.89,z,furniture);const lid=new THREE.Mesh(new THREE.SphereGeometry(.35,16,8,0,Math.PI*2,0,Math.PI/2),steel);lid.scale.z=.65;lid.scale.y=.45;lid.position.set(x+k,.93,z);furniture.add(lid);ball(.045,gold,x+k,1.12,z,furniture)}box(2.7,.015,.04,gold,x,.88,z+.48,furniture)}
function conferenceTable(x,z,count){box(2.7,.08,.65,linen,x,.76,z,furniture);box(2.7,.62,.045,linen,x,.4,z-.3,furniture);for(const dx of [-1.1,1.1])box(.045,.72,.5,steel,x+dx,.36,z,furniture);for(let k=0;k<count;k++){const dx=(k-(count-1)/2)*.85;chair(x+dx,z+.7,0);box(.2,.015,.28,mat('#f6f3e8'),x+dx,.81,z,furniture);cyl(.025,.025,.16,glass,x+dx+.3,.86,z)}}
function buildLayout(type){
  clearLayout();currentLayout=type;stage();const settings=layoutSettings[type];
  if(type==='banquet'||type==='buffet'){
    for(const {x,z} of tablePositions(settings.tables,9,4,3.85,-9.5))roundTable(x,z,true,settings.chairs);
    if(type==='buffet')for(let i=0;i<settings.stations;i++)buffetStation((i-(settings.stations-1)/2)*7,14.9);
  }else if(type==='theatre'){
    for(let r=0;r<settings.rows;r++)for(let k=0;k<settings.chairs;k++){
      const middle=(settings.chairs-1)/2;let x=(k-middle)*.69+(k<middle?-.65:.65);chair(x,-10+r*.95,0);
    }
  }else{
    for(const {x,z} of tablePositions(settings.tables,10,3.6,2.15,-10))conferenceTable(x,z,settings.chairs);
  }
  populateChairs();document.querySelector('#guests').textContent=chairs.length;document.querySelector('#published-capacity').textContent=t('Marriott capacity')+': '+({banquet:'1,250',theatre:'1,500',conference:'1,150',buffet:'—'}[type]);
  document.querySelector('#layout-name').textContent=type.toUpperCase()+' SETTING';document.querySelector('#layout-copy').textContent=layouts[type].copy;
  document.querySelectorAll('[data-layout]').forEach(b=>b.classList.toggle('active',b.dataset.layout===type));translatePage();
}
function renderAdjustmentControls(){
  const holder=document.querySelector('#adjustment-fields');holder.replaceChildren();
  for(const field of LAYOUT_CONTROLS[currentLayout]){
    const row=document.createElement('div');row.className='adjustment-row';
    const label=document.createElement('label');label.textContent=field.label;label.htmlFor=`${field.key}-number`;
    const number=document.createElement('input');number.type='number';number.id=`${field.key}-number`;number.setAttribute('aria-label',field.label);number.inputMode='numeric';
    const range=document.createElement('input');range.type='range';range.id=`${field.key}-range`;range.setAttribute('aria-label',field.label+' slider');
    for(const input of [range,number]){input.min=field.min;input.max=field.max;input.step=1;input.value=layoutSettings[currentLayout][field.key]}
    const bounds=document.createElement('div');bounds.className='range-bounds';bounds.textContent=`${field.min}–${field.max}`;
    function update(value){const next=normalizeSetting(currentLayout,field.key,value);layoutSettings[currentLayout][field.key]=next;number.value=range.value=next;scheduleLayoutUpdate()}
    range.addEventListener('input',()=>update(range.value));number.addEventListener('input',()=>{if(number.value!==''&&number.validity.valid)update(number.value)});
    number.addEventListener('change',()=>update(number.value===''?layoutSettings[currentLayout][field.key]:number.value));
    row.append(label,number,range,bounds);holder.append(row);
  }
  translatePage();
}
let layoutFrame=null;
function scheduleLayoutUpdate(){if(layoutFrame!==null)cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(()=>{layoutFrame=null;buildLayout(currentLayout)})}
const controlToggle=document.querySelector('#toggle-controls');
function toggleMobileControls(open){document.querySelector('#app').classList.toggle('controls-open',open);controlToggle.setAttribute('aria-expanded',String(open));controlToggle.querySelector('span').textContent=t(open?'Done · Back to 3D':'Adjust layout');}
controlToggle.onclick=()=>toggleMobileControls(controlToggle.getAttribute('aria-expanded')!=='true');
document.addEventListener('keydown',event=>{if(event.key==='Escape')toggleMobileControls(false)});
document.querySelector('#restore-layout').onclick=()=>{layoutSettings[currentLayout]=createLayoutSettings()[currentLayout];renderAdjustmentControls();buildLayout(currentLayout)};
let activeView='interior',tween=null;const views={interior:{pos:[-12,3.1,14.8],target:[0,2.6,-8]},stage:{pos:[0,2.5,-12.8],target:[0,2.3,9]},rear:{pos:[-18.5,4.6,15.8],target:[0,2.3,-5]},overhead:{pos:[0,51,.1],target:[0,0,0]}};
function setView(name,instant=false){activeView=name;const v=views[name];ceiling.visible=name!=='overhead';architecture.children.filter(o=>o!==ceiling&&o.isMesh&&o.geometry.parameters?.height>=5.5).forEach(o=>o.visible=name!=='overhead');controls.enableRotate=name!=='overhead';controls.enablePan=name!=='overhead';controls.minDistance=name==='overhead'?32:2;controls.maxDistance=name==='overhead'?57:45;if(name!=='overhead')confineInteriorCamera(camera.position,controls.target);if(instant){camera.position.fromArray(v.pos);controls.target.fromArray(v.target)}else tween={start:performance.now(),from:camera.position.clone(),to:new THREE.Vector3(...v.pos),fromTarget:controls.target.clone(),toTarget:new THREE.Vector3(...v.target)};document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));document.querySelector('#view-label').textContent='THE BALLROOM · '+({interior:'INTERIOR VIEW',stage:'FROM THE STAGE',rear:'WIDE ANGLE',overhead:'FLOOR PLAN'}[name]);translatePage();}
document.querySelectorAll('[data-layout]').forEach(b=>b.addEventListener('click',()=>{if(layoutFrame!==null){cancelAnimationFrame(layoutFrame);layoutFrame=null}buildLayout(b.dataset.layout);renderAdjustmentControls()}));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));document.querySelector('#reset').onclick=()=>setView(activeView);document.querySelector('#evening').onchange=e=>{const evening=e.target.checked;renderer.toneMappingExposure=evening?.92:1.15;hemi.intensity=evening?.65:1.1;glow.emissiveIntensity=evening?2.4:1.1;crystalLight.emissiveIntensity=evening?.65:.35;ceilingLights.forEach(l=>l.intensity=(Math.abs(l.position.x)<1?25:9)*(evening?1:.75))};
function toast(message){const e=document.querySelector('#toast');e.textContent=t(message);e.style.opacity=1;setTimeout(()=>e.style.opacity=0,2500)}
document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('Fullscreen is unavailable in this browser.')}};document.querySelector('#capture').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download=`Majestic-KL-Ballroom-${currentLayout}.png`;a.href=canvas.toDataURL('image/png');a.click();toast('Your ballroom view has been saved.')};document.querySelector('#reference').onclick=()=>document.querySelector('dialog').showModal();document.querySelector('#close-dialog').onclick=()=>document.querySelector('dialog').close();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});controls.addEventListener('start',()=>tween=null);buildLayout('banquet');renderAdjustmentControls();setView('interior',true);
let frameCount=0;renderer.setAnimationLoop(()=>{if(tween){let t=Math.min((performance.now()-tween.start)/1100,1);t=t*t*(3-2*t);camera.position.lerpVectors(tween.from,tween.to,t);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,t);if(t>=1)tween=null}controls.update();if(activeView!=='overhead')confineInteriorCamera(camera.position,controls.target);renderer.render(scene,camera);if(++frameCount===3){document.querySelector('#loading').style.opacity=0;setTimeout(()=>document.querySelector('#loading').remove(),700)}});
window.__venue={get layout(){return currentLayout},get seats(){return chairs.length},get view(){return activeView},screens:1};

document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{setLanguage(button.dataset.language);translatePage();document.querySelector('#published-capacity').textContent=t('Marriott capacity')+': '+({banquet:'1,250',theatre:'1,500',conference:'1,150',buffet:'—'}[currentLayout]);renderAdjustmentControls();const old=screenMat.map;screenMat.map=screenTexture();old.dispose();screenMat.needsUpdate=true}));translatePage();

import*as t from"three";import e from"lil-gui";import{OrbitControls as s}from"three/examples/jsm/controls/OrbitControls.js";import n from"@dimforge/rapier3d-compat";class i{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}static now(){return("undefined"==typeof performance?Date:performance).now()}start(){this.startTime=i.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=i.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}var o;!function(t){t.startAnimate=function(t){const e="function"==typeof t?t:t.update.bind(t);let s=i.now();requestAnimationFrame((function t(n){let o=(n=n||i.now())-s;s=n,e(o),requestAnimationFrame(t)}))},t.startTimer=function(t,e){const s="function"==typeof t?t:t.update.bind(t);setInterval(s,e,e)}}(o||(o={}));var r,a=o;class c{[Symbol.iterator](){return this}next(){return{done:!0,value:void 0}}}class h{constructor(t){this.ops=[],this.core=t}pushOp(t,...e){this.ops.push([t,e])}flushOps(){const t=this.core;this.ops.forEach((([e,s])=>{(e=e.bind(t))(...s)})),this.ops=[]}update(t){this.flushOps()}}class d{}class l{constructor(t,e){this.world=t,this.id=e}get body(){return this.world.getEntityBody(this.id)}dispose(){this.world.deleteEntity(this.id)}}class m{constructor(t,e){this.indx=t,this.comps=e}get(t){const e=this.indx.get(t);return this.comps[e]}has(...t){for(const e of t)if(!this.indx.has(e))return!1;return!0}}!function(t){t.demands=function(...t){return new Set(t)}}(r||(r={}));class u{constructor(...t){this.opQueue=new h(this),this.entities=new p,this.systems=t}createEntity(...t){this.opQueue.pushOp(this.createEntitySync,...t)}createEntitySync(...t){this.entities.newEntity(...t)}deleteEntity(t){this.opQueue.pushOp(this.deleteEntitySync,t)}deleteEntitySync(t){this.entities.deleteByID(t)}cleanEntities(){this.opQueue.pushOp(this.cleanEntitiesSync)}cleanEntitiesSync(){this.entities.cleanAll()}getEntityBody(t){return this.entities.getBodyByID(t)}update(t){this.opQueue.update(t);const e=this.entities;this.systems.forEach((s=>{const n=new w(this,s.demands,e.iterateBatches());s.invoke(t,n)}))}}class p{constructor(){this.batches=new Map,this.id2Batch=new Map,this.ids=function(){let t=1;return()=>t++}()}newEntity(...t){const e=this.getEntityBatch(...t.map((t=>t.constructor))),s=e.constructEntity(...t);return this.id2Batch.set(s,e),s}getEntityBatch(...t){t.sort();const e=t.toString();let s=this.batches.get(e);if(void 0!==s)return s;const n=new Map;for(let e=0;e<t.length;e++)n.set(t[e],e);return s=new y(n,this.ids),this.batches.set(e,s),s}cleanAll(){this.batches=new Map,this.id2Batch=new Map}deleteByID(t){const e=this.id2Batch.get(t);void 0!==e&&(this.id2Batch.delete(t),e.removeEntity(t))}getBodyByID(t){const e=this.id2Batch.get(t);if(void 0===e)return;const s=e.getEntity(t);return new m(e.componentIndex,s)}iterateBatches(){return this.batches.values()}}class y{constructor(t,e){this.entities=new Map,this.componentIndex=t,this.newID=e}constructEntity(...t){const e=this.newID();return t.sort(((t,e)=>this.componentIndex.get(t.constructor)-this.componentIndex.get(e.constructor))),this.entities.set(e,t),e}removeEntity(t){this.entities.delete(t)}getEntity(t){return this.entities.get(t)}matchDemands(t){for(const e of t)if(!this.componentIndex.has(e))return!1;return!0}[Symbol.iterator](){return this.entries()}entries(){return this.entities.entries()}}class w{constructor(t,e,s){this.currIndx=new Map,this.currIter=new c,this.demands=e,this.world=t,this.batches=s}next(){let t=this.currIter.next();if(t.done&&(this.nextBatch(),t=this.currIter.next()),t.done)return{done:!0,value:[]};const[e,s]=t.value;return{done:!1,value:[new l(this.world,e),new m(this.currIndx,s)]}}[Symbol.iterator](){return this}nextBatch(){for(;;){const t=this.batches.next();if(t.done)return this.currIndx=new Map,void(this.currIter=new c);const e=t.value;if(e.matchDemands(this.demands))return this.currIndx=e.componentIndex,void(this.currIter=e.entries())}}}class v extends d{constructor(t,e){super(),this.sys=t,this.body=t.world.createRigidBody(t.rapier.RigidBodyDesc.dynamic().setLinearDamping(0).setAngularDamping(0)),this.sys.world.createCollider(e,this.body)}get lVelocity(){const t=this.body.linvel();return[t.x,t.y,t.z]}set lVelocity(t){const[e,s,n]=t;this.body.setLinvel({x:e,y:s,z:n},!0)}get aVelocity(){const t=this.body.angvel();return[t.x,t.y,t.z]}set aVelocity(t){const[e,s,n]=t;this.body.setAngvel({x:e,y:s,z:n},!0)}get qTransform(){const t=this.body.translation(),e=this.body.rotation();return[[t.x,t.y,t.z],[e.x,e.y,e.z,e.w]]}set qTransform(t){const[e,s]=t;{const[t,s,n]=e;this.body.setTranslation({x:t,y:s,z:n},!0)}{const[t,e,n,i]=s;this.body.setRotation({x:t,y:e,z:n,w:i},!0)}}}class g{constructor(t){this.demands=r.demands(),this.rapier=t,this.world=new t.World({x:0,y:0,z:0})}invoke(t,e){this.world.timestep=t/1e3,this.world.step()}}var f=function(t,e,s,n){return new(s||(s=Promise))((function(i,o){function r(t){try{c(n.next(t))}catch(t){o(t)}}function a(t){try{c(n.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?i(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(r,a)}c((n=n.apply(t,e||[])).next())}))};let x,M=Promise.resolve();class k extends g{}class b extends v{}M=M.then((()=>f(void 0,void 0,void 0,(function*(){return n.init().then((()=>{x=new k(n)}))}))));class E extends d{constructor(t){super(),this.mesh=t}}class I extends d{constructor(){super(...arguments),this.mark=!1}}class S{constructor(){this.demands=r.demands(b,I,E)}invoke(t,e){for(const[t,s]of e){const t=s.get(E),e=s.get(b),[[n,i,o],[r,a,c,h]]=e.qTransform;t.mesh.position.x=n,t.mesh.position.y=i,t.mesh.position.z=o,t.mesh.quaternion.x=r,t.mesh.quaternion.y=a,t.mesh.quaternion.z=c,t.mesh.quaternion.w=h,t.mesh.visible=!(n<0||n>500||i<0||i>500||o<0||o>500);const d=s.get(I);t.mesh.material=d.mark?D:z}}}class B{constructor(){this.demands=r.demands(b)}invoke(t,e){for(const[t,s]of e){const t=s.get(b),[[e,n,i],o]=t.qTransform;let[r,a,c]=t.lVelocity;(e<-50&&r<0||e>550&&r>0)&&(r=-r),(n<-50&&a<0||n>550&&a>0)&&(a=-a),(i<-50&&c<0||i>550&&c>0)&&(c=-c),t.lVelocity=[r,a,c]}}}class V{constructor(){this.demands=r.demands(b)}setView(t){this.view=t}invoke(t,e){if(void 0===this.view)return;let s=0,n=0;for(const[t,i]of e){const t=i.get(b),[e,o,r]=t.lVelocity;s+=Math.sqrt(e*e+o*o+r*r),n++}const i=0===n?0:s/n;var o;this.view.kelvin=(o=i)*o/10}}class T{constructor(){this.demands=r.demands(b,I)}setVelocity(t){this.velocity=t}invoke(t,e){let s,n;for(const[t,i]of e){const e=i.get(I),[[o,r,a],c]=i.get(b).qTransform;e.mark?(s=t,(o<0||o>500||r<0||r>500||a<0||a>500)&&(e.mark=!1,s=void 0)):void 0===n&&o>=0&&o<=500&&r>=0&&r<=500&&a>=0&&a<=500&&(n=t)}if(void 0===s&&void 0!==n){s=n;s.body.get(I).mark=!0}if(void 0!==this.velocity&&void 0!==s){s.body.get(b).lVelocity=this.velocity,this.velocity=void 0}}}const z=new t.MeshBasicMaterial({color:"grey",side:t.DoubleSide}),D=new t.MeshBasicMaterial({color:"red",side:t.DoubleSide}),q=new t.SphereGeometry(20,5,5);class A{constructor(e){this.sysMark=new T,this.sysSum=new V,this.sysPhy=e,this.scene=new t.Scene,this.group=new t.Group,this.initScene(),this.world=new u(this.sysMark,this.sysPhy,this.sysSum,new B,new S)}initScene(){const e=new t.GridHelper(500,10);e.position.x=250,e.position.y=0,e.position.z=250,this.scene.add(e);const s=new t.AxesHelper(500);this.scene.add(s),this.scene.add(this.group)}setView(t){this.sysSum.setView(t)}setMarkVelocity(t,e,s){this.sysMark.setVelocity([t,e,s])}cleanAtoms(){this.scene.remove(this.group),this.group=new t.Group,this.scene.add(this.group),this.world.cleanEntities()}randomAtoms(t,e){const s=Math.ceil(Math.pow(t,1/3)),n=500/s,i=new Map;for(let o=0;o<t;o++){let[t,o,r]=this.randomSlot(i,s);t=(t+.5)*n,o=(o+.5)*n,r=(r+.5)*n;const a=this.randomVel(e);this.addAtom([t,o,r],a)}}randomSlot(t,e){let s;do{s=[Math.floor(Math.random()*e),Math.floor(Math.random()*e),Math.floor(Math.random()*e)]}while(t.has(s.toString()));return t.set(s.toString(),!0),s}randomVel(t){const e=Math.random()*Math.PI,s=Math.cos(e)*t,n=Math.sin(e)*t,i=Math.random()*Math.PI*2,o=Math.cos(i)*n;return[Math.sin(i)*n,o,s]}addAtom(e,s){const i=new t.Mesh(q);i.position.set(e[0],e[1],e[2]),i.scale.set(.5,.5,.5),this.group.add(i);const o=n.ColliderDesc.ball(20).setRestitution(1).setFriction(0),r=this.newPhysicsComponent(o);r.qTransform=[[i.position.x,i.position.y,i.position.z],[i.quaternion.x,i.quaternion.y,i.quaternion.z,i.quaternion.w]],r.lVelocity=s,this.world.createEntity(r,new E(i),new I)}newPhysicsComponent(t){return new b(this.sysPhy,t)}}class P{constructor(n){this.canvas=n;const i=new t.PerspectiveCamera(45,n.width/n.height,.1,5e3);i.position.x=1e3,i.position.y=1e3,i.position.z=1e3,this.camera=i;const o=new t.WebGLRenderer({canvas:n});o.setSize(n.width,n.height),this.renderer=o;const r=new s(this.camera,this.canvas);r.target=new t.Vector3(250,250,250),this.controls=r;const a=new A(x);this.game=a;const c=new e;this.gui=c}execute(){this.initGUI();const t=this.controls,e=this.renderer;a.startAnimate((s=>{t.update(s/1e3),e.render(this.game.scene,this.camera)})),a.startTimer(this.game.world,1/60*1e3)}newGUIData(){const t={kelvin:0,parameters:{kelvin:0,atoms:1,marked_vx:0,marked_vy:0,marked_vz:0,reset:()=>{const e=this.game;var s;e.cleanAtoms(),e.randomAtoms(t.parameters.atoms,(s=t.parameters.kelvin,Math.sqrt(10*s))),e.setMarkVelocity(t.parameters.marked_vy,t.parameters.marked_vz,t.parameters.marked_vx)}}};return this.game.setView(t),t}initGUI(){const t=this.newGUIData();this.gui.open().add(t,"kelvin").decimals(2).name("Kelvin").disable().listen();const e=this.gui.addFolder("Parameters").close();e.add(t.parameters,"kelvin",0,1e3,10).name("Kelvin"),e.add(t.parameters,"atoms",0,500,10).name("Atoms"),e.add(t.parameters,"marked_vx",-50,50,1).name("Marked VX"),e.add(t.parameters,"marked_vy",-50,50,1).name("Marked VY"),e.add(t.parameters,"marked_vz",-50,50,1).name("Marked VZ"),e.add(t.parameters,"reset").name("Reset")}}M=M.then((()=>{const t=document.getElementById("app");new P(t).execute()}));

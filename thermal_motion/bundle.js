import*as t from"three";import e from"lil-gui";import{OrbitControls as s}from"three/examples/jsm/controls/OrbitControls.js";import i from"@dimforge/rapier3d-compat";class n{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}static now(){return("undefined"==typeof performance?Date:performance).now()}start(){this.startTime=n.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=n.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}var o;!function(t){t.startAnimate=function(t){const e="function"==typeof t?t:t.update.bind(t);let s=n.now();requestAnimationFrame((function t(i){let o=(i=i||n.now())-s;s=i,e(o),requestAnimationFrame(t)}))},t.startTimer=function(t,e){const s="function"==typeof t?t:t.update.bind(t);setInterval(s,e,e)}}(o||(o={}));var r,a=o;class c{[Symbol.iterator](){return this}next(){return{done:!0,value:void 0}}}class h{constructor(t){this.ops=[],this.core=t}pushOp(t,...e){this.ops.push([t,e])}flushOps(){const t=this.core;this.ops.forEach((([e,s])=>{(e=e.bind(t))(...s)})),this.ops=[]}update(t){this.flushOps()}}class d{}class l{constructor(t,e){this.world=t,this.id=e}body(){return this.world.getEntityBody(this.id)}dispose(){this.world.deleteEntity(this.id)}}class u{constructor(t,e){this.indx=t,this.comps=e}get(t){const e=this.indx.get(t);return this.comps[e]}has(...t){for(const e of t)if(!this.indx.has(e))return!1;return!0}}!function(t){t.demands=function(...t){return new Set(t)}}(r||(r={}));class m{constructor(...t){this.opQueue=new h(this),this.entities=new y,this.systems=t}createEntity(...t){this.opQueue.pushOp(this.createEntitySync,...t)}createEntitySync(...t){this.entities.newEntity(...t)}deleteEntity(t){this.opQueue.pushOp(this.deleteEntitySync,t)}deleteEntitySync(t){this.entities.deleteByID(t)}getEntityBody(t){return this.entities.getBodyByID(t)}update(t){const e=this.entities;this.systems.forEach((s=>{const i=new w(this,s.demands,e.iterateBatches());s.invoke(t,i)})),this.opQueue.update(t)}}class y{constructor(){this.batches=new Map,this.id2Batch=new Map,this.ids=function(){let t=1;return()=>t++}()}newEntity(...t){const e=this.getEntityBatch(...t.map((t=>t.constructor))),s=e.constructEntity(...t);return this.id2Batch.set(s,e),s}getEntityBatch(...t){t.sort();const e=t.toString();let s=this.batches.get(e);if(void 0!==s)return s;const i=new Map;for(let e=0;e<t.length;e++)i.set(t[e],e);return s=new p(i,this.ids),this.batches.set(e,s),s}deleteByID(t){const e=this.id2Batch.get(t);void 0!==e&&(this.id2Batch.delete(t),e.removeEntity(t))}getBodyByID(t){const e=this.id2Batch.get(t);if(void 0===e)return;const s=e.getEntity(t);return new u(e.componentIndex,s)}iterateBatches(){return this.batches.values()}}class p{constructor(t,e){this.entities=new Map,this.componentIndex=t,this.newID=e}constructEntity(...t){const e=this.newID();return t.sort(((t,e)=>this.componentIndex.get(t.constructor)-this.componentIndex.get(e.constructor))),this.entities.set(e,t),e}removeEntity(t){this.entities.delete(t)}getEntity(t){return this.entities.get(t)}matchDemands(t){for(const e of t)if(!this.componentIndex.has(e))return!1;return!0}[Symbol.iterator](){return this.entries()}entries(){return this.entities.entries()}}class w{constructor(t,e,s){this.currIndx=new Map,this.currIter=new c,this.demands=e,this.world=t,this.batches=s}next(){let t=this.currIter.next();if(t.done&&(this.nextBatch(),t=this.currIter.next()),t.done)return{done:!0,value:[]};const[e,s]=t.value;return{done:!1,value:[new l(this.world,e),new u(this.currIndx,s)]}}[Symbol.iterator](){return this}nextBatch(){for(;;){const t=this.batches.next();if(t.done)return this.currIndx=new Map,void(this.currIter=new c);const e=t.value;if(e.matchDemands(this.demands))return this.currIndx=e.componentIndex,void(this.currIter=e.entries())}}}class f extends d{constructor(t,e){super(),this.sys=t,this.body=t.world.createRigidBody(t.rapier.RigidBodyDesc.dynamic().setLinearDamping(0).setAngularDamping(0)),this.sys.world.createCollider(e,this.body)}get lVelocity(){const t=this.body.linvel();return[t.x,t.y,t.z]}set lVelocity(t){const[e,s,i]=t;this.body.setLinvel({x:e,y:s,z:i},!0)}get aVelocity(){const t=this.body.angvel();return[t.x,t.y,t.z]}set aVelocity(t){const[e,s,i]=t;this.body.setAngvel({x:e,y:s,z:i},!0)}get qTransform(){const t=this.body.translation(),e=this.body.rotation();return[[t.x,t.y,t.z],[e.x,e.y,e.z,e.w]]}set qTransform(t){const[e,s]=t;{const[t,s,i]=e;this.body.setTranslation({x:t,y:s,z:i},!0)}{const[t,e,i,n]=s;this.body.setRotation({x:t,y:e,z:i,w:n},!0)}}}class g{constructor(t){this.demands=r.demands(),this.rapier=t,this.world=new t.World({x:0,y:0,z:0})}invoke(t,e){this.world.timestep=t/1e3,this.world.step()}}var v=function(t,e,s,i){return new(s||(s=Promise))((function(n,o){function r(t){try{c(i.next(t))}catch(t){o(t)}}function a(t){try{c(i.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(r,a)}c((i=i.apply(t,e||[])).next())}))};let x,V=Promise.resolve();class b extends g{}class I extends f{}V=V.then((()=>v(void 0,void 0,void 0,(function*(){return i.init().then((()=>{x=new b(i)}))}))));function T(t){return Math.sqrt(10*t)}const B=T(1);class E extends d{constructor(t){super(),this.mesh=t}}class k extends d{}class S extends d{}class M{constructor(){this.demands=r.demands(I,E)}invoke(t,e){for(const[t,s]of e){const t=s.get(I),e=s.get(E),[[i,n,o],[r,a,c,h]]=t.qTransform;e.mesh.position.x=i,e.mesh.position.y=n,e.mesh.position.z=o,e.mesh.quaternion.x=r,e.mesh.quaternion.y=a,e.mesh.quaternion.z=c,e.mesh.quaternion.w=h}}}class D{constructor(){this.demands=r.demands(I)}invoke(t,e){for(const[t,s]of e){const t=s.get(I),[[e,i,n],o]=t.qTransform;let[r,a,c]=t.lVelocity;(e<0&&r<0||e>500&&r>0)&&(r=-r),(i<0&&a<0||i>500&&a>0)&&(a=-a),(n<0&&c<0||n>500&&c>0)&&(c=-c),t.lVelocity=[r,a,c]}}}class z{constructor(){this.demands=r.demands(I)}setView(t){this.view=t}invoke(t,e){if(void 0===this.view)return;let s=0,i=0;for(const[t,n]of e){const t=n.get(I),[e,o,r]=t.lVelocity;s+=Math.sqrt(e*e+o*o+r*r),i++}const n=0===i?0:s/i;var o;this.view.kelvin=(o=n)*o/10}}class q{constructor(){this.demands=r.demands(I,k),this.dVelocity=0}fireVelocity(t){this.dVelocity=t}invoke(t,e){if(0!==this.dVelocity){for(const[t,s]of e){const t=s.get(I),[e,i,n]=t.lVelocity;if(0===e&&0===i&&0===n){t.lVelocity=[0,Math.max(this.dVelocity,0),0];continue}const o=Math.sqrt(e*e+i*i+n*n),r=Math.max((o+this.dVelocity)/o,0);t.lVelocity=[e*r,i*r,n*r]}this.dVelocity=0}}}class A{constructor(){this.demands=r.demands(I,S)}resetVelocity(t){this.velocity=t}invoke(t,e){if(void 0===this.velocity)return;const[s,i,n]=this.velocity;for(const[t,o]of e){o.get(I).lVelocity=[s,i,n]}this.velocity=void 0}}const P=new t.MeshBasicMaterial({color:"blue",side:t.DoubleSide}),G=new t.MeshBasicMaterial({color:"red",side:t.DoubleSide}),H=new t.MeshBasicMaterial({color:"yellow",side:t.DoubleSide}),C=new t.SphereGeometry(20,5,5);class F{constructor(e){this.sysTester=new A,this.sysHeater=new q,this.sysSum=new z,this.sysPhy=e,this.scene=new t.Scene,this.initScene(),this.world=new m(this.sysPhy,this.sysHeater,this.sysTester,this.sysSum,new D,new M)}initScene(){const e=new t.GridHelper(500,10);e.position.x=250,e.position.y=0,e.position.z=250,this.scene.add(e)}setView(t){this.sysSum.setView(t)}fireVelocity(t){this.sysHeater.fireVelocity(t)}resetVelocity(t){this.sysTester.resetVelocity(t)}newPhysicsComponent(t){return new I(this.sysPhy,t)}addNormalAtom(){this.addAtom(P)}addHeaterAtom(){this.addAtom(G,new k)}addTesterAtom(){this.addAtom(H,new S)}addAtom(e,...s){const n=new t.Mesh(C,e);n.position.set(400*Math.random()+50,400*Math.random()+50,400*Math.random()+50),n.scale.set(.5,.5,.5),this.scene.add(n);const o=i.ColliderDesc.ball(20).setRestitution(1).setFriction(0),r=this.newPhysicsComponent(o);r.qTransform=[[n.position.x,n.position.y,n.position.z],[n.quaternion.x,n.quaternion.y,n.quaternion.z,n.quaternion.w]],r.lVelocity=[0,B,0],this.world.createEntity(r,new E(n),...s)}}class O{constructor(i){this.canvas=i;const n=new t.PerspectiveCamera(45,i.width/i.height,.1,5e3);n.position.x=1e3,n.position.y=1e3,n.position.z=1e3,this.camera=n;const o=new t.WebGLRenderer({canvas:i});o.setSize(i.width,i.height),this.renderer=o;const r=new s(this.camera,this.canvas);r.target=new t.Vector3(250,250,250),this.controls=r;const a=new F(x);this.game=a;const c=new e;this.gui=c}execute(){this.addAtoms(),this.initGUI();const t=this.controls,e=this.renderer;a.startAnimate((s=>{t.update(s/1e3),e.render(this.game.scene,this.camera)})),a.startTimer(this.game.world,1/60*1e3)}addAtoms(){for(let t=0;t<5;t++)this.game.addHeaterAtom();this.game.addTesterAtom();for(let t=0;t<244;t++)this.game.addNormalAtom()}newGUIData(){const t={kelvin:0,heating:{kelvin:0,fire:()=>{const e=t.heating.kelvin>=0?T(t.heating.kelvin):-T(-t.heating.kelvin);this.game.fireVelocity(e)}},marked:{vx:0,vy:0,vz:0,reset:()=>{this.game.resetVelocity([t.marked.vx,t.marked.vy,t.marked.vz])}}};return this.game.setView(t),t}initGUI(){const t=this.newGUIData();this.gui.close(),this.gui.add(t,"kelvin").decimals(2).name("Kelvin").disable().listen();const e=this.gui.addFolder("Heating").open();e.add(t.heating,"kelvin",-1e3,1e3,10).name("Kelvin"),e.add(t.heating,"fire").name("Fire");const s=this.gui.addFolder("Marked").open();s.add(t.marked,"vx",0,1e3,10).name("VX"),s.add(t.marked,"vy",0,1e3,10).name("VY"),s.add(t.marked,"vz",0,1e3,10).name("VZ"),s.add(t.marked,"reset").name("Reset")}}V=V.then((()=>{const t=document.getElementById("app");new O(t).execute()}));

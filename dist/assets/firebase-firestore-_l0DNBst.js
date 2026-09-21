import{L as hh,I as Dt,c as dh,f as Ge,F as fh,l as Ru,o as Pu,k as Wi,p as bu,n as mh,x as _h,y as ph,z as gh,A as yh,X as Ih,B as Th,G as ii,W as $r,H as Eh,J as xu,h as os,K as wh,M as Ah,N as Su,d as Oe,O as Vh,P as so,_ as vh,C as Rh,r as io,S as Ph}from"./firebase-core-2wSRfNQ8.js";import{R as Hi}from"./vendor-BXPL24B5.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Dn="12.19.0";function bh(r){Dn=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt=new hh("@firebase/firestore");function an(){return qt.logLevel}function I(r,...e){if(qt.logLevel<=Ge.DEBUG){const t=e.map(Yi);qt.debug(`Firestore (${Dn}): ${r}`,...t)}}function W(r,...e){if(qt.logLevel<=Ge.ERROR){const t=e.map(Yi);qt.error(`Firestore (${Dn}): ${r}`,...t)}}function Ce(r,...e){if(qt.logLevel<=Ge.WARN){const t=e.map(Yi);qt.warn(`Firestore (${Dn}): ${r}`,...t)}}function Yi(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,Cu(r,n,t)}function Cu(r,e,t){let n=`FIRESTORE (${Dn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw W(n),new Error(n)}function E(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||Cu(e,s,n)}function R(r,e){return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xh(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=xh(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function S(r,e){return r<e?-1:r>e?1:0}function gi(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return ai(s)===ai(i)?S(s,i):ai(s)?1:-1}return S(r.length,e.length)}const Sh=55296,Ch=57343;function ai(r){const e=r.charCodeAt(0);return e>=Sh&&e<=Ch}function fn(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function Nu(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e,t){this.comparator=e,this.root=t||ae.EMPTY}insert(e,t){return new q(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ae.BLACK,null,null))}remove(e){return new q(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ae.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new zr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new zr(this.root,e,this.comparator,!1)}getReverseIterator(){return new zr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new zr(this.root,e,this.comparator,!0)}}class zr{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ae{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??ae.RED,this.left=s??ae.EMPTY,this.right=i??ae.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new ae(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return ae.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return ae.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ae.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ae.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw V(43730,{key:this.key,value:this.value});if(this.right.isRed())throw V(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw V(27949);return e+(this.isRed()?0:1)}}ae.EMPTY=null,ae.RED=!0,ae.BLACK=!1;ae.EMPTY=new class{constructor(){this.size=0}get key(){throw V(57766)}get value(){throw V(16141)}get color(){throw V(16727)}get left(){throw V(29726)}get right(){throw V(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new ae(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e){this.comparator=e,this.data=new q(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ao(this.data.getIterator())}getIteratorFrom(e){return new ao(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof U)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new U(this.comparator);return t.data=e,t}}class ao{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Xt(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class T extends fh{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mn="__name__";class Le{constructor(e,t,n){t===void 0?t=0:t>e.length&&V(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&V(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Le.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Le?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=Le.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return S(e.length,t.length)}static compareSegments(e,t){const n=Le.isNumericId(e),s=Le.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?Le.extractNumericId(e).compare(Le.extractNumericId(t)):gi(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Dt.fromString(e.substring(4,e.length-2))}}class N extends Le{construct(e,t,n){return new N(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new T(p.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new N(t)}static emptyPath(){return new N([])}}const Nh=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let ee=class on extends Le{construct(e,t,n){return new on(e,t,n)}static isValidIdentifier(e){return Nh.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),on.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===mn}static keyField(){return new on([mn])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new T(p.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let a=!1;for(;s<e.length;){const o=e[s];if(o==="\\"){if(s+1===e.length)throw new T(p.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new T(p.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else o==="`"?(a=!a,s++):o!=="."||a?(n+=o,s++):(i(),s++)}if(i(),a)throw new T(p.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new on(t)}static emptyPath(){return new on([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e){this.fields=e,e.sort(ee.comparator)}static empty(){return new ye([])}unionWith(e){let t=new U(ee.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new ye(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return fn(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function us(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Tt(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Dh(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function Du(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e){this.path=e}static fromPath(e){return new A(N.fromString(e))}static fromName(e){return new A(N.fromString(e).popFirst(5))}static empty(){return new A(N.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&N.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return N.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new A(new N(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xi(r,e,t){if(!t)throw new T(p.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function kh(r,e,t,n){if(e===!0&&n===!0)throw new T(p.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function oo(r){if(!A.isDocumentKey(r))throw new T(p.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function uo(r){if(A.isDocumentKey(r))throw new T(p.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function xr(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function xs(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":V(12329,{type:typeof r})}function ke(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new T(p.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=xs(r);throw new T(p.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(r,e){const t={typeString:r};return e&&(t.value=e),t}function Sr(r,e){if(!xr(r))throw new T(p.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const a=r[n];if(s&&typeof a!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&a!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new T(p.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const co=-62135596800,lo=1e6;class F{static now(){return F.fromMillis(Date.now())}static fromDate(e){return F.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*lo);return new F(t,n)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new T(p.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return F._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,n;if(e>=0n)t=Number(e/1000000000n),n=Number(e%1000000000n);else{const s=e%1000000000n;s===0n?(t=Number(e/1000000000n),n=0):(t=Number(e/1000000000n-1n),n=Number(s+1000000000n))}return new F(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new T(p.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new T(p.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<co)throw new T(p.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new T(p.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/lo}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new T(p.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");const e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?S(this.nanoseconds,e.nanoseconds):S(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:F._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Sr(e,F._jsonSchema))return new F(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-co;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}F._jsonSchemaVersion="firestore/timestamp/1.0",F._jsonSchema={type:Y("string",F._jsonSchemaVersion),seconds:Y("number"),nanoseconds:Y("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ku extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new ku("Invalid base64 string: "+i):i}})(e);return new K(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new K(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return S(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}K.EMPTY_BYTE_STRING=new K("");const Oh=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ye(r){if(E(!!r,39018),typeof r=="string"){let e=0;const t=Oh.exec(r);if(E(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:$(r.seconds),nanos:$(r.nanos)}}function $(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Je(r){return typeof r=="string"?K.fromBase64String(r):K.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou="server_timestamp",Lu="__type__",Mu="__previous_value__",Fu="__local_write_time__";function Ss(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Lu])==null?void 0:n.stringValue)===Ou}function Cr(r){const e=r.mapValue.fields[Mu];return Ss(e)?Cr(e):e}function _n(r){const e=Ye(r.mapValue.fields[Fu].timestampValue);return new F(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lh{constructor(e,t,n,s,i,a,o,u,c,l,h,d,_){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=o,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=l,this.apiKey=h,this._customHeaders=d,this.grpcFlowControlWindow=_}}const lr="(default)";class $t{constructor(e,t){this.projectId=e,this.database=t||lr}static empty(){return new $t("","")}get isDefaultDatabase(){return this.database===lr}isEqual(e){return e instanceof $t&&e.projectId===this.projectId&&e.database===this.database}}function Mh(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new T(p.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new $t(r.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kt=-1;function Cs(r){return r==null}function pn(r){return r===0&&1/r==-1/0}function Uu(r){return typeof r=="number"&&Number.isInteger(r)&&!pn(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}function Fh(r){return typeof r=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zi="__type__",Bu="__max__",ut={mapValue:{fields:{__type__:{stringValue:Bu}}}},ea="__vector__",zt="value",qe={nullValue:"NULL_VALUE"},Ee={booleanValue:!0},ie={booleanValue:!1};function J(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Ss(r)?4:qu(r)?9007199254740991:Kt(r)?10:11:V(28295,{value:r})}function Ne(r,e,t){if(r===e)return!0;const n=J(r);if(n!==J(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return _n(r).isEqual(_n(e));case 3:return(function(i,a){if(typeof i.timestampValue=="string"&&typeof a.timestampValue=="string"&&i.timestampValue.length===a.timestampValue.length)return i.timestampValue===a.timestampValue;const o=Ye(i.timestampValue),u=Ye(a.timestampValue);return o.seconds===u.seconds&&o.nanos===u.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,a){return Je(i.bytesValue).isEqual(Je(a.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,a){return $(i.geoPointValue.latitude)===$(a.geoPointValue.latitude)&&$(i.geoPointValue.longitude)===$(a.geoPointValue.longitude)})(r,e);case 2:return(function(i,a,o){if("integerValue"in i&&"integerValue"in a)return $(i.integerValue)===$(a.integerValue);let u,c;if("doubleValue"in i&&"doubleValue"in a)u=$(i.doubleValue),c=$(a.doubleValue);else{if(!(o!=null&&o.i))return!1;u=$(i.integerValue??i.doubleValue),c=$(a.integerValue??a.doubleValue)}return u===c?!!(o!=null&&o.o)||pn(u)===pn(c):!!(o===void 0||o.u)&&isNaN(u)&&isNaN(c)})(r,e,t);case 9:return fn(r.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>Ne(s,i,t)));case 10:case 11:return(function(i,a,o){const u=i.mapValue.fields||{},c=a.mapValue.fields||{};if(us(u)!==us(c))return!1;for(const l in u)if(u.hasOwnProperty(l)&&(c[l]===void 0||!Ne(u[l],c[l],o)))return!1;return!0})(r,e,t);default:return V(52216,{left:r})}}function hr(r,e){return(r.values||[]).find((t=>Ne(t,e)))!==void 0}function fe(r,e){if(r===e)return 0;const t=J(r),n=J(e);if(t!==n)return S(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return S(r.booleanValue,e.booleanValue);case 2:return(function(i,a){const o=$(i.integerValue||i.doubleValue),u=$(a.integerValue||a.doubleValue);return o<u?-1:o>u?1:o===u?0:isNaN(o)?isNaN(u)?0:-1:1})(r,e);case 3:return ho(r.timestampValue,e.timestampValue);case 4:return ho(_n(r),_n(e));case 5:return gi(r.stringValue,e.stringValue);case 6:return(function(i,a){const o=Je(i),u=Je(a);return o.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,a){const o=i.split("/"),u=a.split("/");for(let c=0;c<o.length&&c<u.length;c++){const l=S(o[c],u[c]);if(l!==0)return l}return S(o.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,a){const o=S($(i.latitude),$(a.latitude));return o!==0?o:S($(i.longitude),$(a.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return fo(r.arrayValue,e.arrayValue);case 10:return(function(i,a){var d,_,y,v;const o=i.fields||{},u=a.fields||{},c=(d=o[zt])==null?void 0:d.arrayValue,l=(_=u[zt])==null?void 0:_.arrayValue,h=S(((y=c==null?void 0:c.values)==null?void 0:y.length)||0,((v=l==null?void 0:l.values)==null?void 0:v.length)||0);return h!==0?h:fo(c,l)})(r.mapValue,e.mapValue);case 11:return(function(i,a){if(i===ut.mapValue&&a===ut.mapValue)return 0;if(i===ut.mapValue)return 1;if(a===ut.mapValue)return-1;const o=i.fields||{},u=Object.keys(o),c=a.fields||{},l=Object.keys(c);u.sort(),l.sort();for(let h=0;h<u.length&&h<l.length;++h){const d=gi(u[h],l[h]);if(d!==0)return d;const _=fe(o[u[h]],c[l[h]]);if(_!==0)return _}return S(u.length,l.length)})(r.mapValue,e.mapValue);default:throw V(23264,{l:t})}}function ho(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return S(r,e);const t=Ye(r),n=Ye(e),s=S(t.seconds,n.seconds);return s!==0?s:S(t.nanos,n.nanos)}function fo(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=fe(t[s],n[s]);if(i!==void 0&&i!==0)return i}return S(t.length,n.length)}function gn(r){return yi(r)}function yi(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=Ye(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Je(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return A.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=yi(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of n)i?i=!1:s+=",",s+=`${a}:${yi(t.fields[a])}`;return s+"}"})(r.mapValue):V(61005,{value:r})}function Jr(r){switch(J(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Cr(r);return e?16+Jr(e):16;case 5:return 2*r.stringValue.length;case 6:return Je(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+Jr(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Tt(n.fields,((i,a)=>{s+=i.length+Jr(a)})),s})(r.mapValue);default:throw V(13486,{value:r})}}function dr(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Fe(r){return!!r&&"integerValue"in r}function Ct(r){return!!r&&"doubleValue"in r}function dt(r){return Fe(r)||Ct(r)}function ft(r){return!!r&&"arrayValue"in r}function ve(r){return!!r&&"nullValue"in r}function we(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Ot(r){return!!r&&"mapValue"in r}function Kt(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Zi])==null?void 0:n.stringValue)===ea}function Ii(r){var e,t;return(t=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[zt])==null?void 0:t.arrayValue}function Zn(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Tt(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=Zn(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Zn(r.arrayValue.values[t]);return e}return{...r}}function qu(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Bu}const $u={mapValue:{fields:{[Zi]:{stringValue:ea},[zt]:{arrayValue:{}}}}};function Uh(r){return"nullValue"in r?qe:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?dr($t.empty(),A.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Kt(r)?$u:{mapValue:{}}:V(35942,{value:r})}function Bh(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?dr($t.empty(),A.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?$u:"mapValue"in r?Kt(r)?{mapValue:{}}:ut:V(61959,{value:r})}function mo(r,e){const t=fe(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function _o(r,e){const t=fe(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e){this.value=e}static empty(){return new oe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Ot(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Zn(t)}setAll(e){let t=ee.emptyPath(),n={},s=[];e.forEach(((a,o)=>{if(!t.isImmediateParentOf(o)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=o.popLast()}a?n[o.lastSegment()]=Zn(a):s.push(o.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());Ot(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ne(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];Ot(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Tt(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new oe(Zn(this.value))}}function zu(r){const e=[];return Tt(r.fields,((t,n)=>{const s=new ee([t]);if(Ot(n)){const i=zu(n.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new ye(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ns(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:pn(e)?"-0":e}}function ta(r){return{integerValue:""+r}}function na(r,e,t){return Uu(e)?ta(e):Ns(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(){this._=void 0}}function qh(r,e,t){return r instanceof fr?(function(s,i){const a={fields:{[Lu]:{stringValue:Ou},[Fu]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Ss(i)&&(i=Cr(i)),i&&(a.fields[Mu]=i),{mapValue:a}})(t,e):r instanceof yn?Gu(r,e):r instanceof In?Qu(r,e):r instanceof Tn?(function(s,i){const a=Ku(s,i),o=cs(a)+cs(s.h);return Fe(a)&&Fe(s.h)?ta(o):Ns(s.serializer,o)})(r,e):r instanceof mr?(function(s,i){return po(s,i,Math.min)})(r,e):r instanceof _r?(function(s,i){return po(s,i,Math.max)})(r,e):void 0}function $h(r,e,t){return r instanceof yn?Gu(r,e):r instanceof In?Qu(r,e):t}function Ku(r,e){return r instanceof Tn?dt(e)?e:{integerValue:0}:null}class fr extends Ds{}class yn extends Ds{constructor(e){super(),this.elements=e}}function Gu(r,e){const t=ju(e);for(const n of r.elements)t.some((s=>Ne(s,n)))||t.push(n);return{arrayValue:{values:t}}}class In extends Ds{constructor(e){super(),this.elements=e}}function Qu(r,e){let t=ju(e);for(const n of r.elements)t=t.filter((s=>!Ne(s,n)));return{arrayValue:{values:t}}}class ra extends Ds{constructor(e,t){super(),this.serializer=e,this.h=t}}class Tn extends ra{}class mr extends ra{}class _r extends ra{}function po(r,e,t){if(!dt(e))return r.h;const n=t(cs(e),cs(r.h));return Fe(e)&&Fe(r.h)?ta(n):Ns(r.serializer,n)}function cs(r){return $(r.integerValue||r.doubleValue)}function ju(r){return ft(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zh{constructor(e,t){this.field=e,this.transform=t}}function Kh(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof yn&&s instanceof yn||n instanceof In&&s instanceof In?fn(n.elements,s.elements,Ne):n instanceof Tn&&s instanceof Tn||n instanceof mr&&s instanceof mr||n instanceof _r&&s instanceof _r?Ne(n.h,s.h):n instanceof fr&&s instanceof fr})(r.transform,e.transform)}class Gh{constructor(e,t){this.version=e,this.transformResults=t}}class ue{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ue}static exists(e){return new ue(void 0,e)}static updateTime(e){return new ue(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Xr(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class ks{}function Wu(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Nr(r.key,ue.none()):new kn(r.key,r.data,ue.none());{const t=r.data,n=oe.empty();let s=new U(ee.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?n.delete(i):n.set(i,a),s=s.add(i)}return new et(r.key,n,new ye(s.toArray()),ue.none())}}function Qh(r,e,t){r instanceof kn?(function(s,i,a){const o=s.value.clone(),u=yo(s.fieldTransforms,i,a.transformResults);o.setAll(u),i.convertToFoundDocument(a.version,o).setHasCommittedMutations()})(r,e,t):r instanceof et?(function(s,i,a){if(!Xr(s.precondition,i))return void i.convertToUnknownDocument(a.version);const o=yo(s.fieldTransforms,i,a.transformResults),u=i.data;u.setAll(Hu(s)),u.setAll(o),i.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function er(r,e,t,n){return r instanceof kn?(function(i,a,o,u){if(!Xr(i.precondition,a))return o;const c=i.value.clone(),l=Io(i.fieldTransforms,u,a);return c.setAll(l),a.convertToFoundDocument(a.version,c).setHasLocalMutations(),null})(r,e,t,n):r instanceof et?(function(i,a,o,u){if(!Xr(i.precondition,a))return o;const c=Io(i.fieldTransforms,u,a),l=a.data;return l.setAll(Hu(i)),l.setAll(c),a.convertToFoundDocument(a.version,l).setHasLocalMutations(),o===null?null:o.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((h=>h.field)))})(r,e,t,n):(function(i,a,o){return Xr(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):o})(r,e,t)}function jh(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Ku(n.transform,s||null);i!=null&&(t===null&&(t=oe.empty()),t.set(n.field,i))}return t||null}function go(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&fn(n,s,((i,a)=>Kh(i,a)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class kn extends ks{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class et extends ks{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Hu(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function yo(r,e,t){const n=new Map;E(r.length===t.length,32656,{T:t.length,P:r.length});for(let s=0;s<t.length;s++){const i=r[s],a=i.transform,o=e.data.field(i.field);n.set(i.field,$h(a,o,t[s]))}return n}function Io(r,e,t){const n=new Map;for(const s of r){const i=s.transform,a=t.data.field(s.field);n.set(s.field,qh(i,a,e))}return n}class Nr extends ks{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Yu extends ks{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e,t){this.position=e,this.inclusive=t}}function To(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],a=r.position[s];if(i.field.isKeyField()?n=A.comparator(A.fromName(a.referenceValue),t.key):n=fe(a,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function Eo(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Ne(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{}class L extends Ju{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new Wh(e,t,n):t==="array-contains"?new Jh(e,n):t==="in"?new rc(e,n):t==="not-in"?new Xh(e,n):t==="array-contains-any"?new Zh(e,n):new L(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Hh(e,n):new Yh(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(fe(t,this.value)):t!==null&&J(this.value)===J(t)&&this.matchesComparison(fe(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return V(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class B extends Ju{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new B(e,t)}matches(e){return wn(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.I}getFilters(){return Object.assign([],this.filters)}}function wn(r){return r.op==="and"}function Ti(r){return r.op==="or"}function sa(r){return Xu(r)&&wn(r)}function Xu(r){for(const e of r.filters)if(e instanceof B)return!1;return!0}function Ei(r){if(r instanceof L)return r.field.canonicalString()+r.op.toString()+gn(r.value);if(sa(r))return r.filters.map((e=>Ei(e))).join(",");{const e=r.filters.map((t=>Ei(t))).join(",");return`${r.op}(${e})`}}function Zu(r,e){return r instanceof L?(function(n,s){return s instanceof L&&n.op===s.op&&n.field.isEqual(s.field)&&Ne(n.value,s.value)})(r,e):r instanceof B?(function(n,s){return s instanceof B&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,a,o)=>i&&Zu(a,s.filters[o])),!0):!1})(r,e):void V(19439)}function ec(r,e){const t=r.filters.concat(e);return B.create(t,r.op)}function tc(r){return r instanceof L?(function(t){return`${t.field.canonicalString()} ${t.op} ${gn(t.value)}`})(r):r instanceof B?(function(t){return t.op.toString()+" {"+t.getFilters().map(tc).join(" ,")+"}"})(r):"Filter"}class Wh extends L{constructor(e,t,n){super(e,t,n),this.key=A.fromName(n.referenceValue)}matches(e){const t=A.comparator(e.key,this.key);return this.matchesComparison(t)}}class Hh extends L{constructor(e,t){super(e,"in",t),this.keys=nc("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Yh extends L{constructor(e,t){super(e,"not-in",t),this.keys=nc("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function nc(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((n=>A.fromName(n.referenceValue)))}class Jh extends L{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ft(t)&&hr(t.arrayValue,this.value)}}class rc extends L{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&hr(this.value.arrayValue,t)}}class Xh extends L{constructor(e,t){super(e,"not-in",t)}matches(e){if(hr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!hr(this.value.arrayValue,t)}}class Zh extends L{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ft(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>hr(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(e,t="asc"){this.field=e,this.dir=t}}function ed(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{static fromTimestamp(e){return new b(e)}static min(){return new b(new F(0,0))}static max(){return new b(new F(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e,t,n,s,i,a,o){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=a,this.documentState=o}static newInvalidDocument(e){return new G(e,0,b.min(),b.min(),b.min(),oe.empty(),0)}static newFoundDocument(e,t,n,s){return new G(e,1,t,b.min(),n,s,0)}static newNoDocument(e,t){return new G(e,2,t,b.min(),b.min(),oe.empty(),0)}static newUnknownDocument(e,t){return new G(e,3,t,b.min(),b.min(),oe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(b.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=oe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=oe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=b.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof G&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new G(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const An=-1;class hs{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function wi(r){return r.fields.find((e=>e.kind===2))}function Vt(r){return r.fields.filter((e=>e.kind!==2))}hs.UNKNOWN_ID=-1;class Zr{constructor(e,t){this.fieldPath=e,this.kind=t}}class pr{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new pr(0,Pe.min())}}function sc(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=b.fromTimestamp(n===1e9?new F(t+1,0):new F(t,n));return new Pe(s,A.empty(),e)}function ic(r){return new Pe(r.readTime,r.key,An)}class Pe{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Pe(b.min(),A.empty(),An)}static max(){return new Pe(b.max(),A.empty(),An)}}function ia(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=A.comparator(r.documentKey,e.documentKey),t!==0?t:S(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(e,t=null,n=[],s=[],i=null,a=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=a,this.endAt=o,this.R=null}}function Ai(r,e=null,t=[],n=[],s=null,i=null,a=null){return new td(r,e,t,n,s,i,a)}function ds(r){const e=R(r);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>Ei(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),Cs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>gn(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>gn(n))).join(",")),e.R=t}return e.R}function aa(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!ed(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Zu(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Eo(r.startAt,e.startAt)&&Eo(r.endAt,e.endAt)}function Qe(r){return!!r.isCorePipeline}function oa(r){return!!r.path&&A.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function fs(r,e){return r.filters.filter((t=>t instanceof L&&t.field.isEqual(e)))}function wo(r,e,t){let n=qe,s=!0;for(const i of fs(r,e)){let a=qe,o=!0;switch(i.op){case"<":case"<=":a=Uh(i.value);break;case"==":case"in":case">=":a=i.value;break;case">":a=i.value,o=!1;break;case"!=":case"not-in":a=qe}mo({value:n,inclusive:s},{value:a,inclusive:o})<0&&(n=a,s=o)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const a=t.position[i];mo({value:n,inclusive:s},{value:a,inclusive:t.inclusive})<0&&(n=a,s=t.inclusive);break}}return{value:n,inclusive:s}}function Ao(r,e,t){let n=ut,s=!0;for(const i of fs(r,e)){let a=ut,o=!0;switch(i.op){case">=":case">":a=Bh(i.value),o=!1;break;case"==":case"in":case"<=":a=i.value;break;case"<":a=i.value,o=!1;break;case"!=":case"not-in":a=ut}_o({value:n,inclusive:s},{value:a,inclusive:o})>0&&(n=a,s=o)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const a=t.position[i];_o({value:n,inclusive:s},{value:a,inclusive:t.inclusive})>0&&(n=a,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(e,t=null,n=[],s=[],i=null,a="F",o=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=a,this.startAt=o,this.endAt=u,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}}function ac(r,e,t,n,s,i,a,o){return new On(r,e,t,n,s,i,a,o)}function Dr(r){return new On(r)}function Vo(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function nd(r){return A.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function oc(r){return r.collectionGroup!==null}function tr(r){const e=R(r);if(e.A===null){e.A=[];const t=new Set;for(const i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let o=new U(ee.comparator);return a.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(o=o.add(c.field))}))})),o})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new ls(i,n))})),t.has(ee.keyField().canonicalString())||e.A.push(new ls(ee.keyField(),n))}return e.A}function Re(r){const e=R(r);return e.V||(e.V=rd(e,tr(r))),e.V}function rd(r,e){if(r.limitType==="F")return Ai(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new ls(s.field,i)}));const t=r.endAt?new En(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new En(r.startAt.position,r.startAt.inclusive):null;return Ai(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Vi(r,e){const t=r.filters.concat([e]);return new On(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function vi(r,e,t){return new On(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function sd(r,e){return aa(Re(r),Re(e))&&r.limitType===e.limitType}function nr(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>tc(s))).join(", ")}]`),Cs(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>gn(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>gn(s))).join(",")),`Target(${n})`})(Re(r))}; limitType=${r.limitType})`}function Os(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):A.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of tr(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(a,o,u){const c=To(a,o,u);return a.inclusive?c<=0:c<0})(n.startAt,tr(n),s)||n.endAt&&!(function(a,o,u){const c=To(a,o,u);return a.inclusive?c>=0:c>0})(n.endAt,tr(n),s))})(r,e)}function ua(r){return(e,t)=>{let n=!1;for(const s of tr(r)){const i=id(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function id(r,e,t){const n=r.field.isKeyField()?A.comparator(e.key,t.key):(function(i,a,o){const u=a.data.field(i),c=o.data.field(i);return u!==null&&c!==null?fe(u,c):V(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return V(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H,M;function od(r){switch(r){case p.OK:return V(64938);case p.CANCELLED:case p.UNKNOWN:case p.DEADLINE_EXCEEDED:case p.RESOURCE_EXHAUSTED:case p.INTERNAL:case p.UNAVAILABLE:case p.UNAUTHENTICATED:return!1;case p.INVALID_ARGUMENT:case p.NOT_FOUND:case p.ALREADY_EXISTS:case p.PERMISSION_DENIED:case p.FAILED_PRECONDITION:case p.ABORTED:case p.OUT_OF_RANGE:case p.UNIMPLEMENTED:case p.DATA_LOSS:return!0;default:return V(15467,{code:r})}}function uc(r){if(r===void 0)return W("GRPC error has no .code"),p.UNKNOWN;switch(r){case H.OK:return p.OK;case H.CANCELLED:return p.CANCELLED;case H.UNKNOWN:return p.UNKNOWN;case H.DEADLINE_EXCEEDED:return p.DEADLINE_EXCEEDED;case H.RESOURCE_EXHAUSTED:return p.RESOURCE_EXHAUSTED;case H.INTERNAL:return p.INTERNAL;case H.UNAVAILABLE:return p.UNAVAILABLE;case H.UNAUTHENTICATED:return p.UNAUTHENTICATED;case H.INVALID_ARGUMENT:return p.INVALID_ARGUMENT;case H.NOT_FOUND:return p.NOT_FOUND;case H.ALREADY_EXISTS:return p.ALREADY_EXISTS;case H.PERMISSION_DENIED:return p.PERMISSION_DENIED;case H.FAILED_PRECONDITION:return p.FAILED_PRECONDITION;case H.ABORTED:return p.ABORTED;case H.OUT_OF_RANGE:return p.OUT_OF_RANGE;case H.UNIMPLEMENTED:return p.UNIMPLEMENTED;case H.DATA_LOSS:return p.DATA_LOSS;default:return V(39323,{code:r})}}(M=H||(H={}))[M.OK=0]="OK",M[M.CANCELLED=1]="CANCELLED",M[M.UNKNOWN=2]="UNKNOWN",M[M.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",M[M.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",M[M.NOT_FOUND=5]="NOT_FOUND",M[M.ALREADY_EXISTS=6]="ALREADY_EXISTS",M[M.PERMISSION_DENIED=7]="PERMISSION_DENIED",M[M.UNAUTHENTICATED=16]="UNAUTHENTICATED",M[M.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",M[M.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",M[M.ABORTED=10]="ABORTED",M[M.OUT_OF_RANGE=11]="OUT_OF_RANGE",M[M.UNIMPLEMENTED=12]="UNIMPLEMENTED",M[M.INTERNAL=13]="INTERNAL",M[M.UNAVAILABLE=14]="UNAVAILABLE",M[M.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Tt(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return Du(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud=new q(A.comparator);function Z(){return ud}const cc=new q(A.comparator);function Rt(...r){let e=cc;for(const t of r)e=e.insert(t.key,t);return e}function lc(r){let e=cc;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function xe(){return rr()}function hc(){return rr()}function rr(){return new tt((r=>r.toString()),((r,e)=>r.isEqual(e)))}const cd=new q(A.comparator),ld=new U(A.comparator);function C(...r){let e=ld;for(const t of r)e=e.add(t);return e}const hd=new U(S);function ca(){return hd}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dd(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fd=new Dt([4294967295,4294967295],0);function vo(r){const e=dd().encode(r),t=new Vh;return t.update(e),new Uint8Array(t.digest())}function Ro(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Dt([t,n],0),new Dt([s,i],0)]}class la{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Hn(`Invalid padding: ${t}`);if(n<0)throw new Hn(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Hn(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Hn(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=Dt.fromNumber(this.p)}v(e,t,n){let s=e.add(t.multiply(Dt.fromNumber(n)));return s.compare(fd)===1&&(s=new Dt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;const t=vo(e),[n,s]=Ro(t);for(let i=0;i<this.hashCount;i++){const a=this.v(n,s,i);if(!this.D(a))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new la(i,s,t);return n.forEach((o=>a.insert(o))),a}insert(e){if(this.p===0)return;const t=vo(e),[n,s]=Ro(t);for(let i=0;i<this.hashCount;i++){const a=this.v(n,s,i);this.C(a)}}C(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Hn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e,t,n,s,i,a){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=a}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,kr.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Ln(b.min(),s,new q(S),Z(),Z(),C())}}class kr{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new kr(n,t,C(),C(),C())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(e,t,n,s){this.F=e,this.removedTargetIds=t,this.key=n,this.O=s}}class dc{constructor(e,t){this.targetId=e,this.M=t}}class fc{constructor(e,t,n=K.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class Po{constructor(e){this.targetId=e,this.N=0,this.L=bo(),this.B=K.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=C(),t=C(),n=C();return this.L.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:V(38017,{changeType:i})}})),new kr(this.B,this.U,e,t,n)}G(){this.k=!1,this.L=bo()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,E(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}}const zn="WatchChangeAggregator";class md{constructor(e){this.X=e,this.ee=new Map,this.te=Z(),this.ne=Kr(),this.re=Z(),this.ie=Kr(),this.se=new q(S)}_e(e){for(const t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(const t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,(t=>{const n=this.ee.get(t);if(n)switch(e.state){case 0:this.ce(t)&&n.K(e.resumeToken);break;case 1:n.Y(),n.q||n.G(),n.K(e.resumeToken);break;case 2:n.Y(),n.q||this.removeTarget(t);break;case 3:this.ce(t)&&(n.Z(),n.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),n.K(e.resumeToken));break;default:V(56790,{state:e.state})}else I(zn,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach(((n,s)=>{this.ce(s)&&t(s)}))}Ee(e){var t;return Qe(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:oa(e)}he(e){const t=e.targetId,n=e.M.count,s=this.Te(t);if(s){const i=s.target;if(this.Ee(i))if(n===0){const a=new A(Qe(i)?N.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,a,G.newNoDocument(a,b.min()))}else E(n===1,20013,"Single document existence filter with count: "+n);else{const a=this.Pe(t);if(a!==n){const o=this.Ie(e),u=o?this.Re(o,e,a):1;if(u!==0){this.le(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,c)}}}}}Ie(e){const t=e.M.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let a,o;try{a=Je(n).toUint8Array()}catch(u){if(u instanceof ku)return Ce("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{o=new la(a,s,i)}catch(u){return Ce(u instanceof Hn?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return o.p===0?null:o}Re(e,t,n){return t.M.count===n-this.de(e,t.targetId)?0:2}de(e,t){const n=this.X.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const a=this.X.Ve(),o=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(o)||(this.ae(t,i,null),s++)})),s}fe(e){const t=new Map;this.ee.forEach(((i,a)=>{const o=this.Te(a);if(o){if(i.current&&this.Ee(o.target)){const u=Qe(o.target)?N.fromString(o.target.getPipelineDocuments()[0]):o.target.path,c=new A(u);this.me(c).has(a)||this.pe(a,c)||this.ae(a,c,G.newNoDocument(c,e))}i.$&&(t.set(a,i.W()),i.G())}}));let n=C();this.ie.forEach(((i,a)=>{let o=!0;a.forEachWhile((u=>{const c=this.Te(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(o=!1,!1)})),o&&(n=n.add(i))})),this.te.forEach(((i,a)=>a.setReadTime(e))),this.re.forEach(((i,a)=>a.setReadTime(e)));const s=new Ln(e,t,this.se,this.te,this.re,n);return this.te=Z(),this.ne=Kr(),this.re=Z(),this.ie=Kr(),this.se=new q(S),s}oe(e,t){const n=this.ee.get(e);if(!n||!this.ce(e))return void I(zn,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.pe(e,t.key)?2:0;n.j(t.key,s),Qe(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,n){const s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),n&&(Qe(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,n):this.te=this.te.insert(t,n))):I(zn,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){const t=this.ee.get(e);if(!t)return 0;const n=t.W();return this.X.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}J(e){let t=this.ee.get(e);t||(I(zn,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Po(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new U(S),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new U(S),this.ne=this.ne.insert(e,t)),t}ce(e){const t=this.Te(e)!==null;return t||I(zn,"Detected inactive target",e),t}Te(e){const t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new Po(e)),this.X.getRemoteKeysForTarget(e).forEach((t=>{this.ae(e,t,null)}))}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}}function Kr(){return new q(A.comparator)}function bo(){return new q(A.comparator)}const _d={asc:"ASCENDING",desc:"DESCENDING"},pd={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},gd={and:"AND",or:"OR"};class yd{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ri(r,e){return r.useProto3Json||Cs(e)?e:{value:e}}function Lt(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ha(r){const e=Ye(r);return new F(e.seconds,e.nanos)}function mc(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function ts(r,e){return Lt(r,e.toTimestamp())}function ge(r){return E(!!r,49232),b.fromTimestamp(ha(r))}function da(r,e){return Pi(r,e).canonicalString()}function Pi(r,e){const t=(function(s){return new N(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function _c(r){const e=N.fromString(r);return E(vc(e),10190,{key:e.toString()}),e}function gr(r,e){return da(r.databaseId,e.path)}function Mt(r,e){const t=_c(e);if(t.get(1)!==r.databaseId.projectId)throw new T(p.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new T(p.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new A(yc(t))}function pc(r,e){return da(r.databaseId,e)}function gc(r){const e=_c(r);return e.length===4?N.emptyPath():yc(e)}function bi(r){return new N(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function yc(r){return E(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function xo(r,e,t){return{name:gr(r,e),fields:t.value.mapValue.fields}}function Id(r,e,t){const n=Mt(r,e.name),s=ge(e.updateTime),i=e.createTime?ge(e.createTime):b.min(),a=new oe({mapValue:{fields:e.fields}}),o=G.newFoundDocument(n,s,i,a);return t&&o.setHasCommittedMutations(),t?o.setHasCommittedMutations():o}function Td(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:V(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,l){return c.useProto3Json?(E(l===void 0||typeof l=="string",58123),K.fromBase64String(l||"")):(E(l===void 0||l instanceof Buffer||l instanceof Uint8Array,16193),K.fromUint8Array(l||new Uint8Array))})(r,e.targetChange.resumeToken),a=e.targetChange.cause,o=a&&(function(c){const l=c.code===void 0?p.UNKNOWN:uc(c.code);return new T(l,c.message||"")})(a);t=new fc(n,s,i,o||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=Mt(r,n.document.name),i=ge(n.document.updateTime),a=n.document.createTime?ge(n.document.createTime):b.min(),o=new oe({mapValue:{fields:n.document.fields}}),u=G.newFoundDocument(s,i,a,o),c=n.targetIds||[],l=n.removedTargetIds||[];t=new es(c,l,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=Mt(r,n.document),i=n.readTime?ge(n.readTime):b.min(),a=G.newNoDocument(s,i),o=n.removedTargetIds||[];t=new es([],o,a.key,a)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=Mt(r,n.document),i=n.removedTargetIds||[];t=new es([],i,s,null)}else{if(!("filter"in e))return V(11601,{we:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,a=new ad(s,i),o=n.targetId;t=new dc(o,a)}}return t}function ms(r,e){let t;if(e instanceof kn)t={update:xo(r,e.key,e.value)};else if(e instanceof Nr)t={delete:gr(r,e.key)};else if(e instanceof et)t={update:xo(r,e.key,e.data),updateMask:Rd(e.fieldMask)};else{if(!(e instanceof Yu))return V(16599,{be:e.type});t={verify:gr(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,a){const o=a.transform;if(o instanceof fr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(o instanceof yn)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:o.elements}};if(o instanceof In)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:o.elements}};if(o instanceof Tn)return{fieldPath:a.field.canonicalString(),increment:o.h};if(o instanceof mr)return{fieldPath:a.field.canonicalString(),minimum:o.h};if(o instanceof _r)return{fieldPath:a.field.canonicalString(),maximum:o.h};throw V(20930,{transform:a.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:ts(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:V(27497)})(r,e.precondition)),t}function xi(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?ue.updateTime(ge(i.updateTime)):i.exists!==void 0?ue.exists(i.exists):ue.none()})(e.currentDocument):ue.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(a,o){let u=null;if("setToServerValue"in o)E(o.setToServerValue==="REQUEST_TIME",16630,{proto:o}),u=new fr;else if("appendMissingElements"in o){const l=o.appendMissingElements.values||[];u=new yn(l)}else if("removeAllFromArray"in o){const l=o.removeAllFromArray.values||[];u=new In(l)}else"increment"in o?u=new Tn(a,o.increment):"minimum"in o?u=new mr(a,o.minimum):"maximum"in o?u=new _r(a,o.maximum):V(16584,{proto:o});const c=ee.fromServerFormat(o.fieldPath);return new zh(c,u)})(r,s))):[];if(e.update){e.update.name;const s=Mt(r,e.update.name),i=new oe({mapValue:{fields:e.update.fields}});if(e.updateMask){const a=(function(u){const c=u.fieldPaths||[];return new ye(c.map((l=>ee.fromServerFormat(l))))})(e.updateMask);return new et(s,i,a,t,n)}return new kn(s,i,t,n)}if(e.delete){const s=Mt(r,e.delete);return new Nr(s,t)}if(e.verify){const s=Mt(r,e.verify);return new Yu(s,t)}return V(1463,{proto:e})}function Ed(r,e){return r&&r.length>0?(E(e!==void 0,14353),r.map((t=>(function(s,i){let a=s.updateTime?ge(s.updateTime):ge(i);return a.isEqual(b.min())&&(a=ge(i)),new Gh(a,s.transformResults||[])})(t,e)))):[]}function Ic(r,e){return{documents:[pc(r,e.path)]}}function Tc(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=pc(r,s);const i=(function(c){if(c.length!==0)return Vc(B.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(c){if(c.length!==0)return c.map((l=>(function(d){return{field:un(d.field),direction:Ad(d.dir)}})(l)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const o=Ri(r,e.limit);return o!==null&&(t.structuredQuery.limit=o),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{Se:t,parent:s}}function Ec(r){let e=gc(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){E(n===1,65062);const l=t.from[0];l.allDescendants?s=l.collectionId:e=e.child(l.collectionId)}let i=[];t.where&&(i=(function(h){const d=Ac(h);return d instanceof B&&sa(d)?d.getFilters():[d]})(t.where));let a=[];t.orderBy&&(a=(function(h){return h.map((d=>(function(y){return new ls(cn(y.field),(function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(y.direction))})(d)))})(t.orderBy));let o=null;t.limit&&(o=(function(h){let d;return d=typeof h=="object"?h.value:h,Cs(d)?null:d})(t.limit));let u=null;t.startAt&&(u=(function(h){const d=!!h.before,_=h.values||[];return new En(_,d)})(t.startAt));let c=null;return t.endAt&&(c=(function(h){const d=!h.before,_=h.values||[];return new En(_,d)})(t.endAt)),ac(e,s,a,i,o,"F",u,c)}function wd(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return V(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function wc(r,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(r)))}}}}function Ac(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=cn(t.unaryFilter.field);return L.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=cn(t.unaryFilter.field);return L.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=cn(t.unaryFilter.field);return L.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=cn(t.unaryFilter.field);return L.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return V(61313);default:return V(60726)}})(r):r.fieldFilter!==void 0?(function(t){return L.create(cn(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return V(58110);default:return V(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return B.create(t.compositeFilter.filters.map((n=>Ac(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return V(1026)}})(t.compositeFilter.op))})(r):V(30097,{filter:r})}function Ad(r){return _d[r]}function Vd(r){return pd[r]}function vd(r){return gd[r]}function un(r){return{fieldPath:r.canonicalString()}}function cn(r){return ee.fromServerFormat(r.fieldPath)}function Vc(r){return r instanceof L?(function(t){if(t.op==="=="){if(we(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NAN"}};if(ve(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(we(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NOT_NAN"}};if(ve(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:un(t.field),op:Vd(t.op),value:t.value}}})(r):r instanceof B?(function(t){const n=t.getFilters().map((s=>Vc(s)));return n.length===1?n[0]:{compositeFilter:{op:vd(t.op),filters:n}}})(r):V(54877,{filter:r})}function Rd(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function vc(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function Rc(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}function yr(r,e){const t={fields:{}};return e.forEach(((n,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=n._toProto(r)})),{mapValue:t}}function Pc(r){return{stringValue:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ls(r){return new yd(r,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Se(K.fromBase64String(e))}catch(t){throw new T(p.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Se(K.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Se._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Sr(e,Se._jsonSchema))return Se.fromBase64String(e.bytes)}}Se._jsonSchemaVersion="firestore/bytes/1.0",Se._jsonSchema={type:Y("string",Se._jsonSchemaVersion),bytes:Y("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new T(p.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ee(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function Pd(){return new Ms(mn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new T(p.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new T(p.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return S(this._lat,e._lat)||S(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:$e._jsonSchemaVersion}}static fromJSON(e){if(Sr(e,$e._jsonSchema))return new $e(e.latitude,e.longitude)}}$e._jsonSchemaVersion="firestore/geoPoint/1.0",$e._jsonSchema={type:Y("string",$e._jsonSchemaVersion),latitude:Y("number"),longitude:Y("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}se.UNAUTHENTICATED=new se(null),se.GOOGLE_CREDENTIALS=new se("google-credentials-uid"),se.FIRST_PARTY=new se("first-party-uid"),se.MOCK_USER=new se("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bc{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class bd{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(se.UNAUTHENTICATED)))}shutdown(){}}class xd{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Sd{constructor(e){this.De=e,this.currentUser=se.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){E(this.Ce===void 0,42304);let n=this.xe;const s=u=>this.xe!==n?(n=this.xe,t(u)):Promise.resolve();let i=new je;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new je,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},o=u=>{I("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),a())};this.De.onInit((u=>o(u))),setTimeout((()=>{if(!this.auth){const u=this.De.getImmediate({optional:!0});u?o(u):(I("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new je)}}),0),a()}getToken(){const e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.xe!==e?(I("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(E(typeof n.accessToken=="string",31837,{Oe:n}),new bc(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){const e=this.auth&&this.auth.getUid();return E(e===null||typeof e=="string",2055,{Me:e}),new se(e)}}class Cd{constructor(e,t,n){this.Ne=e,this.Le=t,this.Be=n,this.type="FirstParty",this.user=se.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);const e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}}class Nd{constructor(e,t,n){this.Ne=e,this.Le=t,this.Be=n}getToken(){return Promise.resolve(new Cd(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable((()=>t(se.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class So{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Dd{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,dh(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){E(this.Ce===void 0,3512);const n=i=>{i.error!=null&&I("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.$e;return this.$e=i.token,I("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{I("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.qe.getImmediate({optional:!0});i?s(i):I("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.Ke)return Promise.resolve(new So(this.Ke));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(E(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new So(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}}function xc(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kd{Qe(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Co="ConnectivityMonitor";class No{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){I(Co,"Network connectivity changed: AVAILABLE");for(const e of this.He)e(0)}je(){I(Co,"Network connectivity changed: UNAVAILABLE");for(const e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gr=null;function Si(){return Gr===null?Gr=(function(){return 268435456+Math.round(2147483648*Math.random())})():Gr++,"0x"+Gr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi="RestConnection",Od={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class Ld{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${n}/databases/${s}`,this.tt=this.databaseId.database===lr?`project_id=${n}`:`project_id=${n}&database_id=${s}`}nt(e,t,n,s,i){const a=Si(),o=this.rt(e,t.toUriEncodedString());I(oi,`Sending RPC '${e}' ${a}:`,o,n);const u={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(u,s,i);const{host:c}=new URL(o),l=Wi(c);return this.st(e,o,u,n,l).then((h=>(I(oi,`Received RPC '${e}' ${a}: `,h),h)),(h=>{throw Ce(oi,`RPC '${e}' ${a} failed with error: `,h,"url: ",o,"request:",n),h}))}_t(e,t,n,s,i,a){return this.nt(e,t,n,s,i)}it(e,t,n){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Dn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){const n=Od[e];let s=`${this.Xe}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Md{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const le="WebChannelConnection",Kn=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class hn extends Ld{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!hn.yt){const e=gh();Kn(e,yh.STAT_EVENT,(t=>{t.stat===so.PROXY?I(le,"STAT_EVENT: detected buffering proxy"):t.stat===so.NOPROXY&&I(le,"STAT_EVENT: detected no buffering proxy")})),hn.yt=!0}}st(e,t,n,s,i){const a=Si();return new Promise(((o,u)=>{const c=new Ih;c.setWithCredentials(!0),c.listenOnce(Th.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case ii.NO_ERROR:const h=c.getResponseJson();I(le,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(h)),o(h);break;case ii.TIMEOUT:I(le,`RPC '${e}' ${a} timed out`),u(new T(p.DEADLINE_EXCEEDED,"Request time out"));break;case ii.HTTP_ERROR:const d=c.getStatus();if(I(le,`RPC '${e}' ${a} failed with status:`,d,"response text:",c.getResponseText()),d>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const y=_==null?void 0:_.error;if(y&&y.status&&y.message){const v=(function(k){const D=k.toLowerCase().replace(/_/g,"-");return Object.values(p).indexOf(D)>=0?D:p.UNKNOWN})(y.status);u(new T(v,y.message))}else u(new T(p.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new T(p.UNAVAILABLE,"Connection failed."));break;default:V(9055,{wt:e,streamId:a,bt:c.getLastErrorCode(),St:c.getLastError()})}}finally{I(le,`RPC '${e}' ${a} completed.`)}}));const l=JSON.stringify(s);I(le,`RPC '${e}' ${a} sending request:`,s),c.send(t,"POST",l,n,15)}))}vt(e,t,n){const s=Si(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),o={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(o.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(o.useFetchStreams=!0),this.it(o.initMessageHeaders,t,n),o.encodeInitMessageHeaders=!0;const c=i.join("");I(le,`Creating RPC '${e}' stream ${s}: ${c}`,o);const l=a.createWebChannel(c,o);this.Dt(l);let h=!1,d=!1;const _=new Md({ot:y=>{d?I(le,`Not sending because RPC '${e}' stream ${s} is closed:`,y):(h||(I(le,`Opening RPC '${e}' stream ${s} transport.`),l.open(),h=!0),I(le,`RPC '${e}' stream ${s} sending:`,y),l.send(y))},ut:()=>l.close()});return Kn(l,$r.EventType.OPEN,(()=>{d||(I(le,`RPC '${e}' stream ${s} transport opened.`),_.Rt())})),Kn(l,$r.EventType.CLOSE,(()=>{d||(d=!0,I(le,`RPC '${e}' stream ${s} transport closed`),_.Vt(),this.xt(l))})),Kn(l,$r.EventType.ERROR,(y=>{d||(d=!0,Ce(le,`RPC '${e}' stream ${s} transport errored. Name:`,y.name,"Message:",y.message),_.Vt(new T(p.UNAVAILABLE,"The operation could not be completed")))})),Kn(l,$r.EventType.MESSAGE,(y=>{var v;if(!d){const P=y.data[0];E(!!P,16349);const k=P,D=(k==null?void 0:k.error)||((v=k[0])==null?void 0:v.error);if(D){I(le,`RPC '${e}' stream ${s} received error:`,D);const O=D.status;let ne=(function(_e){const nt=H[_e];if(nt!==void 0)return uc(nt)})(O),z=D.message;O==="NOT_FOUND"&&z.includes("database")&&z.includes("does not exist")&&z.includes(this.databaseId.database)&&Ce(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ne===void 0&&(ne=p.INTERNAL,z="Unknown error status: "+O+" with message "+D.message),d=!0,_.Vt(new T(ne,z)),l.close()}else I(le,`RPC '${e}' stream ${s} received:`,P),_.dt(P)}})),hn.gt(),setTimeout((()=>{_.At()}),0),_}terminate(){this.ft.forEach((e=>e.close())),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter((t=>t===e))}it(e,t,n){super.it(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Eh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fd(r){return new hn(r)}hn.yt=!1;class Sc{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=n,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();const t=Math.floor(this.Nt+this.qt()),n=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-n);s>0&&I("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,(()=>(this.Bt=Date.now(),e()))),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Do="PersistentStream";class Cc{constructor(e,t,n,s,i,a,o,u){this.Ct=e,this.Kt=n,this.Qt=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=o,this.listener=u,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new Sc(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,(()=>this.tn())))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===p.RESOURCE_EXHAUSTED?(W(t.toString()),W("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===p.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;const e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.Wt===t&&this.un(n,s)}),(n=>{e((()=>{const s=new T(p.UNKNOWN,"Fetching auth token failed: "+n.message);return this.cn(s)}))}))}un(e,t){const n=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct((()=>{n((()=>this.listener.ct()))})),this.stream.Et((()=>{n((()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,(()=>(this.Yt()&&(this.state=3),Promise.resolve()))),this.listener.Et())))})),this.stream.Tt((s=>{n((()=>this.cn(s)))})),this.stream.onMessage((s=>{n((()=>++this.jt==1?this.hn(s):this.onNext(s)))}))}Zt(){this.state=5,this.Ht.kt((async()=>{this.state=0,this.start()}))}cn(e){return I(Do,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget((()=>this.Wt===e?t():(I(Do,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Ud extends Cc{constructor(e,t,n,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,a),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();const t=Td(this.serializer,e),n=(function(i){if(!("targetChange"in i))return b.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?b.min():a.readTime?ge(a.readTime):b.min()})(e);return this.listener.Tn(t,n)}Pn(e){const t={};t.database=bi(this.serializer),t.addTarget=(function(i,a){let o;const u=a.target;if(o=Qe(u)?{pipelineQuery:wc(i,u)}:oa(u)?{documents:Ic(i,u)}:{query:Tc(i,u).Se},o.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){o.resumeToken=mc(i,a.resumeToken);const c=Ri(i,a.expectedCount);c!==null&&(o.expectedCount=c)}else if(a.snapshotVersion.compareTo(b.min())>0){o.readTime=Lt(i,a.snapshotVersion.toTimestamp());const c=Ri(i,a.expectedCount);c!==null&&(o.expectedCount=c)}return o})(this.serializer,e);const n=wd(this.serializer,e);n&&(t.labels=n),this.nn(t)}In(e){const t={};t.database=bi(this.serializer),t.removeTarget=e,this.nn(t)}}class Bd extends Cc{constructor(e,t,n,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,a),this.serializer=i}get Rn(){return this.jt>0}start(){this.lastStreamToken=void 0,super.start()}_n(){this.Rn&&this.An([])}En(e,t){return this.connection.vt("Write",e,t)}hn(e){return E(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,E(!e.writeResults||e.writeResults.length===0,55816),this.listener.Vn()}onNext(e){E(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.Ht.reset();const t=Ed(e.writeResults,e.commitTime),n=ge(e.commitTime);return this.listener.dn(n,t)}fn(){const e={};e.database=bi(this.serializer),this.nn(e)}An(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>ms(this.serializer,n)))};this.nn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{}class $d extends qd{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new T(p.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,n,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.nt(e,Pi(t,n),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===p.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new T(p.UNKNOWN,i.toString())}))}_t(e,t,n,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,o])=>this.connection._t(e,Pi(t,n),s,a,o,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===p.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new T(p.UNKNOWN,a.toString())}))}terminate(){this.mn=!0,this.connection.terminate()}}function zd(r,e,t,n){return new $d(r,e,t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kd="ComponentProvider",ko=new Map;function Gd(r,e,t,n,s){return new Lh(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,xc(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oo={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Nc=41943040;class he{static withCacheSize(e){return new he(e,he.DEFAULT_COLLECTION_PERCENTILE,he.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}he.DEFAULT_COLLECTION_PERCENTILE=10,he.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,he.DEFAULT=new he(Nc,he.DEFAULT_COLLECTION_PERCENTILE,he.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),he.DISABLED=new he(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.gn(n),this.yn=n=>t.writeSequenceNumber(n))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.yn&&this.yn(e),e}}Ie.wn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class kc{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Et(r){if(r.code!==p.FAILED_PRECONDITION||r.message!==Dc)throw r;I("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&V(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new m(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof m?t:m.resolve(t)}catch(t){return m.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):m.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):m.reject(t)}static resolve(e){return new m(((t,n)=>{t(e)}))}static reject(e){return new m(((t,n)=>{n(e)}))}static waitFor(e){return new m(((t,n)=>{let s=0,i=0,a=!1;e.forEach((o=>{++s,o.next((()=>{++i,a&&i===s&&t()}),(u=>n(u)))})),a=!0,i===s&&t()}))}static or(e){let t=m.resolve(!1);for(const n of e)t=t.next((s=>s?m.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new m(((n,s)=>{const i=e.length,a=new Array(i);let o=0;for(let u=0;u<i;u++){const c=u;t(e[c]).next((l=>{a[c]=l,++o,o===i&&n(a)}),(l=>s(l)))}}))}static doWhile(e,t){return new m(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ve="SimpleDb";class Fs{static open(e,t,n,s){try{return new Fs(t,e.transaction(s,n))}catch(i){throw new sr(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.bn=new je,this.transaction.oncomplete=()=>{this.bn.resolve()},this.transaction.onabort=()=>{t.error?this.bn.reject(new sr(e,t.error)):this.bn.resolve()},this.transaction.onerror=n=>{const s=ma(n.target.error);this.bn.reject(new sr(e,s))}}get Sn(){return this.bn.promise}abort(e){e&&this.bn.reject(e),this.aborted||(I(Ve,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}vn(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new jd(t)}}class ct{static delete(e){return I(Ve,"Removing database:",e),Pt(wh().indexedDB.deleteDatabase(e)).toPromise()}static Ye(){if(!Ah())return!1;if(ct.Dn())return!0;const e=os(),t=ct.xn(e),n=0<t&&t<10,s=Oc(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static Dn(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static Cn(e,t){return e.store(t)}static xn(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.Fn=n,this.On=null,ct.xn(os())===12.2&&W("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async Mn(e){return this.db||(I(Ve,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const a=i.target.result;t(a)},s.onblocked=()=>{n(new sr(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const a=i.target.error;a.name==="VersionError"?n(new T(p.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):a.name==="InvalidStateError"?n(new T(p.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+a)):n(new sr(e,a))},s.onupgradeneeded=i=>{I(Ve,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const a=i.target.result;this.Fn.Nn(a,s.transaction,i.oldVersion,this.version).next((()=>{I(Ve,"Database upgrade to version "+this.version+" complete")}))}}))),this.Ln&&(this.db.onversionchange=t=>this.Ln(t)),this.db}Bn(e){this.Ln=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let a=0;for(;;){++a;try{this.db=await this.Mn(e);const o=Fs.open(this.db,e,i?"readonly":"readwrite",n),u=s(o).next((c=>(o.vn(),c))).catch((c=>(o.abort(c),m.reject(c)))).toPromise();return u.catch((()=>{})),await o.Sn,u}catch(o){const u=o,c=u.name!=="FirebaseError"&&a<3;if(I(Ve,"Transaction failed with error:",u.message,"Retrying:",c),this.close(),!c)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Oc(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class Qd{constructor(e){this.Un=e,this.kn=!1,this.qn=null}get isDone(){return this.kn}get $n(){return this.qn}set cursor(e){this.Un=e}done(){this.kn=!0}Kn(e){this.qn=e}delete(){return Pt(this.Un.delete())}}class sr extends T{constructor(e,t){super(p.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function wt(r){return r.name==="IndexedDbTransactionError"}class jd{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(I(Ve,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(I(Ve,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Pt(n)}add(e){return I(Ve,"ADD",this.store.name,e,e),Pt(this.store.add(e))}get(e){return Pt(this.store.get(e)).next((t=>(t===void 0&&(t=null),I(Ve,"GET",this.store.name,e,t),t)))}delete(e){return I(Ve,"DELETE",this.store.name,e),Pt(this.store.delete(e))}count(){return I(Ve,"COUNT",this.store.name),Pt(this.store.count())}Qn(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new m(((a,o)=>{i.onerror=u=>{o(u.target.error)},i.onsuccess=u=>{a(u.target.result)}}))}{const i=this.cursor(n),a=[];return this.Wn(i,((o,u)=>{a.push(u)})).next((()=>a))}}Gn(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new m(((s,i)=>{n.onerror=a=>{i(a.target.error)},n.onsuccess=a=>{s(a.target.result)}}))}zn(e,t){I(Ve,"DELETE ALL",this.store.name);const n=this.options(e,t);n.jn=!1;const s=this.cursor(n);return this.Wn(s,((i,a,o)=>o.delete()))}Hn(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.Wn(s,t)}Jn(e){const t=this.cursor({});return new m(((n,s)=>{t.onerror=i=>{const a=ma(i.target.error);s(a)},t.onsuccess=i=>{const a=i.target.result;a?e(a.primaryKey,a.value).next((o=>{o?a.continue():n()})):n()}}))}Wn(e,t){const n=[];return new m(((s,i)=>{e.onerror=a=>{i(a.target.error)},e.onsuccess=a=>{const o=a.target.result;if(!o)return void s();const u=new Qd(o),c=t(o.primaryKey,o.value,u);if(c instanceof m){const l=c.catch((h=>(u.done(),m.reject(h))));n.push(l)}u.isDone?s():u.$n===null?o.continue():o.continue(u.$n)}})).next((()=>m.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.jn?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Pt(r){return new m(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=ma(n.target.error);t(s)}}))}let Lo=!1;function ma(r){const e=ct.xn(os());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new T("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Lo||(Lo=!0,setTimeout((()=>{throw n}),0)),n}}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo="LruGarbageCollector",Lc=1048576;function Fo([r,e],[t,n]){const s=S(r,t);return s===0?S(e,n):s}class Wd{constructor(e){this.Yn=e,this.buffer=new U(Fo),this.Zn=0}Xn(){return++this.Zn}er(e){const t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();Fo(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Mc{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){I(Mo,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){wt(t)?I(Mo,"Ignoring IndexedDB error during garbage collection: ",t):await Et(t)}await this.nr(3e5)}))}}class Hd{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return m.resolve(Ie.wn);const n=new Wd(t);return this.rr.forEachTarget(e,(s=>n.er(s.sequenceNumber))).next((()=>this.rr.sr(e,(s=>n.er(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.rr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(I("LruGarbageCollector","Garbage collection skipped; disabled"),m.resolve(Oo)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(I("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Oo):this._r(e,t)))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let n,s,i,a,o,u,c;const l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((h=>(h>this.params.maximumSequenceNumbersToCollect?(I("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${h}`),s=this.params.maximumSequenceNumbersToCollect):s=h,a=Date.now(),this.nthSequenceNumber(e,s)))).next((h=>(n=h,o=Date.now(),this.removeTargets(e,n,t)))).next((h=>(i=h,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((h=>(c=Date.now(),an()<=Ge.DEBUG&&I("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-l}ms
	Determined least recently used ${s} in `+(o-a)+`ms
	Removed ${i} targets in `+(u-o)+`ms
	Removed ${h} documents in `+(c-u)+`ms
Total Duration: ${c-l}ms`),m.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:h}))))}}function Fc(r,e){return new Hd(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uc="firestore.googleapis.com",Uo=!0;class Bo{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new T(p.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Uc,this.ssl=Uo}else this.host=e.host,this.ssl=e.ssl??Uo;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Nc;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Lc)throw new T(p.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(kh("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=xc(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new T(p.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new T(p.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new T(p.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new T(p.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(n,s){if(n===s)return!0;if(!n||!s)return!1;const i=Object.keys(n),a=Object.keys(s);if(i.length!==a.length)return!1;for(const o of i)if(n[o]!==s[o])return!1;return!0})(this._customHeaders,e._customHeaders)}}let Or=class{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Bo({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new T(p.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new T(p.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Bo(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new bd;switch(n.type){case"firstParty":return new Nd(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new T(p.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=ko.get(t);n&&(I(Kd,"Removing Datastore"),ko.delete(t),n.terminate())})(this),Promise.resolve()}};function Yd(r,e,t,n={}){var c;r=ke(r,Or);const s=Wi(e),i=r._getSettings(),a={...i,emulatorOptions:r._getEmulatorOptions()},o=`${e}:${t}`;s&&bu(`https://${o}`),i.host!==Uc&&i.host!==o&&Ce("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:o,ssl:s,emulatorOptions:n};if(!Pu(u,a)&&(r._setSettings(u),n.mockUserToken)){let l,h;if(typeof n.mockUserToken=="string")l=n.mockUserToken,h=se.MOCK_USER;else{l=ph(n.mockUserToken,(c=r._app)==null?void 0:c.options.projectId);const d=n.mockUserToken.sub||n.mockUserToken.user_id;if(!d)throw new T(p.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new se(d)}r._authCredentials=new xd(new bc(l,h))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Wt(this.firestore,e,this._query)}}class j{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new lt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new j(this.firestore,e,this._key)}toJSON(){return{type:j._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Sr(t,j._jsonSchema))return new j(e,n||null,new A(N.fromString(t.referencePath)))}}j._jsonSchemaVersion="firestore/documentReference/1.0",j._jsonSchema={type:Y("string",j._jsonSchemaVersion),referencePath:Y("string")};class lt extends Wt{constructor(e,t,n){super(e,t,Dr(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new j(this.firestore,null,new A(e))}withConverter(e){return new lt(this.firestore,e,this._path)}}function Wp(r,e,...t){if(r=Oe(r),Xi("collection","path",e),r instanceof Or){const n=N.fromString(e,...t);return uo(n),new lt(r,null,n)}{if(!(r instanceof j||r instanceof lt))throw new T(p.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(N.fromString(e,...t));return uo(n),new lt(r.firestore,null,n)}}function Hp(r,e){if(r=ke(r,Or),Xi("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new T(p.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Wt(r,null,(function(n){return new On(N.emptyPath(),n)})(e))}function Yp(r,e,...t){if(r=Oe(r),arguments.length===1&&(e=Ji.newId()),Xi("doc","path",e),r instanceof Or){const n=N.fromString(e,...t);return oo(n),new j(r,null,new A(n))}{if(!(r instanceof j||r instanceof lt))throw new T(p.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(N.fromString(e,...t));return oo(n),new j(r.firestore,r instanceof lt?r.converter:null,new A(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Te._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Sr(e,Te._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Te(e.vectorValues);throw new T(p.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Te._jsonSchemaVersion="firestore/vectorValue/1.0",Te._jsonSchema={type:Y("string",Te._jsonSchemaVersion),vectorValues:Y("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jd=/^__.*__$/;class Xd{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new et(e,this.data,this.fieldMask,t,this.fieldTransforms):new kn(e,this.data,t,this.fieldTransforms)}}class Bc{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new et(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function qc(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw V(40011,{dataSource:r})}}class _a{constructor(e,t,n,s,i,a){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new _a({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return _s(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(qc(this.dataSource)&&Jd.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class Zd{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Ls(e)}createContext(e,t,n,s=!1){return new _a({dataSource:e,methodName:t,targetDoc:n,path:ee.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function pa(r){const e=r._freezeSettings(),t=Ls(r._databaseId);return new Zd(r._databaseId,!!e.ignoreUndefinedProperties,t)}function $c(r,e,t,n,s,i={}){const a=r.createContext(i.merge||i.mergeFields?2:0,e,t,s);ga("Data must be an object, but it was:",a,n);const o=zc(n,a);let u,c;if(i.merge)u=new ye(a.fieldMask),c=a.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const d=_t(e,h,t);if(!a.contains(d))throw new T(p.INVALID_ARGUMENT,`Field '${d}' is specified in your field mask but missing from your input data.`);jc(l,d)||l.push(d)}u=new ye(l),c=a.fieldTransforms.filter((h=>u.covers(h.field)))}else u=null,c=a.fieldTransforms;return new Xd(new oe(o),u,c)}class Us extends fa{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Us}}function ef(r,e,t,n){const s=r.createContext(1,e,t);ga("Data must be an object, but it was:",s,n);const i=[],a=oe.empty();Tt(n,((u,c)=>{const l=Qc(e,u,t);c=Oe(c);const h=s.childContextForFieldPath(l);if(c instanceof Us)i.push(l);else{const d=mt(c,h);d!=null&&(i.push(l),a.set(l,d))}}));const o=new ye(i);return new Bc(a,o,s.fieldTransforms)}function tf(r,e,t,n,s,i){const a=r.createContext(1,e,t),o=[_t(e,n,t)],u=[s];if(i.length%2!=0)throw new T(p.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)o.push(_t(e,i[d])),u.push(i[d+1]);const c=[],l=oe.empty();for(let d=o.length-1;d>=0;--d)if(!jc(c,o[d])){const _=o[d];let y=u[d];y=Oe(y);const v=a.childContextForFieldPath(_);if(y instanceof Us)c.push(_);else{const P=mt(y,v);P!=null&&(c.push(_),l.set(_,P))}}const h=new ye(c);return new Bc(l,h,a.fieldTransforms)}function nf(r,e,t,n=!1){return mt(t,r.createContext(n?4:3,e))}function mt(r,e,t){if(Gc(r=Oe(r)))return ga("Unsupported field value:",e,r),zc(r,e);if(r instanceof fa)return(function(s,i){if(!qc(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const a=s._toFieldTransform(i);a&&i.fieldTransforms.push(a)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const a=[];let o=0;for(const u of s){let c=mt(u,i.childContextForArray(o));c==null&&(c={nullValue:"NULL_VALUE"}),a.push(c),o++}return{arrayValue:{values:a}}})(r,e)}return(function(s,i,a){if((s=Oe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return na(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const o=F.fromDate(s);return{timestampValue:Lt(i.serializer,o)}}if(s instanceof F){const o=new F(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Lt(i.serializer,o)}}if(Kc(s)){const o=F.fromInstant(s),u=new F(o.seconds,1e3*Math.floor(o.nanoseconds/1e3));return{timestampValue:Lt(i.serializer,u)}}if(s instanceof $e)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Se)return{bytesValue:mc(i.serializer,s._byteString)};if(s instanceof j){const o=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(o))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:da(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof Te)return(function(u,c){const l=u instanceof Te?u.toArray():u;return{mapValue:{fields:{[Zi]:{stringValue:ea},[zt]:{arrayValue:{values:l.map((d=>{if(typeof d!="number")throw c.createError("VectorValues must only contain numeric values.");return Ns(c.serializer,d)}))}}}}}})(s,i);if(Rc(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${xs(s)}`)})(r,e)}function zc(r,e){const t={};return Du(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Tt(r,((n,s)=>{const i=mt(s,e.childContextForField(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function Kc(r){if(typeof r!="object"||r===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&r instanceof Temporal.Instant)return!0;const e=r;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function Gc(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof F||r instanceof $e||r instanceof Se||r instanceof j||r instanceof fa||r instanceof Te||Kc(r)||Rc(r))}function ga(r,e,t){if(!Gc(t)||!xr(t)){const n=xs(t);throw n==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+n)}}function _t(r,e,t){if((e=Oe(e))instanceof Ms)return e._internalPath;if(typeof e=="string")return Qc(r,e);throw _s("Field path arguments must be of type string or ",r,!1,void 0,t)}const rf=new RegExp("[~\\*/\\[\\]]");function Qc(r,e,t){if(e.search(rf)>=0)throw _s(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Ms(...e.split("."))._internalPath}catch{throw _s(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function _s(r,e,t,n,s){const i=n&&!n.isEmpty(),a=s!==void 0;let o=`Function ${e}() called with invalid data`;t&&(o+=" (via `toFirestore()`)"),o+=". ";let u="";return(i||a)&&(u+=" (found",i&&(u+=` in field ${n}`),a&&(u+=` in document ${s}`),u+=")"),new T(p.INVALID_ARGUMENT,o+r+u)}function jc(r,e){return r.some((t=>t.isEqual(e)))}function sf(r){return typeof r._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const n=oe.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const a=e[s];let o;i.nestedOptions&&xr(a)?o={mapValue:{fields:new me(i.nestedOptions).getOptionsProto(t,a)}}:a&&(o=mt(a,t)??void 0),o&&n.set(ee.fromServerFormat(i.serverName),o)}}return n}getOptionsProto(e,t,n){const s=this._getKnownOptions(t,e);if(n){const i=new Map(Dh(n,((a,o)=>[ee.fromServerFormat(o),a!==void 0?mt(a,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function af(r){return typeof r=="object"&&r!==null&&!!("nullValue"in r&&(r.nullValue===null||r.nullValue==="NULL_VALUE")||"booleanValue"in r&&(r.booleanValue===null||typeof r.booleanValue=="boolean")||"integerValue"in r&&(r.integerValue===null||typeof r.integerValue=="number"||typeof r.integerValue=="string")||"doubleValue"in r&&(r.doubleValue===null||typeof r.doubleValue=="number")||"timestampValue"in r&&(r.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(r.timestampValue))||"stringValue"in r&&(r.stringValue===null||typeof r.stringValue=="string")||"bytesValue"in r&&(r.bytesValue===null||r.bytesValue instanceof Uint8Array)||"referenceValue"in r&&(r.referenceValue===null||typeof r.referenceValue=="string")||"geoPointValue"in r&&(r.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(r.geoPointValue))||"arrayValue"in r&&(r.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(r.arrayValue))||"mapValue"in r&&(r.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!xr(t.fields))})(r.mapValue))||"fieldReferenceValue"in r&&(r.fieldReferenceValue===null||typeof r.fieldReferenceValue=="string")||"functionValue"in r&&(r.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(r.functionValue))||"pipelineValue"in r&&(r.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(r.pipelineValue)))}function of(r){return new Te(r)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w(r){let e;return r instanceof Ht?r:(e=xr(r)?ff(r):r instanceof Array?mf(r):Wc(r,void 0),e)}function ui(r){if(r instanceof Ht)return r;if(r instanceof Te)return Ir(r);if(Array.isArray(r))return Ir(of(r));throw new Error("Unsupported value: "+typeof r)}function ya(r){return Fh(r)?lf(r):w(r)}class Ht{constructor(){this._protoValueType="ProtoValue"}add(e){return new g("add",[this,w(e)],"add")}asBoolean(){if(this instanceof pt)return this;if(this instanceof Yt)return new Yc(this);if(this instanceof Mn)return new df(this);if(this instanceof g)return new Hc(this);throw new T("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new g("subtract",[this,w(e)],"subtract")}multiply(e){return new g("multiply",[this,w(e)],"multiply")}divide(e){return new g("divide",[this,w(e)],"divide")}mod(e){return new g("mod",[this,w(e)],"mod")}equal(e){return new g("equal",[this,w(e)],"equal").asBoolean()}notEqual(e){return new g("not_equal",[this,w(e)],"notEqual").asBoolean()}lessThan(e){return new g("less_than",[this,w(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new g("less_than_or_equal",[this,w(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new g("greater_than",[this,w(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new g("greater_than_or_equal",[this,w(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const n=[e,...t].map((s=>w(s)));return new g("array_concat",[this,...n],"arrayConcat")}arrayContains(e){return new g("array_contains",[this,w(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new Yn(e.map(w),"arrayContainsAll"):e;return new g("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new Yn(e.map(w),"arrayContainsAny"):e;return new g("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new g("array_reverse",[this])}arrayLength(){return new g("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new Yn(e.map(w),"equalAny"):e;return new g("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new Yn(e.map(w),"notEqualAny"):e;return new g("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new g("exists",[this],"exists").asBoolean()}charLength(){return new g("char_length",[this],"charLength")}like(e){return new g("like",[this,w(e)],"like").asBoolean()}regexContains(e){return new g("regex_contains",[this,w(e)],"regexContains").asBoolean()}regexFind(e){return new g("regex_find",[this,w(e)],"regexFind")}regexFindAll(e){return new g("regex_find_all",[this,w(e)],"regexFindAll")}regexMatch(e){return new g("regex_match",[this,w(e)],"regexMatch").asBoolean()}stringContains(e){return new g("string_contains",[this,w(e)],"stringContains").asBoolean()}startsWith(e){return new g("starts_with",[this,w(e)],"startsWith").asBoolean()}endsWith(e){return new g("ends_with",[this,w(e)],"endsWith").asBoolean()}toLower(){return new g("to_lower",[this],"toLower")}toUpper(){return new g("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(w(e)),new g("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(w(e)),new g("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(w(e)),new g("rtrim",t,"rtrim")}type(){return new g("type",[this])}isType(e){return new g("is_type",[this,Ir(e)],"isType").asBoolean()}stringConcat(e,...t){const n=[e,...t].map(w);return new g("string_concat",[this,...n],"stringConcat")}stringIndexOf(e){return new g("string_index_of",[this,w(e)],"stringIndexOf")}stringRepeat(e){return new g("string_repeat",[this,w(e)],"stringRepeat")}stringReplaceAll(e,t){return new g("string_replace_all",[this,w(e),w(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new g("string_replace_one",[this,w(e),w(t)],"stringReplaceOne")}concat(e,...t){const n=[e,...t].map(w);return new g("concat",[this,...n],"concat")}reverse(){return new g("reverse",[this],"reverse")}arrayFilter(e,t){return new g("array_filter",[this,w(e),t],"arrayFilter")}arrayTransform(e,t){return new g("array_transform",[this,w(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,n){return new g("array_transform",[this,w(e),w(t),n],"arrayTransformWithIndex")}arraySlice(e,t){const n=[this,w(e)];return t!==void 0&&n.push(w(t)),new g("array_slice",n,"arraySlice")}arrayFirst(){return new g("array_first",[this],"arrayFirst")}arrayFirstN(e){return new g("array_first_n",[this,w(e)],"arrayFirstN")}arrayLast(){return new g("array_last",[this],"arrayLast")}arrayLastN(e){return new g("array_last_n",[this,w(e)],"arrayLastN")}arrayMaximum(){return new g("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new g("maximum_n",[this,w(e)],"arrayMaximumN")}arrayMinimum(){return new g("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new g("minimum_n",[this,w(e)],"arrayMinimumN")}arrayIndexOf(e){return new g("array_index_of",[this,w(e),w("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new g("array_index_of",[this,w(e),w("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new g("array_index_of_all",[this,w(e)],"arrayIndexOfAll")}byteLength(){return new g("byte_length",[this],"byteLength")}ceil(){return new g("ceil",[this])}floor(){return new g("floor",[this])}abs(){return new g("abs",[this])}exp(){return new g("exp",[this])}mapGet(e){return new g("map_get",[this,Ir(e)],"mapGet")}mapSet(e,t,...n){const s=[this,w(e),w(t),...n.map(w)];return new g("map_set",s,"mapSet")}mapKeys(){return new g("map_keys",[this],"mapKeys")}mapValues(){return new g("map_values",[this],"mapValues")}mapEntries(){return new g("map_entries",[this],"mapEntries")}getField(e){return new g("get_field",[this,w(e)],"get_field")}count(){return Ae._create("count",[this],"count")}sum(){return Ae._create("sum",[this],"sum")}average(){return Ae._create("average",[this],"average")}minimum(){return Ae._create("minimum",[this],"minimum")}maximum(){return Ae._create("maximum",[this],"maximum")}first(){return Ae._create("first",[this],"first")}last(){return Ae._create("last",[this],"last")}arrayAgg(){return Ae._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Ae._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Ae._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const n=[e,...t];return new g("maximum",[this,...n.map(w)],"logicalMaximum")}logicalMinimum(e,...t){const n=[e,...t];return new g("minimum",[this,...n.map(w)],"minimum")}vectorLength(){return new g("vector_length",[this],"vectorLength")}cosineDistance(e){return new g("cosine_distance",[this,ui(e)],"cosineDistance")}dotProduct(e){return new g("dot_product",[this,ui(e)],"dotProduct")}euclideanDistance(e){return new g("euclidean_distance",[this,ui(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new g("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new g("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new g("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new g("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new g("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new g("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new g("timestamp_add",[this,w(e),w(t)],"timestampAdd")}timestampSubtract(e,t){return new g("timestamp_subtract",[this,w(e),w(t)],"timestampSubtract")}timestampDiff(e,t){return new g("timestamp_diff",[this,ya(e),w(t)],"timestampDiff")}timestampExtract(e,t){const n=[this,w(e)];return t&&n.push(w(t)),new g("timestamp_extract",n,"timestampExtract")}documentId(){return new g("document_id",[this],"documentId")}parent(){return new g("parent",[this],"parent")}substring(e,t){const n=w(e);return new g("substring",t===void 0?[this,n]:[this,n,w(t)],"substring")}arrayGet(e){return new g("array_get",[this,w(e)],"arrayGet")}isError(){return new g("is_error",[this],"isError").asBoolean()}ifError(e){const t=new g("if_error",[this,w(e)],"ifError");return e instanceof pt?t.asBoolean():t}isAbsent(){return new g("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new g("map_remove",[this,w(e)],"mapRemove")}mapMerge(e,...t){const n=w(e),s=t.map(w);return new g("map_merge",[this,n,...s],"mapMerge")}pow(e){return new g("pow",[this,w(e)])}trunc(e){return e===void 0?new g("trunc",[this]):new g("trunc",[this,w(e)],"trunc")}round(e){return e===void 0?new g("round",[this]):new g("round",[this,w(e)],"round")}collectionId(){return new g("collection_id",[this])}length(){return new g("length",[this])}ln(){return new g("ln",[this])}sqrt(){return new g("sqrt",[this])}stringReverse(){return new g("string_reverse",[this])}ifAbsent(e){return new g("if_absent",[this,w(e)],"ifAbsent")}ifNull(e){return new g("if_null",[this,w(e)],"ifNull")}coalesce(e,...t){return new g("coalesce",[this,w(e),...t.map(w)],"coalesce")}join(e){return new g("join",[this,w(e)],"join")}log10(){return new g("log10",[this])}arraySum(){return new g("sum",[this])}split(e){return new g("split",[this,w(e)])}timestampTruncate(e,t){const n=[this,w(e)];return t&&n.push(w(t)),new g("timestamp_trunc",n)}ascending(){return _f(this)}descending(){return pf(this)}as(e){return new cf(this,e,"as")}}class Ae{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,n){const s=new Ae(e,t);return s._methodName=n,s}as(e){return new uf(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class uf{constructor(e,t,n){this.aggregate=e,this.alias=t,this._methodName=n}_readUserData(e){this.aggregate._readUserData(e)}}class cf{constructor(e,t,n){this.expr=e,this.alias=t,this._methodName=n,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class Yn extends Ht{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map((t=>t._toProto(e)))}}}_readUserData(e){this.cr.forEach((t=>t._readUserData(e)))}}class Mn extends Ht{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new g("geo_distance",[this,w(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function lf(r){return hf(r,"field")}function hf(r,e){return new Mn(typeof r=="string"?mn===r?Pd()._internalPath:_t("field",r):r._internalPath,e)}class Yt extends Ht{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new Yt(e,void 0);return t._protoValue=e,t}_toProto(e){return E(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,af(this._protoValue)||(this._protoValue=mt(this.value,e))}}function Ir(r,e){return Wc(r,"constant")}function Wc(r,e){const t=new Yt(r,e);return typeof r=="boolean"?new Yc(t):t}class g extends Ht{constructor(e,t,n,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,n!==void 0&&(this._methodName=n),s!==void 0&&(this._options=s)}get _optionsUtil(){return new me({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((n=>n._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class pt extends Ht{get _methodName(){return this._expr._methodName}countIf(){return Ae._create("count_if",[this],"countIf")}not(){return new g("not",[this],"not").asBoolean()}conditional(e,t){return new g("conditional",[this,e,t],"conditional")}ifError(e){const t=w(e),n=new g("if_error",[this,t],"ifError");return t instanceof pt?n.asBoolean():n}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class Hc extends pt{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class Yc extends pt{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class df extends pt{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function ff(r,e){const t=[];for(const n in r)if(Object.prototype.hasOwnProperty.call(r,n)){const s=r[n];t.push(Ir(n)),t.push(w(s))}return new g("map",t,"map")}function mf(r){return(function(t,n){return new g("array",t.map((s=>w(s))),n)})(r,"array")}function _f(r){return new Ia(ya(r),"ascending","ascending")}function pf(r){return new Ia(ya(r),"descending","descending")}class Ia{constructor(e,t,n){this.expr=e,this.direction=t,this._methodName=n,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:Pc(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class Jc extends be{get _name(){return"add_fields"}get _optionsUtil(){return new me({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[yr(e,this.fields)]}}_readUserData(e){super._readUserData(e),gt(this.fields,e)}}class Xc extends be{get _name(){return"aggregate"}get _optionsUtil(){return new me({})}constructor(e,t,n){super(n),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[yr(e,this.accumulators),yr(e,this.groups)]}}_readUserData(e){super._readUserData(e),gt(this.groups,e),gt(this.accumulators,e)}}class Zc extends be{get _name(){return"distinct"}get _optionsUtil(){return new me({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[yr(e,this.groups)]}}_readUserData(e){super._readUserData(e),gt(this.groups,e)}}class Lr extends be{get _name(){return"collection"}get _optionsUtil(){return new me({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}}class Mr extends be{get _name(){return"collection_group"}get _optionsUtil(){return new me({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class Bs extends be{get _name(){return"database"}get _optionsUtil(){return new me({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class qs extends be{get _name(){return"documents"}get _optionsUtil(){return new me({})}constructor(e,t){if(super(t),!e||e.length===0)throw new T(p.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const n=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(n);if(s.size!==n.length)throw new T(p.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=n,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class $s extends be{get _name(){return"where"}get _optionsUtil(){return new me({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),gt(this.condition,e)}}class Vn extends be{get _name(){return"limit"}get _optionsUtil(){return new me({})}constructor(e,t){E(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[na(e,this.limit)]}}}class qo extends be{get _name(){return"offset"}get _optionsUtil(){return new me({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[na(e,this.offset)]}}}class gf extends be{get _name(){return"select"}get _optionsUtil(){return new me({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[yr(e,this.selections)]}}_readUserData(e){super._readUserData(e),gt(this.selections,e)}}class zs extends be{get _name(){return"sort"}get _optionsUtil(){return new me({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),gt(this.orderings,e)}}class Ta extends be{get _name(){return"replace_with"}get _optionsUtil(){return new me({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),Pc(Ta.Ir)]}}_readUserData(e){super._readUserData(e),gt(this.map,e)}}Ta.Ir="full_replace";function gt(r,e){return sf(r)?r._readUserData(e):Array.isArray(r)?r.forEach((t=>t._readUserData(e))):r instanceof Map?r.forEach((t=>t._readUserData(e))):Object.values(r).forEach((t=>t._readUserData(e))),r}// Copyright 2024 Google LLC* @license
class pe{constructor(e,t,n){this.serializer=e,this.stages=t,this.listenOptions=n,this.isCorePipeline=!0}getPipelineCollection(){return Fr(this)}getPipelineCollectionGroup(){return Ea(this)}getPipelineCollectionId(){return el(this)}getPipelineDocuments(){return ps(this)}getPipelineFlavor(){return(function(t){let n="exact";return t.stages.forEach(((s,i)=>{s._name!==Zc.name&&s._name!==Xc.name||(n="keyless"),s._name===gf.name&&n==="exact"&&(n="augmented"),s._name===Jc.name&&i<t.stages.length-1&&n==="exact"&&(n="augmented")})),n})(this)}getPipelineSourceType(){return We(this)}}function We(r){const e=r.stages[0];return e instanceof Lr||e instanceof Mr||e instanceof Bs||e instanceof qs?e._name:"unknown"}function Fr(r){if(We(r)==="collection")return r.stages[0].hr}function Ea(r){if(We(r)==="collection_group")return r.stages[0].collectionId}function el(r){switch(We(r)){case"collection":return N.fromString(Fr(r)).lastSegment();case"collection_group":return Ea(r);default:return}}function ps(r){if(We(r)==="documents")return r.stages[0].Tr}class f{constructor(e,t){this.type=e,this.value=t}static mr(){return new f("ERROR",void 0)}static pr(){return new f("UNSET",void 0)}static gr(){return new f("NULL",qe)}static newValue(e){return ve(e)?new f("NULL",qe):(function(n){return!!n&&"booleanValue"in n})(e)?new f("BOOLEAN",e):Fe(e)?new f("INT",e):Ct(e)?new f("DOUBLE",e):(function(n){return!!n&&"timestampValue"in n&&!!n.timestampValue})(e)?new f("TIMESTAMP",e):(function(n){return!!n&&"stringValue"in n})(e)?new f("STRING",e):(function(n){return!!n&&"bytesValue"in n})(e)?new f("BYTES",e):e.referenceValue?new f("REFERENCE",e):e.geoPointValue?new f("GEO_POINT",e):ft(e)?new f("ARRAY",e):Kt(e)?new f("VECTOR",e):Ot(e)?new f("MAP",e):new f("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}}function ir(r){if(!r.yr())return r.value}function tl(r){return r instanceof pt?r._expr:r}function x(r){if((r=tl(r))instanceof Mn)return new yf(r);if(r instanceof Yt)return new If(r);if(r instanceof Yn)return new Tf(r);if(r instanceof g){if(r.name==="add")return new Af(r);if(r.name==="subtract")return new Vf(r);if(r.name==="multiply")return new vf(r);if(r.name==="divide")return new Rf(r);if(r.name==="mod")return new Pf(r);if(r.name==="and")return new bf(r);if(r.name==="equal")return new Bf(r);if(r.name==="not_equal")return new qf(r);if(r.name==="less_than")return new $f(r);if(r.name==="less_than_or_equal")return new zf(r);if(r.name==="greater_than")return new Kf(r);if(r.name==="greater_than_or_equal")return new Gf(r);if(r.name==="array_concat")return new Qf(r);if(r.name==="array_reverse")return new jf(r);if(r.name==="array_contains")return new Wf(r);if(r.name==="array_contains_all")return new Hf(r);if(r.name==="array_contains_any")return new Yf(r);if(r.name==="array_length")return new Jf(r);if(r.name==="array_element")return new Xf(r);if(r.name==="equal_any")return new nl(r);if(r.name==="not_equal_any")return new Sf(r);if(r.name==="is_nan")return new Cf(r);if(r.name==="is_not_nan")return new Nf(r);if(r.name==="is_null")return new Df(r);if(r.name==="is_not_null")return new kf(r);if(r.name==="is_error")return new Of(r);if(r.name==="exists")return new Lf(r);if(r.name==="not")return new Ks(r);if(r.name==="or")return new xf(r);if(r.name==="xor")return new wa(r);if(r.name==="conditional")return new Mf(r);if(r.name==="maximum")return new Ff(r);if(r.name==="minimum")return new Uf(r);if(r.name==="reverse")return new Zf(r);if(r.name==="replace_first")return new em(r);if(r.name==="replace_all")return new tm(r);if(r.name==="char_length")return new nm(r);if(r.name==="byte_length")return new rm(r);if(r.name==="like")return new sm(r);if(r.name==="regex_contains")return new im(r);if(r.name==="regex_match")return new am(r);if(r.name==="string_contains")return new om(r);if(r.name==="starts_with")return new um(r);if(r.name==="ends_with")return new cm(r);if(r.name==="to_lower")return new lm(r);if(r.name==="to_upper")return new hm(r);if(r.name==="trim")return new dm(r);if(r.name==="string_concat")return new fm(r);if(r.name==="map_get")return new mm(r);if(r.name==="cosine_distance")return new _m(r);if(r.name==="dot_product")return new pm(r);if(r.name==="euclidean_distance")return new gm(r);if(r.name==="vector_length")return new ym(r);if(r.name==="unix_micros_to_timestamp")return new Am(r);if(r.name==="timestamp_to_unix_micros")return new Rm(r);if(r.name==="unix_millis_to_timestamp")return new Vm(r);if(r.name==="timestamp_to_unix_millis")return new Pm(r);if(r.name==="unix_seconds_to_timestamp")return new vm(r);if(r.name==="timestamp_to_unix_seconds")return new bm(r);if(r.name==="timestamp_add")return new xm(r);if(r.name==="timestamp_subtract")return new Sm(r)}throw new Error(`Unknown Expr : ${r}`)}class yf{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===mn)return f.newValue({referenceValue:gr(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return f.newValue({timestampValue:ts(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return f.newValue({timestampValue:ts(e.serializer,t.createTime)});const n=t.data.field(this.expr._fieldPath);return n?Ss(n)?f.newValue((function(i,a){if(i.serverTimestampBehavior==="estimate")return{timestampValue:ts(i.serializer,b.fromTimestamp(_n(a)))};if(i.serverTimestampBehavior==="previous"){const o=Cr(a);if(o)return o}return{nullValue:"NULL_VALUE"}})(e,n)):f.newValue(n):f.pr()}}class If{constructor(e){this.expr=e}evaluate(e,t){return f.newValue(this.expr._getValue())}}class Tf{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.cr.map((s=>x(s).evaluate(e,t)));return n.some((s=>s.yr()))?f.mr():f.newValue({arrayValue:{values:n.map((s=>s.value))}})}}function ce(r){return Ct(r)?Number(r.doubleValue):Number(r.integerValue)}function ze(r){return BigInt(r.integerValue)}const Ef=BigInt("0x7fffffffffffffff"),wf=-BigInt("0x8000000000000000");class Ur{constructor(e){this.expr=e}evaluate(e,t){E(this.expr.params.length>=2,24778);const n=x(this.expr.params[0]).evaluate(e,t),s=x(this.expr.params[1]).evaluate(e,t);let i=this.br(n,s);for(const a of this.expr.params.slice(2)){const o=x(a).evaluate(e,t);i=this.br(i,o)}return i}br(e,t){if(e.yr()||t.yr())return f.mr();if(e.wr()||t.wr())return f.gr();const n=e.value,s=t.value;if(!Ct(n)&&!Fe(n)||!Ct(s)&&!Fe(s))return f.mr();if(Ct(n)||Ct(s)){const i=this.Sr(n,s);return i?f.newValue(i):f.mr()}if(Fe(n)&&Fe(s)){const i=this.vr(n,s);return i===void 0?f.mr():typeof i=="number"?f.newValue({doubleValue:i}):i<wf||i>Ef?f.mr():f.newValue({integerValue:`${i}`})}return f.mr()}}function Xe(r,e){return J(r)!==J(e)?"TYPE_MISMATCH":we(r)||we(e)?"NOT_EQ":ve(r)&&ve(e)?"EQ":ve(r)||ve(e)?"NULL":ft(r)&&ft(e)?(function(n,s){var a,o,u;if(((a=n.values)==null?void 0:a.length)!==((o=s.values)==null?void 0:o.length))return"NOT_EQ";let i=!1;for(let c=0;c<(((u=n.values)==null?void 0:u.length)??0);c++){const l=n.values[c],h=s.values[c];switch(Xe(l,h)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:V(44609,{Dr:l,Cr:h})}}return i?"NULL":"EQ"})(r.arrayValue,e.arrayValue):Kt(r)&&Kt(e)||Ot(r)&&Ot(e)?(function(n,s){const i=n.fields||{},a=s.fields||{};if(us(i)!==us(a))return"NOT_EQ";let o=!1;for(const u in i)if(i.hasOwnProperty(u)){if(a[u]===void 0)return"NOT_EQ";switch(Xe(i[u],a[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":o=!0}}return o?"NULL":"EQ"})(r.mapValue,e.mapValue):(function(n,s){return Ne(n,s,{u:!1,i:!0,o:!0})})(r,e)?"EQ":"NOT_EQ"}class Af extends Ur{vr(e,t){return ze(e)+ze(t)}Sr(e,t){return{doubleValue:ce(e)+ce(t)}}}class Vf extends Ur{constructor(e){super(e),this.expr=e}vr(e,t){return ze(e)-ze(t)}Sr(e,t){return{doubleValue:ce(e)-ce(t)}}}class vf extends Ur{constructor(e){super(e),this.expr=e}vr(e,t){return ze(e)*ze(t)}Sr(e,t){return{doubleValue:ce(e)*ce(t)}}}class Rf extends Ur{constructor(e){super(e),this.expr=e}vr(e,t){const n=ze(t);if(n!==BigInt(0))return ze(e)/n}Sr(e,t){const n=ce(t);return n===0?{doubleValue:pn(n)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:ce(e)/n}}}class Pf extends Ur{constructor(e){super(e),this.expr=e}vr(e,t){const n=ze(t);if(n!==BigInt(0))return ze(e)%n}Sr(e,t){const n=ce(t);if(n!==0)return{doubleValue:ce(e)%n}}}class bf{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const a of this.expr.params){const o=x(a).evaluate(e,t);switch(o.type){case"BOOLEAN":if(!((i=o.value)!=null&&i.booleanValue))return f.newValue(ie);break;case"NULL":s=!0;break;default:n=!0}}return n?f.mr():s?f.gr():f.newValue(Ee)}}class Ks{constructor(e){this.expr=e}evaluate(e,t){var s;E(this.expr.params.length===1,9634);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return f.newValue({booleanValue:!((s=n.value)!=null&&s.booleanValue)});case"NULL":return f.gr();default:return f.mr()}}}class xf{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const a of this.expr.params){const o=x(a).evaluate(e,t);switch(o.type){case"BOOLEAN":if((i=o.value)!=null&&i.booleanValue)return f.newValue(Ee);break;case"NULL":s=!0;break;default:n=!0}}return n?f.mr():s?f.gr():f.newValue(ie)}}class wa{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const a of this.expr.params){const o=x(a).evaluate(e,t);switch(o.type){case"BOOLEAN":n=wa.xor(n,!!((i=o.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return f.mr()}}return s?f.gr():f.newValue({booleanValue:n})}static xor(e,t){return(e||t)&&!(e&&t)}}class nl{constructor(e){this.expr=e}evaluate(e,t){var a,o;E(this.expr.params.length===2,55094);let n=!1;const s=x(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":n=!0;break;case"ERROR":case"UNSET":return f.mr()}const i=x(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return f.mr()}if(n)return f.gr();for(const u of((o=(a=i.value)==null?void 0:a.arrayValue)==null?void 0:o.values)??[])switch(ve(s.value)&&ve(u)?"EQ":Xe(s.value,u)){case"EQ":return f.newValue(Ee);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:V(44608,{value:s.value,candidate:u})}return n?f.gr():f.newValue(ie)}}class Sf{constructor(e){this.expr=e}evaluate(e,t){return new Ks(new g("not",[new g("equal_any",this.expr.params)])).evaluate(e,t)}}class Cf{constructor(e){this.expr=e}evaluate(e,t){E(this.expr.params.length===1,23322);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return f.newValue(ie);case"DOUBLE":return f.newValue({booleanValue:isNaN(ce(n.value))});case"NULL":return f.gr();default:return f.mr()}}}class Nf{constructor(e){this.expr=e}evaluate(e,t){return E(this.expr.params.length===1,50406),new Ks(new g("not",[new g("is_nan",this.expr.params)])).evaluate(e,t)}}class Df{constructor(e){this.expr=e}evaluate(e,t){switch(E(this.expr.params.length===1,23123),x(this.expr.params[0]).evaluate(e,t).type){case"NULL":return f.newValue(Ee);case"UNSET":case"ERROR":return f.mr();default:return f.newValue(ie)}}}class kf{constructor(e){this.expr=e}evaluate(e,t){return E(this.expr.params.length===1,23167),new Ks(new g("not",[new g("is_null",this.expr.params)])).evaluate(e,t)}}class Of{constructor(e){this.expr=e}evaluate(e,t){return E(this.expr.params.length===1,5228),x(this.expr.params[0]).evaluate(e,t).type==="ERROR"?f.newValue(Ee):f.newValue(ie)}}class Lf{constructor(e){this.expr=e}evaluate(e,t){switch(E(this.expr.params.length===1,6877),x(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return f.mr();case"UNSET":return f.newValue(ie);default:return f.newValue(Ee)}}}class Mf{constructor(e){this.expr=e}evaluate(e,t){var s;E(this.expr.params.length===3,11706);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return(s=n.value)!=null&&s.booleanValue?x(this.expr.params[1]).evaluate(e,t):x(this.expr.params[2]).evaluate(e,t);case"NULL":return x(this.expr.params[2]).evaluate(e,t);default:return f.mr()}}}class Ff{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>x(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||fe(i.value,s.value)>0?i:s}return s===void 0?f.gr():s}}class Uf{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>x(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||fe(i.value,s.value)<0?i:s}return s===void 0?f.gr():s}}class Fn{constructor(e){this.expr=e}evaluate(e,t){E(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"ERROR":case"UNSET":return f.mr()}const s=x(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return f.mr()}return this.Fr(n,s)}}class Bf extends Fn{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return f.newValue(Ee);if(e.wr()||t.wr()||we(e.value)||we(t.value)||J(e.value)!==J(t.value))return f.newValue(ie);switch(Xe(e.value,t.value)){case"EQ":return f.newValue(Ee);case"NOT_EQ":return f.newValue(ie);case"NULL":return f.gr();default:V(44615,{left:e,right:t})}}}class qf extends Fn{constructor(e){super(e),this.expr=e}Fr(e,t){switch(Xe(e.value,t.value)){case"EQ":return f.newValue(ie);case"NOT_EQ":case"TYPE_MISMATCH":return f.newValue(Ee);case"NULL":return f.gr();default:V(44614,{left:e,right:t})}}}class $f extends Fn{constructor(e){super(e),this.expr=e}Fr(e,t){return J(e.value)!==J(t.value)||we(e.value)||we(t.value)?f.newValue(ie):f.newValue({booleanValue:fe(e.value,t.value)<0})}}class zf extends Fn{constructor(e){super(e),this.expr=e}Fr(e,t){return J(e.value)!==J(t.value)||we(e.value)||we(t.value)?f.newValue(ie):Xe(e.value,t.value)==="EQ"?f.newValue(Ee):f.newValue({booleanValue:fe(e.value,t.value)<0})}}class Kf extends Fn{constructor(e){super(e),this.expr=e}Fr(e,t){return J(e.value)!==J(t.value)||we(e.value)||we(t.value)?f.newValue(ie):f.newValue({booleanValue:fe(e.value,t.value)>0})}}class Gf extends Fn{constructor(e){super(e),this.expr=e}Fr(e,t){return J(e.value)!==J(t.value)||we(e.value)||we(t.value)?f.newValue(ie):Xe(e.value,t.value)==="EQ"?f.newValue(Ee):f.newValue({booleanValue:fe(e.value,t.value)>0})}}class Qf{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class jf{constructor(e){this.expr=e}evaluate(e,t){var s;E(this.expr.params.length===1,216);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return f.gr();case"ARRAY":{const i=((s=n.value.arrayValue)==null?void 0:s.values)??[];return f.newValue({arrayValue:{values:[...i].reverse()}})}default:return f.mr()}}}class Wf{constructor(e){this.expr=e}evaluate(e,t){return E(this.expr.params.length===2,52884),new nl(new g("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class Hf{constructor(e){this.expr=e}evaluate(e,t){var u,c,l,h;E(this.expr.params.length===2,1392);let n=!1;const s=x(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return f.mr()}const i=x(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return f.mr()}if(n)return f.gr();const a=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],o=((h=(l=s.value)==null?void 0:l.arrayValue)==null?void 0:h.values)??[];for(const d of a){let _=!1;n=!1;for(const y of o){switch(ve(d)&&ve(y)?"EQ":Xe(d,y)){case"EQ":_=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:V(44613,{value:y,search:d})}if(_)break}if(!_)return f.newValue(ie)}return f.newValue(Ee)}}class Yf{constructor(e){this.expr=e}evaluate(e,t){var u,c,l,h;E(this.expr.params.length===2,2680);let n=!1;const s=x(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return f.mr()}const i=x(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return f.mr()}if(n)return f.gr();const a=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],o=((h=(l=s.value)==null?void 0:l.arrayValue)==null?void 0:h.values)??[];for(const d of o)for(const _ of a)switch(ve(d)&&ve(_)?"EQ":Xe(d,_)){case"EQ":return f.newValue(Ee);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:V(60403,{value:d,search:_})}return n?f.gr():f.newValue(ie)}}class Jf{constructor(e){this.expr=e}evaluate(e,t){var s,i,a;E(this.expr.params.length===1,38605);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return f.gr();case"ARRAY":return f.newValue({integerValue:`${((a=(i=(s=n.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:a.length)??0}`});default:return f.mr()}}}class Xf{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class Zf{constructor(e){this.expr=e}evaluate(e,t){var s,i;E(this.expr.params.length===1,1508);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return f.gr();case"BYTES":{const a=(s=n.value)==null?void 0:s.bytesValue;if(typeof a=="string"){const o=K.fromBase64String(a).toUint8Array();return o.reverse(),f.newValue({bytesValue:K.fromUint8Array(o).toBase64()})}return f.newValue({bytesValue:new Uint8Array(a).reverse()})}case"STRING":{const a=(i=n.value)==null?void 0:i.stringValue,o=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(a),u=Array.from(o,(c=>c.segment)).reverse();return f.newValue({stringValue:u.join("")})}default:return f.mr()}}}class em{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class tm{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class nm{constructor(e){this.expr=e}evaluate(e,t){E(this.expr.params.length===1,19400);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return f.gr();case"STRING":{const s=(function(a){let o=0;for(let u=0;u<a.length;u++){const c=a.codePointAt(u);if(c===void 0)return;if(c<=65535)if(c>=55296&&c<=57343)if(c<=56319){const l=a.codePointAt(u+1);l!==void 0&&l>=56320&&l<=57343?(o+=1,u++):o+=1}else o+=1;else o+=1;else{if(!(c<=1114111))return;o+=1,u++}}return o})(n.value.stringValue);return s===void 0?f.mr():f.newValue({integerValue:s})}default:return f.mr()}}}class rm{constructor(e){this.expr=e}evaluate(e,t){var s,i;E(this.expr.params.length===1,8486);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BYTES":{const a=(s=n.value)==null?void 0:s.bytesValue;return typeof a=="string"?f.newValue({integerValue:K.fromBase64String(a).toUint8Array().length}):f.newValue({integerValue:new Uint8Array(a).length})}case"STRING":{const a=(function(u){let c=0;for(let l=0;l<u.length;l++){const h=u.codePointAt(l);if(h===void 0)return;if(h>=55296&&h<=57343){if(!(h<=56319))return;{const d=u.codePointAt(l+1);if(d===void 0||!(d>=56320&&d<=57343))return;c+=4,l++}}else if(h<=127)c+=1;else if(h<=2047)c+=2;else if(h<=65535)c+=3;else{if(!(h<=1114111))return;c+=4,l++}}return c})((i=n.value)==null?void 0:i.stringValue);return a===void 0?f.mr():f.newValue({integerValue:a})}case"NULL":return f.gr();default:return f.mr()}}}class Un{constructor(e){this.expr=e}evaluate(e,t){var a,o;E(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let n=!1;const s=x(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":n=!0;break;default:return f.mr()}const i=x(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":n=!0;break;default:return f.mr()}return n?f.gr():this.Or((a=s.value)==null?void 0:a.stringValue,(o=i.value)==null?void 0:o.stringValue)}}class sm extends Un{Or(e,t){try{const n=(function(a){let o="";for(let u=0;u<a.length;u++){const c=a.charAt(u);switch(c){case"_":o+=".";break;case"%":o+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":o+="\\"+c;break;default:o+=c}}return"^"+o+"$"})(t),s=Hi.compile(n);return f.newValue({booleanValue:s.matches(e)})}catch(n){return Ce(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${n}`),f.mr()}}}class im extends Un{Or(e,t){try{const n=Hi.compile(t);return f.newValue({booleanValue:n.test(e)})}catch{return Ce(`Invalid regex pattern found in regex_contains: ${t}, returning error`),f.mr()}}}class am extends Un{Or(e,t){try{return f.newValue({booleanValue:Hi.compile(t).matches(e)})}catch{return Ce(`Invalid regex pattern found in regex_match: ${t}, returning error`),f.mr()}}}class om extends Un{Or(e,t){return f.newValue({booleanValue:e.includes(t)})}}class um extends Un{Or(e,t){return f.newValue({booleanValue:e.startsWith(t)})}}class cm extends Un{Or(e,t){return f.newValue({booleanValue:e.endsWith(t)})}}class lm{constructor(e){this.expr=e}evaluate(e,t){var s,i;E(this.expr.params.length===1,29079);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return f.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return f.gr();default:return f.mr()}}}class hm{constructor(e){this.expr=e}evaluate(e,t){var s,i;E(this.expr.params.length===1,60487);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return f.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return f.gr();default:return f.mr()}}}class dm{constructor(e){this.expr=e}evaluate(e,t){var s,i;E(this.expr.params.length===1,28544);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return f.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return f.gr();default:return f.mr()}}}class fm{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((a=>x(a).evaluate(e,t)));let s="",i=!1;for(const a of n)switch(a.type){case"STRING":s+=a.value.stringValue;break;case"NULL":i=!0;break;default:return f.mr()}return i?f.gr():f.newValue({stringValue:s})}}class mm{constructor(e){this.expr=e}evaluate(e,t){var a,o,u,c;E(this.expr.params.length===2,4483);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"UNSET":return f.pr();case"MAP":break;default:return f.mr()}const s=x(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return f.mr();const i=(c=(o=(a=n.value)==null?void 0:a.mapValue)==null?void 0:o.fields)==null?void 0:c[(u=s.value)==null?void 0:u.stringValue];return i===void 0?f.pr():f.newValue(i)}}class Aa{constructor(e){this.expr=e}evaluate(e,t){var c,l;E(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let n=!1;const s=x(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":n=!0;break;default:return f.mr()}const i=x(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":n=!0;break;default:return f.mr()}if(n)return f.gr();const a=Ii(s.value),o=Ii(i.value);if(a===void 0||o===void 0||((c=a.values)==null?void 0:c.length)!==((l=o.values)==null?void 0:l.length))return f.mr();const u=this.Mr(a,o);return u===void 0||isNaN(u)?f.mr():f.newValue({doubleValue:u})}}class _m extends Aa{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return;let i=0,a=0,o=0;for(let c=0;c<n.length;c++){if(!dt(n[c])||!dt(s[c]))return;const l=ce(n[c]),h=ce(s[c]);i+=l*h,a+=l*l,o+=h*h}const u=Math.sqrt(a)*Math.sqrt(o);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class pm extends Aa{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let a=0;a<n.length;a++){if(!dt(n[a])||!dt(s[a]))return;i+=ce(n[a])*ce(s[a])}return i}}class gm extends Aa{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let a=0;a<n.length;a++){if(!dt(n[a])||!dt(s[a]))return;const o=ce(n[a]),u=ce(s[a]);i+=Math.pow(o-u,2)}return Math.sqrt(i)}}class ym{constructor(e){this.expr=e}evaluate(e,t){var s;E(this.expr.params.length===1,39044);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"VECTOR":{const i=Ii(n.value);return f.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return f.gr();default:return f.mr()}}}const Tr=BigInt(-62135596800),Er=BigInt(253402300799),gs=BigInt(1e3),ht=BigInt(1e6),Im=Tr*gs,Tm=Er*gs+BigInt(999),Em=Tr*ht,wm=Er*ht+BigInt(999999);function Va(r){return r>=Em&&r<=wm}function rl(r){return r>=Tr&&r<=Er}function wr(r,e){const t=BigInt(r);return!(t<Tr||t>Er)&&!(e<0||e>=1e9)&&(t!==Tr||e===0)&&!(t===Er&&e>999999999)}function sl(r,e){return e<0?{seconds:r-1,nanos:e+1e9}:{seconds:r,nanos:e}}function va(r){return BigInt(r.seconds)*ht+BigInt(Math.trunc(r.nanoseconds/1e3))}class Ra{constructor(e){this.expr=e}evaluate(e,t){E(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return this.toTimestamp(BigInt(n.value.integerValue));case"NULL":return f.gr();default:return f.mr()}}}class Am extends Ra{toTimestamp(e){if(!Va(e))return f.mr();let t=Number(e/ht),n=Number(e%ht*BigInt(1e3));const s=sl(t,n);return t=s.seconds,n=s.nanos,wr(t,n)?f.newValue({timestampValue:{seconds:t,nanos:n}}):f.mr()}}class Vm extends Ra{toTimestamp(e){if(!(function(a){return a>=Im&&a<=Tm})(e))return f.mr();let t=Number(e/gs),n=Number(e%gs*BigInt(1e6));const s=sl(t,n);return t=s.seconds,n=s.nanos,wr(t,n)?f.newValue({timestampValue:{seconds:t,nanos:n}}):f.mr()}}class vm extends Ra{toTimestamp(e){if(!rl(e))return f.mr();const t=Number(e);return f.newValue({timestampValue:{seconds:t,nanos:0}})}}class Pa{constructor(e){this.expr=e}evaluate(e,t){E(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const n=x(this.expr.params[0]).evaluate(e,t);switch(n.type){case"TIMESTAMP":break;case"NULL":return f.gr();default:return f.mr()}const s=ha(n.value.timestampValue);return wr(s.seconds,s.nanoseconds)?this.Nr(s):f.mr()}}class Rm extends Pa{Nr(e){const t=va(e);return Va(t)?f.newValue({integerValue:`${t.toString()}`}):f.mr()}}class Pm extends Pa{Nr(e){const t=va(e),n=t/BigInt(1e3),s=t%BigInt(1e3);return n>BigInt(0)||s===BigInt(0)?f.newValue({integerValue:n.toString()}):f.newValue({integerValue:(n-BigInt(1)).toString()})}}class bm extends Pa{Nr(e){const t=BigInt(e.seconds);return rl(t)?f.newValue({integerValue:t.toString()}):f.mr()}}class il{constructor(e){this.expr=e}evaluate(e,t){E(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let n=!1;const s=x(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":n=!0;break;default:return f.mr()}const i=x(this.expr.params[1]).evaluate(e,t);let a;switch(i.type){case"STRING":if(a=(function(D){switch(D){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),a===void 0)return f.mr();break;case"NULL":n=!0;break;default:return f.mr()}const o=x(this.expr.params[2]).evaluate(e,t);switch(o.type){case"INT":break;case"NULL":n=!0;break;default:return f.mr()}if(n)return f.gr();const u=BigInt(o.value.integerValue);let c;try{switch(a){case"microsecond":c=u;break;case"millisecond":c=u*BigInt(1e3);break;case"second":c=u*BigInt(1e6);break;case"minute":c=u*BigInt(6e7);break;case"hour":c=u*BigInt(36e8);break;case"day":c=u*BigInt(864e8);break;default:return f.mr()}if(a!=="microsecond"&&u!==BigInt(0)&&c/u!==BigInt(this.Lr(a)))return f.mr()}catch(k){return Ce(`Error during timestamp arithmetic: ${k}`),f.mr()}const l=ha(s.value.timestampValue);if(!wr(l.seconds,l.nanoseconds))return f.mr();const h=va(l),d=this.Br(h,c);if(!Va(d))return f.mr();const _=Number(d/ht),y=d%ht,v=Number((y<0?y+ht:y)*BigInt(1e3)),P=y<0?_-1:_;return wr(P,v)?f.newValue({timestampValue:{seconds:P,nanos:v}}):f.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class xm extends il{Br(e,t){return e+t}}class Sm extends il{Br(e,t){return e-t}}function Ar(r){if((r=tl(r))instanceof Mn)return`fld(${r.fieldName})`;if(r instanceof Yt)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof j?`ref(${t.path})`:t instanceof Te?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(r.value)})`;if(r instanceof g)return`fn(${r.name},[${r.params.map(Ar).join(",")}])`;if(r.expressionType==="ListOfExpressions")return`list([${r.cr.map(Ar).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(r,null,2)}`)}function Cm(r){if(r instanceof Jc)return`${r._name}(${Qr(r.fields)})`;if(r instanceof Xc){let e=`${r._name}(${Qr(r.accumulators)})`;return r.groups.size>0&&(e+=`grouping(${Qr(r.groups)})`),e}if(r instanceof Zc)return`${r._name}(${Qr(r.groups)})`;if(r instanceof Lr)return`${r._name}(${r.hr})`;if(r instanceof Mr)return`${r._name}(${r.collectionId})`;if(r instanceof Bs)return`${r._name}()`;if(r instanceof qs)return`${r._name}(${r.Tr.sort()})`;if(r instanceof $s)return`${r._name}(${Ar(r.condition)})`;if(r instanceof Vn)return`${r._name}(${r.limit})`;if(r instanceof zs)return`${r._name}(${(function(t){return t.map((n=>`${Ar(n.expr)}${n.direction}`)).join(",")})(r.orderings)})`;throw new Error(`Unrecognized stage ${r._name}`)}function Qr(r){return`${Array.from(r.entries()).sort().map((([e,t])=>`${e}=${Ar(t)}`)).join(",")}`}function He(r){return r.stages.map((e=>Cm(e))).join("|")}function al(r,e){return He(r)===He(e)}function Q(r){return r instanceof pe}function $o(r){return Q(r)?He(r):nr(r)}function ol(r){return Q(r)?He(r):(function(t){return`${ds(Re(t))}|lt:${t.limitType}`})(r)}function Gs(r,e){return r instanceof pe&&e instanceof pe?al(r,e):!(r instanceof pe&&!(e instanceof pe)||!(r instanceof pe)&&e instanceof pe)&&sd(r,e)}function Qs(r){return Qe(r)?He(r):ds(r)}function ba(r,e){return r instanceof pe&&e instanceof pe?al(r,e):!(r instanceof pe&&!(e instanceof pe)||!(r instanceof pe)&&e instanceof pe)&&aa(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xa{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&Qh(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=er(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=er(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=hc();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let o=this.applyToLocalView(a,i.mutatedFields);o=t.has(s.key)?null:o;const u=Wu(a,o);u!==null&&n.set(s.key,u),a.isValidDocument()||a.convertToNoDocument(b.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),C())}isEqual(e){return this.batchId===e.batchId&&fn(this.mutations,e.mutations,((t,n)=>go(t,n)))&&fn(this.baseMutations,e.baseMutations,((t,n)=>go(t,n)))}}class Sa{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){E(e.mutations.length===n.length,58842,{Ur:e.mutations.length,kr:n.length});let s=(function(){return cd})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,n[a].version);return new Sa(e,t,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ys="";function de(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=zo(e)),e=Nm(r.get(t),e);return zo(e)}function Nm(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case ys:t+="";break;default:t+=i}}return t}function zo(r){return r+ys+""}function Ue(r){const e=r.length;if(E(e>=2,64408,{path:r}),e===2)return E(r.charAt(0)===ys&&r.charAt(1)==="",56145,{path:r}),N.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const a=r.indexOf(ys,i);switch((a<0||a>t)&&V(50515,{path:r}),r.charAt(a+1)){case"":const o=r.substring(i,a);let u;s.length===0?u=o:(s+=o,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,a),s+="\0";break;case"":s+=r.substring(i,a+1);break;default:V(61167,{path:r})}i=a+2}return new N(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vt="remoteDocuments",Br="owner",Zt="owner",Vr="mutationQueues",Dm="userId",De="mutations",Ko="batchId",Nt="userMutationsIndex",Go=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ns(r,e){return[r,de(e)]}function ul(r,e,t){return[r,de(e),t]}const km={},vn="documentMutations",Is="remoteDocumentsV14",Om=["prefixPath","collectionGroup","readTime","documentId"],rs="documentKeyIndex",Lm=["prefixPath","collectionGroup","documentId"],cl="collectionGroupIndex",Mm=["collectionGroup","readTime","prefixPath","documentId"],vr="remoteDocumentGlobal",Ci="remoteDocumentGlobalKey",Rn="targets",ll="queryTargetsIndex",Fm=["canonicalId","targetId"],Pn="targetDocuments",Um=["targetId","path"],Ca="documentTargetsIndex",Bm=["path","targetId"],Ts="targetGlobalKey",Ft="targetGlobal",Rr="collectionParents",qm=["collectionId","parent"],bn="clientMetadata",$m="clientId",js="bundles",zm="bundleId",Ws="namedQueries",Km="name",Na="indexConfiguration",Gm="indexId",Ni="collectionGroupIndex",Qm="collectionGroup",ar="indexState",jm=["indexId","uid"],hl="sequenceNumberIndex",Wm=["uid","sequenceNumber"],or="indexEntries",Hm=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],dl="documentKeyIndex",Ym=["indexId","uid","orderedDocumentKey"],Hs="documentOverlays",Jm=["userId","collectionPath","documentId"],Di="collectionPathOverlayIndex",Xm=["userId","collectionPath","largestBatchId"],fl="collectionGroupOverlayIndex",Zm=["userId","collectionGroup","largestBatchId"],Da="globals",e_="name",ml=[Vr,De,vn,vt,Rn,Br,Ft,Pn,bn,vr,Rr,js,Ws],t_=[...ml,Hs],_l=[Vr,De,vn,Is,Rn,Br,Ft,Pn,bn,vr,Rr,js,Ws,Hs],pl=_l,ka=[...pl,Na,ar,or],n_=ka,gl=[...ka,Da],r_=gl;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yl(r,e,t){const n=r.store(De),s=r.store(vn),i=[],a=IDBKeyRange.only(t.batchId);let o=0;const u=n.Hn({range:a},((l,h,d)=>(o++,d.delete())));i.push(u.next((()=>{E(o===1,47070,{batchId:t.batchId})})));const c=[];for(const l of t.mutations){const h=ul(e,l.key.path,t.batchId);i.push(s.delete(h)),c.push(l.key)}return m.waitFor(i).next((()=>c))}function Es(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw V(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki extends kc{constructor(e,t){super(),this.qr=e,this.currentSequenceNumber=t}}function te(r,e){const t=R(r);return ct.Cn(t.qr,e)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oa{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e,t,n,s,i=b.min(),a=b.min(),o=K.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=o,this.expectedCount=u}withSequenceNumber(e){return new Be(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Be(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Be(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Be(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e){this.$r=e}}function s_(r,e){let t;if(e.document)t=Id(r.$r,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=A.fromSegments(e.noDocument.path),s=Qt(e.noDocument.readTime);t=G.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return V(56709);{const n=A.fromSegments(e.unknownDocument.path),s=Qt(e.unknownDocument.version);t=G.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new F(s[0],s[1]);return b.fromTimestamp(i)})(e.readTime)),t}function Qo(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:ws(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,a){return{name:gr(i,a.key),fields:a.data.value.mapValue.fields,updateTime:Lt(i,a.version.toTimestamp()),createTime:Lt(i,a.createTime.toTimestamp())}})(r.$r,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:Gt(e.version)};else{if(!e.isUnknownDocument())return V(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:Gt(e.version)}}return n}function ws(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function Gt(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Qt(r){const e=new F(r.seconds,r.nanoseconds);return b.fromTimestamp(e)}function bt(r,e){const t=(e.baseMutations||[]).map((i=>xi(r.$r,i)));for(let i=0;i<e.mutations.length-1;++i){const a=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const o=e.mutations[i+1];a.updateTransforms=o.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>xi(r.$r,i))),s=F.fromMillis(e.localWriteTimeMs);return new xa(e.batchId,s,t,n)}function Jn(r,e){const t=Qt(e.readTime),n=e.lastLimboFreeSnapshotVersion!==void 0?Qt(e.lastLimboFreeSnapshotVersion):b.min();let s;return s=(function(a){return a.structuredPipeline!==void 0})(e.query)?(function(a,o){var l,h;const u=a.structuredPipeline;E((((l=u==null?void 0:u.pipeline)==null?void 0:l.stages)??[]).length>0,1845);const c=(h=u==null?void 0:u.pipeline)==null?void 0:h.stages.map(i_);return new pe(o,c)})(e.query,r.$r):(function(a){return a.documents!==void 0})(e.query)?(function(a){const o=a.documents.length;return E(o===1,1966,{count:o}),Re(Dr(gc(a.documents[0])))})(e.query):(function(a){return Re(Ec(a))})(e.query),new Be(s,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,K.fromBase64String(e.resumeToken))}function Tl(r,e){const t=Gt(e.snapshotVersion),n=Gt(e.lastLimboFreeSnapshotVersion);let s;s=Qe(e.target)?wc(r.$r,e.target):oa(e.target)?Ic(r.$r,e.target):Tc(r.$r,e.target).Se;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Qs(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function El(r){const e=Ec({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?vi(e,e.limit,"L"):e}function jr(r,e){return new Oa(e.largestBatchId,xi(r.$r,e.overlayMutation))}function jo(r,e){const t=e.path.lastSegment();return[r,de(e.path.popLast()),t]}function Wo(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:Gt(n.readTime),documentKey:de(n.documentKey.path),largestBatchId:n.largestBatchId}}function i_(r){switch(r.name){case"collection":return new Lr(r.args[0].referenceValue,{});case"collection_group":return new Mr(r.args[1].stringValue,{});case"database":return new Bs({});case"documents":return new qs(r.args.map((e=>e.referenceValue)),{});case"where":return new $s(Oi(r.args[0]),{});case"limit":{const e=r.args[0].integerValue??r.args[0].doubleValue;return new Vn(typeof e=="number"?e:Number(e),{})}case"sort":return new zs(r.args.map((e=>(function(n){var i,a;const s=(i=n.mapValue)==null?void 0:i.fields;return new Ia(Oi(s.expression),(a=s.direction)==null?void 0:a.stringValue,"orderingFromProto")})(e))),{});default:throw new Error(`Stage type: ${r.name} not supported.`)}}function Oi(r){return r.fieldReferenceValue?new Mn(_t("_exprFromProto",r.fieldReferenceValue),"_exprFromProto"):r.functionValue?(function(t){var n;return new g(t.functionValue.name,((n=t.functionValue.args)==null?void 0:n.map(Oi))||[])})(r):Yt._fromProto(r)}class Ys{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Kr={}}static Qr(e,t,n,s){E(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new Ys(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return rt(e).Hn({index:Nt,range:n},((s,i,a)=>{t=!1,a.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=ln(e),a=rt(e);return a.add({}).next((o=>{E(typeof o=="number",49019);const u=new xa(o,t,n,s),c=(function(_,y,v){const P=v.baseMutations.map((D=>ms(_.$r,D))),k=v.mutations.map((D=>ms(_.$r,D)));return{userId:y,batchId:v.batchId,localWriteTimeMs:v.localWriteTime.toMillis(),baseMutations:P,mutations:k}})(this.serializer,this.userId,u),l=[];let h=new U(((d,_)=>S(d.canonicalString(),_.canonicalString())));for(const d of s){const _=ul(this.userId,d.key.path,o);h=h.add(d.key.path.popLast()),l.push(a.put(c)),l.push(i.put(_,km))}return h.forEach((d=>{l.push(this.indexManager.addToCollectionParentIndex(e,d))})),e.addOnCommittedListener((()=>{this.Kr[o]=u.keys()})),m.waitFor(l).next((()=>u))}))}lookupMutationBatch(e,t){return rt(e).get(t).next((n=>n?(E(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),bt(this.serializer,n)):null))}Wr(e,t){return this.Kr[t]?m.resolve(this.Kr[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.Kr[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return rt(e).Hn({index:Nt,range:s},((a,o,u)=>{o.userId===this.userId&&(E(o.batchId>=n,47524,{Gr:n}),i=bt(this.serializer,o)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=kt;return rt(e).Hn({index:Nt,range:t,reverse:!0},((s,i,a)=>{n=i.batchId,a.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,kt],[this.userId,Number.POSITIVE_INFINITY]);return rt(e).Qn(Nt,t).next((n=>n.map((s=>bt(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=ns(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return ln(e).Hn({range:s},((a,o,u)=>{const[c,l,h]=a,d=Ue(l);if(c===this.userId&&t.path.isEqual(d))return rt(e).get(h).next((_=>{if(!_)throw V(61480,{zr:a,batchId:h});E(_.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:_.userId,batchId:h}),i.push(bt(this.serializer,_))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new U(S);const s=[];return t.forEach((i=>{const a=ns(this.userId,i.path),o=IDBKeyRange.lowerBound(a),u=ln(e).Hn({range:o},((c,l,h)=>{const[d,_,y]=c,v=Ue(_);d===this.userId&&i.path.isEqual(v)?n=n.add(y):h.done()}));s.push(u)})),m.waitFor(s).next((()=>this.jr(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=ns(this.userId,n),a=IDBKeyRange.lowerBound(i);let o=new U(S);return ln(e).Hn({range:a},((u,c,l)=>{const[h,d,_]=u,y=Ue(d);h===this.userId&&n.isPrefixOf(y)?y.length===s&&(o=o.add(_)):l.done()})).next((()=>this.jr(e,o)))}jr(e,t){const n=[],s=[];return t.forEach((i=>{s.push(rt(e).get(i).next((a=>{if(a===null)throw V(35274,{batchId:i});E(a.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:a.userId,batchId:i}),n.push(bt(this.serializer,a))})))})),m.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return yl(e.qr,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.Hr(t.batchId)})),m.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}Hr(e){delete this.Kr[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return m.resolve();const n=IDBKeyRange.lowerBound((function(a){return[a]})(this.userId)),s=[];return ln(e).Hn({range:n},((i,a,o)=>{if(i[0]===this.userId){const u=Ue(i[1]);s.push(u)}else o.done()})).next((()=>{E(s.length===0,56720,{Jr:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return wl(e,this.userId,t)}Yr(e){return Al(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:kt,lastStreamToken:""}))}}function wl(r,e,t){const n=ns(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let a=!1;return ln(r).Hn({range:i,jn:!0},((o,u,c)=>{const[l,h,d]=o;l===e&&h===s&&(a=!0),c.done()})).next((()=>a))}function rt(r){return te(r,De)}function ln(r){return te(r,vn)}function Al(r){return te(r,Vr)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{getBundleMetadata(e,t){return Ho(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:Qt(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return Ho(e).put((function(s){return{bundleId:s.id,createTime:Gt(ge(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return Yo(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:El(i.bundledQuery),readTime:Qt(i.readTime)}})(n)}))}saveNamedQuery(e,t){return Yo(e).put((function(s){return{name:s.name,readTime:Gt(ge(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function Ho(r){return te(r,js)}function Yo(r){return te(r,Ws)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Js{constructor(e,t){this.serializer=e,this.userId=t}static Qr(e,t){const n=t.uid||"";return new Js(e,n)}getOverlay(e,t){return en(e).get(jo(this.userId,t)).next((n=>n?jr(this.serializer,n):null))}getOverlays(e,t){const n=xe();return m.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=xe();return en(e).Hn(((s,i)=>{const a=jr(this.serializer,i);a.largestBatchId>t&&n.set(a.getKey(),a)})).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,a)=>{const o=new Oa(t,a);s.push(this.Zr(e,o))})),m.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((a=>s.add(de(a.getCollectionPath()))));const i=[];return s.forEach((a=>{const o=IDBKeyRange.bound([this.userId,a,n],[this.userId,a,n+1],!1,!0);i.push(en(e).zn(Di,o))})),m.waitFor(i)}getOverlaysForCollection(e,t,n){const s=xe(),i=de(t),a=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return en(e).Qn(Di,a).next((o=>{for(const u of o){const c=jr(this.serializer,u);s.set(c.getKey(),c)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=xe();let a;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return en(e).Hn({index:fl,range:o},((u,c,l)=>{const h=jr(this.serializer,c);i.size()<s||h.largestBatchId===a?(i.set(h.getKey(),h),a=h.largestBatchId):l.done()})).next((()=>i))}Zr(e,t){return en(e).put((function(s,i,a){const[o,u,c]=jo(i,a.mutation.key);return{userId:i,collectionPath:u,documentId:c,collectionGroup:a.mutation.key.getCollectionGroup(),largestBatchId:a.largestBatchId,overlayMutation:ms(s.$r,a.mutation)}})(this.serializer,this.userId,t))}}function en(r){return te(r,Hs)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{Xr(e){return te(e,Da)}getSessionToken(e){return this.Xr(e).get("sessionToken").next((t=>{const n=t==null?void 0:t.value;return n?K.fromUint8Array(n):K.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.Xr(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(){}ei(e,t){this.ti(e,t),t.ni()}ti(e,t){if("nullValue"in e)this.ri(t,5);else if("booleanValue"in e)this.ri(t,10),t.ii(e.booleanValue?1:0);else if("integerValue"in e)this.ri(t,15),t.ii($(e.integerValue));else if("doubleValue"in e){const n=$(e.doubleValue);isNaN(n)?this.ri(t,13):(this.ri(t,15),pn(n)?t.ii(0):t.ii(n))}else if("timestampValue"in e){let n=e.timestampValue;this.ri(t,20),typeof n=="string"&&(n=Ye(n)),t.si(`${n.seconds||""}`),t.ii(n.nanos||0)}else if("stringValue"in e)this._i(e.stringValue,t),this.oi(t);else if("bytesValue"in e)this.ri(t,30),t.ai(Je(e.bytesValue)),this.oi(t);else if("referenceValue"in e)this.ui(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.ri(t,45),t.ii(n.latitude||0),t.ii(n.longitude||0)}else"mapValue"in e?qu(e)?this.ri(t,Number.MAX_SAFE_INTEGER):Kt(e)?this.ci(e.mapValue,t):(this.li(e.mapValue,t),this.oi(t)):"arrayValue"in e?(this.Ei(e.arrayValue,t),this.oi(t)):V(19022,{hi:e})}_i(e,t){this.ri(t,25),this.Ti(e,t)}Ti(e,t){t.si(e)}li(e,t){const n=e.fields||{};this.ri(t,55);for(const s of Object.keys(n))this._i(s,t),this.ti(n[s],t)}ci(e,t){var a,o;const n=e.fields||{};this.ri(t,53);const s=zt,i=((o=(a=n[s].arrayValue)==null?void 0:a.values)==null?void 0:o.length)||0;this.ri(t,15),t.ii($(i)),this._i(s,t),this.ti(n[s],t)}Ei(e,t){const n=e.values||[];this.ri(t,50);for(const s of n)this.ti(s,t)}ui(e,t){this.ri(t,37),A.fromName(e).path.forEach((n=>{this.ri(t,60),this.Ti(n,t)}))}ri(e,t){e.ii(t)}oi(e){e.ii(2)}}xt.Pi=new xt;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tn=255;function u_(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function Jo(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const a=u_(255&n[i]);if(s+=a,a!==8)break}return s})(r);return Math.ceil(e/8)}class c_{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ii(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ri(n.value),n=t.next();this.Ai()}Vi(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.di(n.value),n=t.next();this.fi()}mi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ri(n);else if(n<2048)this.Ri(960|n>>>6),this.Ri(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ri(480|n>>>12),this.Ri(128|63&n>>>6),this.Ri(128|63&n);else{const s=t.codePointAt(0);this.Ri(240|s>>>18),this.Ri(128|63&s>>>12),this.Ri(128|63&s>>>6),this.Ri(128|63&s)}}this.Ai()}pi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.di(n);else if(n<2048)this.di(960|n>>>6),this.di(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.di(480|n>>>12),this.di(128|63&n>>>6),this.di(128|63&n);else{const s=t.codePointAt(0);this.di(240|s>>>18),this.di(128|63&s>>>12),this.di(128|63&s>>>6),this.di(128|63&s)}}this.fi()}gi(e){const t=this.yi(e),n=Jo(t);this.wi(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}bi(e){const t=this.yi(e),n=Jo(t);this.wi(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}Si(){this.Di(tn),this.Di(255)}xi(){this.Ci(tn),this.Ci(255)}reset(){this.position=0}seed(e){this.wi(e.length),this.buffer.set(e,this.position),this.position+=e.length}Fi(){return this.buffer.slice(0,this.position)}yi(e){const t=(function(i){const a=new DataView(new ArrayBuffer(8));return a.setFloat64(0,i,!1),new Uint8Array(a.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Ri(e){const t=255&e;t===0?(this.Di(0),this.Di(255)):t===tn?(this.Di(tn),this.Di(0)):this.Di(t)}di(e){const t=255&e;t===0?(this.Ci(0),this.Ci(255)):t===tn?(this.Ci(tn),this.Ci(0)):this.Ci(e)}Ai(){this.Di(0),this.Di(1)}fi(){this.Ci(0),this.Ci(1)}Di(e){this.wi(1),this.buffer[this.position++]=e}Ci(e){this.wi(1),this.buffer[this.position++]=~e}wi(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class l_{constructor(e){this.Oi=e}ai(e){this.Oi.Ii(e)}si(e){this.Oi.mi(e)}ii(e){this.Oi.gi(e)}ni(){this.Oi.Si()}}class h_{constructor(e){this.Oi=e}ai(e){this.Oi.Vi(e)}si(e){this.Oi.pi(e)}ii(e){this.Oi.bi(e)}ni(){this.Oi.xi()}}class Gn{constructor(){this.Oi=new c_,this.ascending=new l_(this.Oi),this.descending=new h_(this.Oi)}seed(e){this.Oi.seed(e)}Mi(e){return e===0?this.ascending:this.descending}Fi(){return this.Oi.Fi()}reset(){this.Oi.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e,t,n,s){this.Ni=e,this.Li=t,this.Bi=n,this.Ui=s}ki(){const e=this.Ui.length,t=e===0||this.Ui[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.Ui,0),t!==e?n.set([0],this.Ui.length):++n[n.length-1],new St(this.Ni,this.Li,this.Bi,n)}qi(e,t,n){return{indexId:this.Ni,uid:e,arrayValue:ss(this.Bi),directionalValue:ss(this.Ui),orderedDocumentKey:ss(t),documentKey:n.path.toArray()}}$i(e,t,n){const s=this.qi(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function st(r,e){let t=r.Ni-e.Ni;return t!==0?t:(t=Xo(r.Bi,e.Bi),t!==0?t:(t=Xo(r.Ui,e.Ui),t!==0?t:A.comparator(r.Li,e.Li)))}function Xo(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function ss(r){return Su()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function Zo(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class eu{constructor(e){this.Ki=new U(((t,n)=>ee.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.Qi=e.orderBy,this.Wi=[];for(const t of e.filters){const n=t;n.isInequality()?this.Ki=this.Ki.add(n):this.Wi.push(n)}}get Gi(){return this.Ki.size>1}zi(e){if(E(e.collectionGroup===this.collectionId,49279),this.Gi)return!1;const t=wi(e);if(t!==void 0&&!this.ji(t))return!1;const n=Vt(e);let s=new Set,i=0,a=0;for(;i<n.length&&this.ji(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Ki.size>0){const o=this.Ki.getIterator().getNext();if(!s.has(o.field.canonicalString())){const u=n[i];if(!this.Hi(o,u)||!this.Ji(this.Qi[a++],u))return!1}++i}for(;i<n.length;++i){const o=n[i];if(a>=this.Qi.length||!this.Ji(this.Qi[a++],o))return!1}return!0}Yi(){if(this.Gi)return null;let e=new U(ee.comparator);const t=[];for(const n of this.Wi)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new Zr(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Zr(n.field,0))}for(const n of this.Qi)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Zr(n.field,n.dir==="asc"?0:1)));return new hs(hs.UNKNOWN_ID,this.collectionId,t,pr.empty())}ji(e){for(const t of this.Wi)if(this.Hi(t,e))return!0;return!1}Hi(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}Ji(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vl(r){var t,n;if(E(r instanceof L||r instanceof B,20012),r instanceof L){if(r instanceof rc){const s=((n=(t=r.value.arrayValue)==null?void 0:t.values)==null?void 0:n.map((i=>L.create(r.field,"==",i))))||[];return B.create(s,"or")}return r}const e=r.filters.map((s=>Vl(s)));return B.create(e,r.op)}function d_(r){if(r.getFilters().length===0)return[];const e=Fi(Vl(r));return E(vl(e),7391),Li(e)||Mi(e)?[e]:e.getFilters()}function Li(r){return r instanceof L}function Mi(r){return r instanceof B&&sa(r)}function vl(r){return Li(r)||Mi(r)||(function(t){if(t instanceof B&&Ti(t)){for(const n of t.getFilters())if(!Li(n)&&!Mi(n))return!1;return!0}return!1})(r)}function Fi(r){if(E(r instanceof L||r instanceof B,34018),r instanceof L)return r;if(r.filters.length===1)return Fi(r.filters[0]);const e=r.filters.map((n=>Fi(n)));let t=B.create(e,r.op);return t=As(t),vl(t)?t:(E(t instanceof B,64498),E(wn(t),40251),E(t.filters.length>1,57927),t.filters.reduce(((n,s)=>La(n,s))))}function La(r,e){let t;return E(r instanceof L||r instanceof B,38388),E(e instanceof L||e instanceof B,25473),t=r instanceof L?e instanceof L?(function(s,i){return B.create([s,i],"and")})(r,e):tu(r,e):e instanceof L?tu(e,r):(function(s,i){if(E(s.filters.length>0&&i.filters.length>0,48005),wn(s)&&wn(i))return ec(s,i.getFilters());const a=Ti(s)?s:i,o=Ti(s)?i:s,u=a.filters.map((c=>La(c,o)));return B.create(u,"or")})(r,e),As(t)}function tu(r,e){if(wn(e))return ec(e,r.getFilters());{const t=e.filters.map((n=>La(r,n)));return B.create(t,"or")}}function As(r){if(E(r instanceof L||r instanceof B,11850),r instanceof L)return r;const e=r.getFilters();if(e.length===1)return As(e[0]);if(Xu(r))return r;const t=e.map((s=>As(s))),n=[];return t.forEach((s=>{s instanceof L?n.push(s):s instanceof B&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:B.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(){this.Zi=new Ma}addToCollectionParentIndex(e,t){return this.Zi.add(t),m.resolve()}getCollectionParents(e,t){return m.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return m.resolve()}deleteFieldIndex(e,t){return m.resolve()}deleteAllFieldIndexes(e){return m.resolve()}createTargetIndexes(e,t){return m.resolve()}getDocumentsMatchingTarget(e,t){return m.resolve(null)}getIndexType(e,t){return m.resolve(0)}getFieldIndexes(e,t){return m.resolve([])}getNextCollectionGroupToUpdate(e){return m.resolve(null)}getMinOffset(e,t){return m.resolve(Pe.min())}getMinOffsetFromCollectionGroup(e,t){return m.resolve(Pe.min())}updateCollectionGroup(e,t,n){return m.resolve()}updateIndexEntries(e,t){return m.resolve()}}class Ma{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new U(N.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new U(N.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nu="IndexedDbIndexManager",Wr=new Uint8Array(0);class m_{constructor(e,t){this.databaseId=t,this.Xi=new Ma,this.es=new tt((n=>ds(n)),((n,s)=>aa(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Xi.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.Xi.add(t)}));const i={collectionId:n,parent:de(s)};return ru(e).put(i)}return m.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[Nu(t),""],!1,!0);return ru(e).Qn(s).next((i=>{for(const a of i){if(a.collectionId!==t)break;n.push(Ue(a.parent))}return n}))}addFieldIndex(e,t){const n=Qn(e),s=(function(o){return{indexId:o.indexId,collectionGroup:o.collectionGroup,fields:o.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const a=rn(e);return i.next((o=>{a.put(Wo(o,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=Qn(e),s=rn(e),i=nn(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=Qn(e),n=nn(e),s=rn(e);return t.zn().next((()=>n.zn())).next((()=>s.zn()))}createTargetIndexes(e,t){return m.forEach(this.ts(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new eu(n).Yi();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=nn(e);let s=!0;const i=new Map;return m.forEach(this.ts(t),(a=>this.ns(e,a).next((o=>{s&&(s=!!o),i.set(a,o)})))).next((()=>{if(s){let a=C();const o=[];return m.forEach(i,((u,c)=>{I(nu,`Using index ${(function(O){return`id=${O.indexId}|cg=${O.collectionGroup}|f=${O.fields.map((ne=>`${ne.fieldPath}:${ne.kind}`)).join(",")}`})(u)} to execute ${ds(t)}`);const l=(function(O,ne){const z=wi(ne);if(z===void 0)return null;for(const X of fs(O,z.fieldPath))switch(X.op){case"array-contains-any":return X.value.arrayValue.values||[];case"array-contains":return[X.value]}return null})(c,u),h=(function(O,ne){const z=new Map;for(const X of Vt(ne))for(const _e of fs(O,X.fieldPath))switch(_e.op){case"==":case"in":z.set(X.fieldPath.canonicalString(),_e.value);break;case"not-in":case"!=":return z.set(X.fieldPath.canonicalString(),_e.value),Array.from(z.values())}return null})(c,u),d=(function(O,ne){const z=[];let X=!0;for(const _e of Vt(ne)){const nt=_e.kind===0?wo(O,_e.fieldPath,O.startAt):Ao(O,_e.fieldPath,O.startAt);z.push(nt.value),X&&(X=nt.inclusive)}return new En(z,X)})(c,u),_=(function(O,ne){const z=[];let X=!0;for(const _e of Vt(ne)){const nt=_e.kind===0?Ao(O,_e.fieldPath,O.endAt):wo(O,_e.fieldPath,O.endAt);z.push(nt.value),X&&(X=nt.inclusive)}return new En(z,X)})(c,u),y=this.rs(u,c,d),v=this.rs(u,c,_),P=this.ss(u,c,h),k=this._s(u.indexId,l,y,d.inclusive,v,_.inclusive,P);return m.forEach(k,(D=>n.Gn(D,t.limit).next((O=>{O.forEach((ne=>{const z=A.fromSegments(ne.documentKey);a.has(z)||(a=a.add(z),o.push(z))}))}))))})).next((()=>o))}return m.resolve(null)}))}ts(e){let t=this.es.get(e);return t||(e.filters.length===0?t=[e]:t=d_(B.create(e.filters,"and")).map((n=>Ai(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.es.set(e,t),t)}_s(e,t,n,s,i,a,o){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),c=u/(t!=null?t.length:1),l=[];for(let h=0;h<u;++h){const d=t?this.us(t[h/c]):Wr,_=this.cs(e,d,n[h%c],s),y=this.ls(e,d,i[h%c],a),v=o.map((P=>this.cs(e,d,P,!0)));l.push(...this.createRange(_,y,v))}return l}cs(e,t,n,s){const i=new St(e,A.empty(),t,n);return s?i:i.ki()}ls(e,t,n,s){const i=new St(e,A.empty(),t,n);return s?i.ki():i}ns(e,t){const n=new eu(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let a=null;for(const o of i)n.zi(o)&&(!a||o.fields.length>a.fields.length)&&(a=o);return a}))}getIndexType(e,t){let n=2;const s=this.ts(t);return m.forEach(s,(i=>this.ns(e,i).next((a=>{a?n!==0&&a.fields.length<(function(u){let c=new U(ee.comparator),l=!1;for(const h of u.filters)for(const d of h.getFlattenedFilters())d.field.isKeyField()||(d.op==="array-contains"||d.op==="array-contains-any"?l=!0:c=c.add(d.field));for(const h of u.orderBy)h.field.isKeyField()||(c=c.add(h.field));return c.size+(l?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(a){return a.limit!==null})(t)&&s.length>1&&n===2?1:n))}Es(e,t){const n=new Gn;for(const s of Vt(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const a=n.Mi(s.kind);xt.Pi.ei(i,a)}return n.Fi()}us(e){const t=new Gn;return xt.Pi.ei(e,t.Mi(0)),t.Fi()}hs(e,t){const n=new Gn;return xt.Pi.ei(dr(this.databaseId,t),n.Mi((function(i){const a=Vt(i);return a.length===0?0:a[a.length-1].kind})(e))),n.Fi()}ss(e,t,n){if(n===null)return[];let s=[];s.push(new Gn);let i=0;for(const a of Vt(e)){const o=n[i++];for(const u of s)if(this.Ts(t,a.fieldPath)&&ft(o))s=this.Ps(s,a,o);else{const c=u.Mi(a.kind);xt.Pi.ei(o,c)}}return this.Is(s)}rs(e,t,n){return this.ss(e,t,n.position)}Is(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].Fi();return t}Ps(e,t,n){const s=[...e],i=[];for(const a of n.arrayValue.values||[])for(const o of s){const u=new Gn;u.seed(o.Fi()),xt.Pi.ei(a,u.Mi(t.kind)),i.push(u)}return i}Ts(e,t){return!!e.filters.find((n=>n instanceof L&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=Qn(e),s=rn(e);return(t?n.Qn(Ni,IDBKeyRange.bound(t,t)):n.Qn()).next((i=>{const a=[];return m.forEach(i,(o=>s.get([o.indexId,this.uid]).next((u=>{a.push((function(l,h){const d=h?new pr(h.sequenceNumber,new Pe(Qt(h.readTime),new A(Ue(h.documentKey)),h.largestBatchId)):pr.empty(),_=l.fields.map((([y,v])=>new Zr(ee.fromServerFormat(y),v)));return new hs(l.indexId,l.collectionGroup,_,d)})(o,u))})))).next((()=>a))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:S(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=Qn(e),i=rn(e);return this.Rs(e).next((a=>s.Qn(Ni,IDBKeyRange.bound(t,t)).next((o=>m.forEach(o,(u=>i.put(Wo(u.indexId,this.uid,a,n))))))))}updateIndexEntries(e,t){const n=new Map;return m.forEach(t,((s,i)=>{const a=n.get(s.collectionGroup);return(a?m.resolve(a):this.getFieldIndexes(e,s.collectionGroup)).next((o=>(n.set(s.collectionGroup,o),m.forEach(o,(u=>this.As(e,s,u).next((c=>{const l=this.Vs(i,u);return c.isEqual(l)?m.resolve():this.ds(e,i,u,c,l)})))))))}))}fs(e,t,n,s){return nn(e).put(s.qi(this.uid,this.hs(n,t.key),t.key))}ps(e,t,n,s){return nn(e).delete(s.$i(this.uid,this.hs(n,t.key),t.key))}As(e,t,n){const s=nn(e);let i=new U(st);return s.Hn({index:dl,range:IDBKeyRange.only([n.indexId,this.uid,ss(this.hs(n,t))])},((a,o)=>{i=i.add(new St(n.indexId,t,Zo(o.arrayValue),Zo(o.directionalValue)))})).next((()=>i))}Vs(e,t){let n=new U(st);const s=this.Es(t,e);if(s==null)return n;const i=wi(t);if(i!=null){const a=e.data.field(i.fieldPath);if(ft(a))for(const o of a.arrayValue.values||[])n=n.add(new St(t.indexId,e.key,this.us(o),s))}else n=n.add(new St(t.indexId,e.key,Wr,s));return n}ds(e,t,n,s,i){I(nu,"Updating index entries for document '%s'",t.key);const a=[];return(function(u,c,l,h,d){const _=u.getIterator(),y=c.getIterator();let v=Xt(_),P=Xt(y);for(;v||P;){let k=!1,D=!1;if(v&&P){const O=l(v,P);O<0?D=!0:O>0&&(k=!0)}else v!=null?D=!0:k=!0;k?(h(P),P=Xt(y)):D?(d(v),v=Xt(_)):(v=Xt(_),P=Xt(y))}})(s,i,st,(o=>{a.push(this.fs(e,t,n,o))}),(o=>{a.push(this.ps(e,t,n,o))})),m.waitFor(a)}Rs(e){let t=1;return rn(e).Hn({index:hl,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((a,o)=>st(a,o))).filter(((a,o,u)=>!o||st(a,u[o-1])!==0));const s=[];s.push(e);for(const a of n){const o=st(a,e),u=st(a,t);if(o===0)s[0]=e.ki();else if(o>0&&u<0)s.push(a),s.push(a.ki());else if(u>0)break}s.push(t);const i=[];for(let a=0;a<s.length;a+=2){if(this.gs(s[a],s[a+1]))return[];const o=s[a].$i(this.uid,Wr,A.empty()),u=s[a+1].$i(this.uid,Wr,A.empty());i.push(IDBKeyRange.bound(o,u))}return i}gs(e,t){return st(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(su)}getMinOffset(e,t){return m.mapArray(this.ts(t),(n=>this.ns(e,n).next((s=>s||V(44426))))).next(su)}}function ru(r){return te(r,Rr)}function nn(r){return te(r,or)}function Qn(r){return te(r,Na)}function rn(r){return te(r,ar)}function su(r){E(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;ia(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new Pe(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new Ze(0)}static bs(){return new Ze(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class __{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.Ss(e).next((t=>{const n=new Ze(t.highestTargetId);return t.highestTargetId=n.next(),this.vs(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.Ss(e).next((t=>b.fromTimestamp(new F(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.Ss(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.Ss(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.vs(e,s))))}addTargetData(e,t){return this.Ds(e,t).next((()=>this.Ss(e).next((n=>(n.targetCount+=1,this.xs(t,n),this.vs(e,n))))))}updateTargetData(e,t){return this.Ds(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>sn(e).delete(t.targetId))).next((()=>this.Ss(e))).next((n=>(E(n.targetCount>0,8065),n.targetCount-=1,this.vs(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return sn(e).Hn(((a,o)=>{const u=Jn(this.serializer,o);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))})).next((()=>m.waitFor(i))).next((()=>s))}forEachTarget(e,t){return sn(e).Hn(((n,s)=>{const i=Jn(this.serializer,s);t(i)}))}Ss(e){return iu(e).get(Ts).next((t=>(E(t!==null,2888),t)))}vs(e,t){return iu(e).put(Ts,t)}Ds(e,t){return sn(e).put(Tl(this.serializer,t))}xs(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.Ss(e).next((t=>t.targetCount))}getTargetData(e,t){const n=Qs(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return sn(e).Hn({range:s,index:ll},((a,o,u)=>{const c=Jn(this.serializer,o);ba(t,c.target)&&(i=c,u.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=ot(e);return t.forEach((a=>{const o=de(a.path);s.push(i.put({targetId:n,path:o})),s.push(this.referenceDelegate.addReference(e,n,a))})),m.waitFor(s)}removeMatchingKeys(e,t,n){const s=ot(e);return m.forEach(t,(i=>{const a=de(i.path);return m.waitFor([s.delete([n,a]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=ot(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=ot(e);let i=C();return s.Hn({range:n,jn:!0},((a,o,u)=>{const c=Ue(a[1]),l=new A(c);i=i.add(l)})).next((()=>i))}containsKey(e,t){const n=de(t.path),s=IDBKeyRange.bound([n],[Nu(n)],!1,!0);let i=0;return ot(e).Hn({index:Ca,jn:!0,range:s},(([a,o],u,c)=>{a!==0&&(i++,c.done())})).next((()=>i>0))}ye(e,t){return sn(e).get(t).next((n=>n?Jn(this.serializer,n):null))}}function sn(r){return te(r,Rn)}function iu(r){return te(r,Ft)}function ot(r){return te(r,Pn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(e,t){this.db=e,this.garbageCollector=Fc(this,t)}ir(e){const t=this.Cs(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}Cs(e){let t=0;return this.sr(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}sr(e,t){return this.Fs(e,((n,s)=>t(s)))}addReference(e,t,n){return Hr(e,n)}removeReference(e,t,n){return Hr(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Hr(e,t)}Os(e,t){return(function(s,i){let a=!1;return Al(s).Jn((o=>wl(s,o,i).next((u=>(u&&(a=!0),m.resolve(!u)))))).next((()=>a))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Fs(e,((a,o)=>{if(o<=t){const u=this.Os(e,a).next((c=>{if(!c)return i++,n.getEntry(e,a).next((()=>(n.removeEntry(a,b.min()),ot(e).delete((function(h){return[0,de(h.path)]})(a)))))}));s.push(u)}})).next((()=>m.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Hr(e,t)}Fs(e,t){const n=ot(e);let s,i=Ie.wn;return n.Hn({index:Ca},(([a,o],{path:u,sequenceNumber:c})=>{a===0?(i!==Ie.wn&&t(new A(Ue(s)),i),i=c,s=u):i=Ie.wn})).next((()=>{i!==Ie.wn&&t(new A(Ue(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Hr(r,e){return ot(r).put((function(n,s){return{targetId:0,path:de(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}// Copyright 2024 Google LLC* @license
function Rl(r,e){var n;let t=e;for(const s of r.stages)t=g_({serializer:r.serializer,serverTimestampBehavior:(n=r.listenOptions)==null?void 0:n.serverTimestampBehavior},s,t);return t}function Xs(r,e){return Rl(r,[e]).length>0}function Pl(r,e){return Q(r)?Xs(r,e):Os(r,e)}function g_(r,e,t){if(e instanceof Lr)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()&&`/${o.key.getCollectionPath().canonicalString()}`===i.hr))})(0,e,t);if(e instanceof $s)return(function(s,i,a){return a.filter((o=>{const u=ir(x(i.condition).evaluate(s,o));return u!==void 0&&Ne(u,Ee)}))})(r,e,t);if(e instanceof Mr)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()&&o.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof Bs)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()))})(0,0,t);if(e instanceof qs)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()&&i.Pr.has(o.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Vn)return(function(s,i,a){return a.slice(0,i.limit)})(0,e,t);if(e instanceof zs)return(function(s,i,a){const o=i.orderings.map((u=>({Ms:x(u.expr),direction:u.direction})));return[...a].sort(((u,c)=>{for(const{Ms:l,direction:h}of o){const d=ir(l.evaluate(s,u)),_=ir(l.evaluate(s,c)),y=fe(d??qe,_??qe);if(y!==0)return h==="ascending"?y:-y}return 0}))})(r,e,t);throw new Error(`Unknown stage: ${e._name}`)}function Ui(r){const e=(function(n){for(let s=n.stages.length-1;s>=0;s--){const i=n.stages[s];if(i instanceof zs)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(r);return(t,n)=>{for(const s of e){const i=ir(x(s.expr).evaluate({serializer:r.serializer},t)),a=ir(x(s.expr).evaluate({serializer:r.serializer},n)),o=fe(i||qe,a||qe);if(o!==0)return s.direction==="ascending"?o:-o}return 0}}function ci(r){for(let e=r.stages.length-1;e>=0;e--){const t=r.stages[e];if(t instanceof Vn)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{constructor(){this.changes=new tt((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,G.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?m.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return it(e).put(n)}removeEntry(e,t,n){return it(e).delete((function(i,a){const o=i.path.toArray();return[o.slice(0,o.length-2),o[o.length-2],ws(a),o[o.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.Ns(e,n))))}getEntry(e,t){let n=G.newInvalidDocument(t);return it(e).Hn({index:rs,range:IDBKeyRange.only(jn(t))},((s,i)=>{n=this.Ls(t,i)})).next((()=>n))}Bs(e,t){let n={size:0,document:G.newInvalidDocument(t)};return it(e).Hn({index:rs,range:IDBKeyRange.only(jn(t))},((s,i)=>{n={document:this.Ls(t,i),size:Es(i)}})).next((()=>n))}getEntries(e,t){let n=Z();return this.Us(e,t,((s,i)=>{const a=this.Ls(s,i);n=n.insert(s,a)})).next((()=>n))}getAllEntries(e){let t=Z();return it(e).Hn(((n,s)=>{const i=this.Ls(A.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);t=t.insert(i.key,i)})).next((()=>t))}ks(e,t){let n=Z(),s=new q(A.comparator);return this.Us(e,t,((i,a)=>{const o=this.Ls(i,a);n=n.insert(i,o),s=s.insert(i,Es(a))})).next((()=>({documents:n,qs:s})))}Us(e,t,n){if(t.isEmpty())return m.resolve();let s=new U(uu);t.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(jn(s.first()),jn(s.last())),a=s.getIterator();let o=a.getNext();return it(e).Hn({index:rs,range:i},((u,c,l)=>{const h=A.fromSegments([...c.prefixPath,c.collectionGroup,c.documentId]);for(;o&&uu(o,h)<0;)n(o,null),o=a.getNext();o&&o.isEqual(h)&&(n(o,c),o=a.hasNext()?a.getNext():null),o?l.Kn(jn(o)):l.done()})).next((()=>{for(;o;)n(o,null),o=a.hasNext()?a.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const a=Q(t)?N.fromString(Fr(t)):t.path,o=[a.popLast().toArray(),a.lastSegment(),ws(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[a.popLast().toArray(),a.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return it(e).Qn(IDBKeyRange.bound(o,u,!0)).next((c=>{i==null||i.incrementDocumentReadCount(c.length);let l=Z();for(const h of c){const d=this.Ls(A.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);d.isFoundDocument()&&(Pl(t,d)||s.has(d.key))&&(l=l.insert(d.key,d))}return l}))}getAllFromCollectionGroup(e,t,n,s){let i=Z();const a=ou(t,n),o=ou(t,Pe.max());return it(e).Hn({index:cl,range:IDBKeyRange.bound(a,o,!0)},((u,c,l)=>{const h=this.Ls(A.fromSegments(c.prefixPath.concat(c.collectionGroup,c.documentId)),c);i=i.insert(h.key,h),i.size===s&&l.done()})).next((()=>i))}newChangeBuffer(e){return new I_(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return au(e).get(Ci).next((t=>(E(!!t,20021),t)))}Ns(e,t){return au(e).put(Ci,t)}Ls(e,t){if(t){const n=s_(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(b.min())))return n}return G.newInvalidDocument(e)}}function xl(r){return new y_(r)}class I_ extends bl{constructor(e,t){super(),this.$s=e,this.trackRemovals=t,this.Ks=new tt((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new U(((i,a)=>S(i.canonicalString(),a.canonicalString())));return this.changes.forEach(((i,a)=>{const o=this.Ks.get(i);if(t.push(this.$s.removeEntry(e,i,o.readTime)),a.isValidDocument()){const u=Qo(this.$s.serializer,a);s=s.add(i.path.popLast());const c=Es(u);n+=c-o.size,t.push(this.$s.addEntry(e,i,u))}else if(n-=o.size,this.trackRemovals){const u=Qo(this.$s.serializer,a.convertToNoDocument(b.min()));t.push(this.$s.addEntry(e,i,u))}})),s.forEach((i=>{t.push(this.$s.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.$s.updateMetadata(e,n)),m.waitFor(t)}getFromCache(e,t){return this.$s.Bs(e,t).next((n=>(this.Ks.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.$s.ks(e,t).next((({documents:n,qs:s})=>(s.forEach(((i,a)=>{this.Ks.set(i,{size:a,readTime:n.get(i).readTime})})),n)))}}function au(r){return te(r,vr)}function it(r){return te(r,Is)}function jn(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function ou(r,e){const t=e.documentKey.path.toArray();return[r,ws(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function uu(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=S(t[i],n[i]),s)return s;return s=S(t.length,n.length),s||(s=S(t[t.length-2],n[n.length-2]),s||S(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T_{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sl{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&er(n.mutation,s,ye.empty(),F.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,C()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=C()){const s=xe();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let a=Rt();return i.forEach(((o,u)=>{a=a.insert(o,u.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const n=xe();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,C())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,o)=>{t.set(a,o)}))}))}computeViews(e,t,n,s){let i=Z();const a=rr(),o=(function(){return rr()})();return t.forEach(((u,c)=>{const l=n.get(c.key);s.has(c.key)&&(l===void 0||l.mutation instanceof et)?i=i.insert(c.key,c):l!==void 0?(a.set(c.key,l.mutation.getFieldMask()),er(l.mutation,c,l.mutation.getFieldMask(),F.now())):a.set(c.key,ye.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,l)=>a.set(c,l))),t.forEach(((c,l)=>o.set(c,new T_(l,a.get(c)??null)))),o)))}recalculateAndSaveOverlays(e,t){const n=rr();let s=new q(((a,o)=>a-o)),i=C();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const o of a)o.keys().forEach((u=>{const c=t.get(u);if(c===null)return;let l=n.get(u)||ye.empty();l=o.applyToLocalView(c,l),n.set(u,l);const h=(s.get(o.batchId)||C()).add(u);s=s.insert(o.batchId,h)}))})).next((()=>{const a=[],o=s.getReverseIterator();for(;o.hasNext();){const u=o.getNext(),c=u.key,l=u.value,h=hc();l.forEach((d=>{if(!i.has(d)){const _=Wu(t.get(d),n.get(d));_!==null&&h.set(d,_),i=i.add(d)}})),a.push(this.documentOverlayCache.saveOverlays(e,c,h))}return m.waitFor(a)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return Q(t)?this.getDocumentsMatchingPipeline(e,t,n,s):nd(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):oc(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):m.resolve(xe());let o=An,u=i;return a.next((c=>m.forEach(c,((l,h)=>(o<h.largestBatchId&&(o=h.largestBatchId),i.get(l)?m.resolve():this.remoteDocumentCache.getEntry(e,l).next((d=>{u=u.insert(l,d)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,C()))).next((l=>({batchId:o,changes:lc(l)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new A(t)).next((n=>{let s=Rt();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let a=Rt();return this.indexManager.getCollectionParents(e,i).next((o=>m.forEach(o,(u=>{const c=(function(h,d){return new On(d,null,h.explicitOrderBy.slice(),h.filters.slice(),h.limit,h.limitType,h.startAt,h.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,n,s).next((l=>{l.forEach(((h,d)=>{a=a.insert(h,d)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((a=>this.retrieveMatchingLocalDocuments(i,a,(o=>Os(t,o)))))}getDocumentsMatchingPipeline(e,t,n,s){if(We(t)==="collection_group"){const i=Ea(t);let a=Rt();return this.indexManager.getCollectionParents(e,i).next((o=>m.forEach(o,(u=>{const c=(function(h,d){const _=h.stages.map((y=>y instanceof Mr?new Lr(d.canonicalString(),{}):y));return new pe(h.serializer,_)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,c,n,s).next((l=>{l.forEach(((h,d)=>{a=a.insert(h,d)}))}))})).next((()=>a))))}{let i;return this.getOverlaysForPipeline(e,t,n.largestBatchId).next((a=>{switch(i=a,We(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s);case"documents":let o=C();for(const u of ps(t))o=o.add(A.fromPath(u));return this.remoteDocumentCache.getEntries(e,o);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new T("invalid-argument",`Invalid pipeline source to execute offline: ${He(t)}`)}})).next((a=>this.retrieveMatchingLocalDocuments(i,a,(o=>Xs(t,o)))))}}retrieveMatchingLocalDocuments(e,t,n){e.forEach(((i,a)=>{const o=a.getKey();t.get(o)===null&&(t=t.insert(o,G.newInvalidDocument(o)))}));let s=Rt();return t.forEach(((i,a)=>{const o=e.get(i);o!==void 0&&er(o.mutation,a,ye.empty(),F.now()),n(a)&&(s=s.insert(i,a))})),s}getOverlaysForPipeline(e,t,n){switch(We(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,N.fromString(Fr(t)),n);case"collection_group":throw new T("invalid-argument",`Unexpected collection group pipeline: ${He(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,ps(t).map((s=>A.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,n);default:throw new T("invalid-argument",`Failed to get overlays for pipeline: ${He(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E_{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return m.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:ge(s.createTime)}})(t)),m.resolve()}getNamedQuery(e,t){return m.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:El(s.bundledQuery),readTime:ge(s.readTime)}})(t)),m.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w_{constructor(){this.overlays=new q(A.comparator),this.Gs=new Map}getOverlay(e,t){return m.resolve(this.overlays.get(t))}getOverlays(e,t){const n=xe();return m.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=xe();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&n.set(s,i)})),m.resolve(n)}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.Zr(e,t,i)})),m.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Gs.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Gs.delete(n)),m.resolve()}getOverlaysForCollection(e,t,n){const s=xe(),i=t.length+1,a=new A(t.child("")),o=this.overlays.getIteratorFrom(a);for(;o.hasNext();){const u=o.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return m.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new q(((c,l)=>c-l));const a=this.overlays.getIterator();for(;a.hasNext();){const c=a.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>n){let l=i.get(c.largestBatchId);l===null&&(l=xe(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const o=xe(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,l)=>o.set(c,l))),!(o.size()>=s)););return m.resolve(o)}Zr(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const a=this.Gs.get(s.largestBatchId).delete(n.key);this.Gs.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(n.key,new Oa(t,n));let i=this.Gs.get(t);i===void 0&&(i=C(),this.Gs.set(t,i)),this.Gs.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A_{constructor(){this.sessionToken=K.EMPTY_BYTE_STRING}getSessionToken(e){return m.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,m.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(){this.zs=new U(re.js),this.Hs=new U(re.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){const n=new re(e,t);this.zs=this.zs.add(n),this.Hs=this.Hs.add(n)}Ys(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Zs(new re(e,t))}Xs(e,t){e.forEach((n=>this.removeReference(n,t)))}e_(e){const t=new A(new N([])),n=new re(t,e),s=new re(t,e+1),i=[];return this.Hs.forEachInRange([n,s],(a=>{this.Zs(a),i.push(a.key)})),i}t_(){this.zs.forEach((e=>this.Zs(e)))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){const t=new A(new N([])),n=new re(t,e),s=new re(t,e+1);let i=C();return this.Hs.forEachInRange([n,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new re(e,0),n=this.zs.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class re{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return A.comparator(e.key,t.key)||S(e.r_,t.r_)}static Js(e,t){return S(e.r_,t.r_)||A.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new U(re.js)}checkEmpty(e){return m.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new xa(i,t,n,s);this.mutationQueue.push(a);for(const o of s)this.i_=this.i_.add(new re(o.key,i)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return m.resolve(a)}lookupMutationBatch(e,t){return m.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.__(n),i=s<0?0:s;return m.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return m.resolve(this.mutationQueue.length===0?kt:this.Gr-1)}getAllMutationBatches(e){return m.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new re(t,0),s=new re(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([n,s],(a=>{const o=this.s_(a.r_);i.push(o)})),m.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new U(S);return t.forEach((s=>{const i=new re(s,0),a=new re(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,a],(o=>{n=n.add(o.r_)}))})),m.resolve(this.o_(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;A.isDocumentKey(i)||(i=i.child(""));const a=new re(new A(i),0);let o=new U(S);return this.i_.forEachWhile((u=>{const c=u.key.path;return!!n.isPrefixOf(c)&&(c.length===s&&(o=o.add(u.r_)),!0)}),a),m.resolve(this.o_(o))}o_(e){const t=[];return e.forEach((n=>{const s=this.s_(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){E(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.i_;return m.forEach(t.mutations,(s=>{const i=new re(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.i_=n}))}Hr(e){}containsKey(e,t){const n=new re(t,0),s=this.i_.firstAfterOrEqual(n);return m.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,m.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){const t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v_{constructor(e){this.u_=e,this.docs=(function(){return new q(A.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,a=this.u_(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return m.resolve(n?n.document.mutableCopy():G.newInvalidDocument(t))}getEntries(e,t){let n=Z();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():G.newInvalidDocument(s))})),m.resolve(n)}getAllEntries(e){let t=Z();return this.docs.forEach(((n,s)=>{t=t.insert(n,s.document)})),m.resolve(t)}getDocumentsMatchingQuery(e,t,n,s){let i,a;Q(t)?(i=N.fromString(Fr(t)),a=l=>Xs(t,l)):(i=t.path,a=l=>Os(t,l));let o=Z();const u=new A(i.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:l,value:{document:h}}=c.getNext();if(!i.isPrefixOf(l.path))break;l.path.length>i.length+1||ia(ic(h),n)<=0||(s.has(h.key)||a(h))&&(o=o.insert(h.key,h.mutableCopy()))}return m.resolve(o)}getAllFromCollectionGroup(e,t,n,s){V(9500)}c_(e,t){return m.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new R_(this)}getSize(e){return m.resolve(this.size)}}class R_ extends bl{constructor(e){super(),this.$s=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(n)})),m.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P_{constructor(e){this.persistence=e,this.l_=new tt((t=>Qs(t)),ba),this.lastRemoteSnapshotVersion=b.min(),this.highestTargetId=0,this.E_=0,this.h_=new Fa,this.targetCount=0,this.T_=Ze.ws()}forEachTarget(e,t){return this.l_.forEach(((n,s)=>t(s))),m.resolve()}getLastRemoteSnapshotVersion(e){return m.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return m.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),m.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.E_&&(this.E_=t),m.resolve()}Ds(e){this.l_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.T_=new Ze(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,m.resolve()}updateTargetData(e,t){return this.Ds(t),m.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,m.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.l_.forEach(((a,o)=>{o.sequenceNumber<=t&&n.get(o.targetId)===null&&(this.l_.delete(a),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),s++)})),m.waitFor(i).next((()=>s))}getTargetCount(e){return m.resolve(this.targetCount)}getTargetData(e,t){const n=this.l_.get(t)||null;return m.resolve(n)}addMatchingKeys(e,t,n){return this.h_.Ys(t,n),m.resolve()}removeMatchingKeys(e,t,n){this.h_.Xs(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),m.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),m.resolve()}getMatchingKeysForTargetId(e,t){const n=this.h_.n_(t);return m.resolve(n)}containsKey(e,t){return m.resolve(this.h_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{constructor(e,t){this.P_={},this.overlays={},this.I_=new Ie(0),this.R_=!1,this.R_=!0,this.A_=new A_,this.referenceDelegate=e(this),this.V_=new P_(this),this.indexManager=new f_,this.remoteDocumentCache=(function(s){return new v_(s)})((n=>this.referenceDelegate.d_(n))),this.serializer=new Il(t),this.f_=new E_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new w_,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.P_[e.toKey()];return n||(n=new V_(t,this.referenceDelegate),this.P_[e.toKey()]=n),n}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,n){I("MemoryPersistence","Starting transaction:",e);const s=new b_(this.I_.next());return this.referenceDelegate.m_(),n(s).next((i=>this.referenceDelegate.p_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}g_(e,t){return m.or(Object.values(this.P_).map((n=>()=>n.containsKey(e,t))))}}class b_ extends kc{constructor(e){super(),this.currentSequenceNumber=e}}class Zs{constructor(e){this.persistence=e,this.y_=new Fa,this.w_=null}static b_(e){return new Zs(e)}get S_(){if(this.w_)return this.w_;throw V(60996)}addReference(e,t,n){return this.y_.addReference(n,t),this.S_.delete(n.toString()),m.resolve()}removeReference(e,t,n){return this.y_.removeReference(n,t),this.S_.add(n.toString()),m.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),m.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach((s=>this.S_.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.S_.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}m_(){this.w_=new Set}p_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return m.forEach(this.S_,(n=>{const s=A.fromPath(n);return this.v_(e,s).next((i=>{i||t.removeEntry(s,b.min())}))})).next((()=>(this.w_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((n=>{n?this.S_.delete(t.toString()):this.S_.add(t.toString())}))}d_(e){return 0}v_(e,t){return m.or([()=>m.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}}class Vs{constructor(e,t){this.persistence=e,this.D_=new tt((n=>de(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=Fc(this,t)}static b_(e,t){return new Vs(e,t)}m_(){}p_(e){return m.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){const t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}Cs(e){let t=0;return this.sr(e,(n=>{t++})).next((()=>t))}sr(e,t){return m.forEach(this.D_,((n,s)=>this.Os(e,n,s).next((i=>i?m.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,(a=>this.Os(e,a,t).next((o=>{o||(n++,i.removeEntry(a,b.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),m.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.D_.set(n,e.currentSequenceNumber),m.resolve()}removeReference(e,t,n){return this.D_.set(n,e.currentSequenceNumber),m.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),m.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Jr(e.data.value)),t}Os(e,t,n){return m.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.D_.get(t);return m.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x_{constructor(e){this.serializer=e}Nn(e,t,n,s){const i=new Fs("createOrUpgrade",t);n<1&&s>=1&&((function(u){u.createObjectStore(Br)})(e),(function(u){u.createObjectStore(Vr,{keyPath:Dm}),u.createObjectStore(De,{keyPath:Ko,autoIncrement:!0}).createIndex(Nt,Go,{unique:!0}),u.createObjectStore(vn)})(e),cu(e),(function(u){u.createObjectStore(vt)})(e));let a=m.resolve();return n<3&&s>=3&&(n!==0&&((function(u){u.deleteObjectStore(Pn),u.deleteObjectStore(Rn),u.deleteObjectStore(Ft)})(e),cu(e)),a=a.next((()=>(function(u){const c=u.store(Ft),l={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:b.min().toTimestamp(),targetCount:0};return c.put(Ts,l)})(i)))),n<4&&s>=4&&(n!==0&&(a=a.next((()=>(function(u,c){return c.store(De).Qn().next((h=>{u.deleteObjectStore(De),u.createObjectStore(De,{keyPath:Ko,autoIncrement:!0}).createIndex(Nt,Go,{unique:!0});const d=c.store(De),_=h.map((y=>d.put(y)));return m.waitFor(_)}))})(e,i)))),a=a.next((()=>{(function(u){u.createObjectStore(bn,{keyPath:$m})})(e)}))),n<5&&s>=5&&(a=a.next((()=>this.x_(i)))),n<6&&s>=6&&(a=a.next((()=>((function(u){u.createObjectStore(vr)})(e),this.C_(i))))),n<7&&s>=7&&(a=a.next((()=>this.F_(i)))),n<8&&s>=8&&(a=a.next((()=>this.O_(e,i)))),n<9&&s>=9&&(a=a.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(a=a.next((()=>this.M_(i)))),n<11&&s>=11&&(a=a.next((()=>{(function(u){u.createObjectStore(js,{keyPath:zm})})(e),(function(u){u.createObjectStore(Ws,{keyPath:Km})})(e)}))),n<12&&s>=12&&(a=a.next((()=>{(function(u){const c=u.createObjectStore(Hs,{keyPath:Jm});c.createIndex(Di,Xm,{unique:!1}),c.createIndex(fl,Zm,{unique:!1})})(e)}))),n<13&&s>=13&&(a=a.next((()=>(function(u){const c=u.createObjectStore(Is,{keyPath:Om});c.createIndex(rs,Lm),c.createIndex(cl,Mm)})(e))).next((()=>this.N_(e,i))).next((()=>e.deleteObjectStore(vt)))),n<14&&s>=14&&(a=a.next((()=>this.L_(e,i)))),n<15&&s>=15&&(a=a.next((()=>(function(u){u.createObjectStore(Na,{keyPath:Gm,autoIncrement:!0}).createIndex(Ni,Qm,{unique:!1}),u.createObjectStore(ar,{keyPath:jm}).createIndex(hl,Wm,{unique:!1}),u.createObjectStore(or,{keyPath:Hm}).createIndex(dl,Ym,{unique:!1})})(e)))),n<16&&s>=16&&(a=a.next((()=>{t.objectStore(ar).clear()})).next((()=>{t.objectStore(or).clear()}))),n<17&&s>=17&&(a=a.next((()=>{(function(u){u.createObjectStore(Da,{keyPath:e_})})(e)}))),n<18&&s>=18&&Su()&&(a=a.next((()=>{t.objectStore(ar).clear()})).next((()=>{t.objectStore(or).clear()}))),a}C_(e){let t=0;return e.store(vt).Hn(((n,s)=>{t+=Es(s)})).next((()=>{const n={byteSize:t};return e.store(vr).put(Ci,n)}))}x_(e){const t=e.store(Vr),n=e.store(De);return t.Qn().next((s=>m.forEach(s,(i=>{const a=IDBKeyRange.bound([i.userId,kt],[i.userId,i.lastAcknowledgedBatchId]);return n.Qn(Nt,a).next((o=>m.forEach(o,(u=>{E(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const c=bt(this.serializer,u);return yl(e,i.userId,c).next((()=>{}))}))))}))))}F_(e){const t=e.store(Pn),n=e.store(vt);return e.store(Ft).get(Ts).next((s=>{const i=[];return n.Hn(((a,o)=>{const u=new N(a),c=(function(h){return[0,de(h)]})(u);i.push(t.get(c).next((l=>l?m.resolve():(h=>t.put({targetId:0,path:de(h),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>m.waitFor(i)))}))}O_(e,t){e.createObjectStore(Rr,{keyPath:qm});const n=t.store(Rr),s=new Ma,i=a=>{if(s.add(a)){const o=a.lastSegment(),u=a.popLast();return n.put({collectionId:o,parent:de(u)})}};return t.store(vt).Hn({jn:!0},((a,o)=>{const u=new N(a);return i(u.popLast())})).next((()=>t.store(vn).Hn({jn:!0},(([a,o,u],c)=>{const l=Ue(o);return i(l.popLast())}))))}M_(e){const t=e.store(Rn);return t.Hn(((n,s)=>{const i=Jn(this.serializer,s),a=Tl(this.serializer,i);return t.put(a)}))}N_(e,t){const n=t.store(vt),s=[];return n.Hn(((i,a)=>{const o=t.store(Is),u=(function(h){return h.document?new A(N.fromString(h.document.name).popFirst(5)):h.noDocument?A.fromSegments(h.noDocument.path):h.unknownDocument?A.fromSegments(h.unknownDocument.path):V(36783)})(a).path.toArray(),c={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:a.readTime||[0,0],unknownDocument:a.unknownDocument,noDocument:a.noDocument,document:a.document,hasCommittedMutations:!!a.hasCommittedMutations};s.push(o.put(c))})).next((()=>m.waitFor(s)))}L_(e,t){const n=t.store(De),s=xl(this.serializer),i=new Ua(Zs.b_,this.serializer.$r);return n.Qn().next((a=>{const o=new Map;return a.forEach((u=>{let c=o.get(u.userId)??C();bt(this.serializer,u).keys().forEach((l=>c=c.add(l))),o.set(u.userId,c)})),m.forEach(o,((u,c)=>{const l=new se(c),h=Js.Qr(this.serializer,l),d=i.getIndexManager(l),_=Ys.Qr(l,this.serializer,d,i.referenceDelegate);return new Sl(s,_,h,d).recalculateAndSaveOverlaysForDocumentKeys(new ki(t,Ie.wn),u).next()}))}))}}function cu(r){r.createObjectStore(Pn,{keyPath:Um}).createIndex(Ca,Bm,{unique:!0}),r.createObjectStore(Rn,{keyPath:"targetId"}).createIndex(ll,Fm,{unique:!0}),r.createObjectStore(Ft)}const at="IndexedDbPersistence",li=18e5,hi=5e3,di="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",S_="main";class Ba{constructor(e,t,n,s,i,a,o,u,c,l,h=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ct=i,this.window=a,this.document=o,this.B_=c,this.U_=l,this.k_=h,this.I_=null,this.R_=!1,this.isPrimary=!1,this.networkEnabled=!0,this.q_=null,this.inForeground=!1,this.K_=null,this.Q_=null,this.W_=Number.NEGATIVE_INFINITY,this.G_=d=>Promise.resolve(),!Ba.Ye())throw new T(p.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new p_(this,s),this.z_=t+S_,this.serializer=new Il(u),this.j_=new ct(this.z_,this.k_,new x_(this.serializer)),this.A_=new o_,this.V_=new __(this.referenceDelegate,this.serializer),this.remoteDocumentCache=xl(this.serializer),this.f_=new a_,this.window&&this.window.localStorage?this.H_=this.window.localStorage:(this.H_=null,l===!1&&W(at,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.J_().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new T(p.FAILED_PRECONDITION,di);return this.Y_(),this.Z_(),this.X_(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.V_.getHighestSequenceNumber(e)))})).then((e=>{this.I_=new Ie(e,this.B_)})).then((()=>{this.R_=!0})).catch((e=>(this.j_&&this.j_.close(),Promise.reject(e))))}eo(e){return this.G_=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.j_.Bn((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ct.enqueueAndForget((async()=>{this.started&&await this.J_()})))}J_(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Yr(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.no(e).next((t=>{t||(this.isPrimary=!1,this.Ct.enqueueRetryable((()=>this.G_(!1))))}))})).next((()=>this.ro(e))).next((t=>this.isPrimary&&!t?this.io(e).next((()=>!1)):!!t&&this.so(e).next((()=>!0)))))).catch((e=>{if(wt(e))return I(at,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return I(at,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Ct.enqueueRetryable((()=>this.G_(e))),this.isPrimary=e}))}no(e){return Wn(e).get(Zt).next((t=>m.resolve(this._o(t))))}oo(e){return Yr(e).delete(this.clientId)}async ao(){if(this.isPrimary&&!this.uo(this.W_,li)){this.W_=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=te(t,bn);return n.Qn().next((s=>{const i=this.co(s,li),a=s.filter((o=>i.indexOf(o)===-1));return m.forEach(a,(o=>n.delete(o.clientId))).next((()=>a))}))})).catch((()=>[]));if(this.H_)for(const t of e)this.H_.removeItem(this.lo(t.clientId))}}X_(){this.Q_=this.Ct.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.J_().then((()=>this.ao())).then((()=>this.X_()))))}_o(e){return!!e&&e.ownerId===this.clientId}ro(e){return this.U_?m.resolve(!0):Wn(e).get(Zt).next((t=>{if(t!==null&&this.uo(t.leaseTimestampMs,hi)&&!this.Eo(t.ownerId)){if(this._o(t)&&this.networkEnabled)return!0;if(!this._o(t)){if(!t.allowTabSynchronization)throw new T(p.FAILED_PRECONDITION,di);return!1}}return!(!this.networkEnabled||!this.inForeground)||Yr(e).Qn().next((n=>this.co(n,hi).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,a=!this.inForeground&&s.inForeground,o=this.networkEnabled===s.networkEnabled;if(i||a&&o)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&I(at,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.R_=!1,this.ho(),this.Q_&&(this.Q_.cancel(),this.Q_=null),this.To(),this.Po(),await this.j_.runTransaction("shutdown","readwrite",[Br,bn],(e=>{const t=new ki(e,Ie.wn);return this.io(t).next((()=>this.oo(t)))})),this.j_.close(),this.Io()}co(e,t){return e.filter((n=>this.uo(n.updateTimeMs,t)&&!this.Eo(n.clientId)))}Ro(){return this.runTransaction("getActiveClients","readonly",(e=>Yr(e).Qn().next((t=>this.co(t,li).map((n=>n.clientId))))))}get started(){return this.R_}getGlobalsCache(){return this.A_}getMutationQueue(e,t){return Ys.Qr(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new m_(e,this.serializer.$r.databaseId)}getDocumentOverlayCache(e){return Js.Qr(this.serializer,e)}getBundleCache(){return this.f_}runTransaction(e,t,n){I(at,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?r_:u===17?gl:u===16?n_:u===15?ka:u===14?pl:u===13?_l:u===12?t_:u===11?ml:void V(60245)})(this.k_);let a;return this.j_.runTransaction(e,s,i,(o=>(a=new ki(o,this.I_?this.I_.next():Ie.wn),t==="readwrite-primary"?this.no(a).next((u=>!!u||this.ro(a))).next((u=>{if(!u)throw W(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ct.enqueueRetryable((()=>this.G_(!1))),new T(p.FAILED_PRECONDITION,Dc);return n(a)})).next((u=>this.so(a).next((()=>u)))):this.Ao(a).next((()=>n(a)))))).then((o=>(a.raiseOnCommittedEvent(),o)))}Ao(e){return Wn(e).get(Zt).next((t=>{if(t!==null&&this.uo(t.leaseTimestampMs,hi)&&!this.Eo(t.ownerId)&&!this._o(t)&&!(this.U_||this.allowTabSynchronization&&t.allowTabSynchronization))throw new T(p.FAILED_PRECONDITION,di)}))}so(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Wn(e).put(Zt,t)}static Ye(){return ct.Ye()}io(e){const t=Wn(e);return t.get(Zt).next((n=>this._o(n)?(I(at,"Releasing primary lease."),t.delete(Zt)):m.resolve()))}uo(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(W(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Y_(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.K_=()=>{this.Ct.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.J_())))},this.document.addEventListener("visibilitychange",this.K_),this.inForeground=this.document.visibilityState==="visible")}To(){this.K_&&(this.document.removeEventListener("visibilitychange",this.K_),this.K_=null)}Z_(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.q_=()=>{this.ho();const t=/(?:Version|Mobile)\/1[456]/;xu()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Ct.enterRestrictedMode(!0),this.Ct.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.q_))}Po(){this.q_&&(this.window.removeEventListener("pagehide",this.q_),this.q_=null)}Eo(e){var t;try{const n=((t=this.H_)==null?void 0:t.getItem(this.lo(e)))!==null;return I(at,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return W(at,"Failed to get zombied client id.",n),!1}}ho(){if(this.H_)try{this.H_.setItem(this.lo(this.clientId),String(Date.now()))}catch(e){W("Failed to set zombie client id.",e)}}Io(){if(this.H_)try{this.H_.removeItem(this.lo(this.clientId))}catch{}}lo(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Wn(r){return te(r,Br)}function Yr(r){return te(r,bn)}function Cl(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Vo=n,this.fo=s}static mo(e,t){let n=C(),s=C();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new qa(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C_(r,e){return A.comparator(r.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=(function(){return xu()?8:Oc(os())>0?6:4})()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.vo(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.Do(e,t,s,n).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new N_;return this.xo(e,t,a).next((o=>{if(i.result=o,this.yo)return this.Co(e,t,a,o.size)}))})).next((()=>i.result))}Co(e,t,n,s){return Q(t)?m.resolve():n.documentReadCount<this.wo?(an()<=Ge.DEBUG&&I("QueryEngine","SDK will not create cache indexes for query:",nr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),m.resolve()):(an()<=Ge.DEBUG&&I("QueryEngine","Query:",nr(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.bo*s?(an()<=Ge.DEBUG&&I("QueryEngine","The SDK decides to create cache indexes for query:",nr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Re(t))):m.resolve())}vo(e,t){if(Q(t))return m.resolve(null);let n=t;if(Vo(n))return m.resolve(null);let s=Re(n);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=vi(n,null,"F"),s=Re(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next((a=>{const o=C(...a);return this.So.getDocuments(e,o).next((u=>this.indexManager.getMinOffset(e,s).next((c=>{const l=this.Fo(n,u);return this.Oo(n,l,o,c.readTime)?this.vo(e,vi(n,null,"F")):this.Mo(e,l,n,c)}))))})))))}Do(e,t,n,s){return(Q(t)?(function(a){for(const o of a.stages){if(o instanceof Vn||o instanceof qo)return!1;if(o instanceof $s){if(o.condition instanceof Hc&&o.condition._expr.name==="exists"&&o.condition._expr.params[0]instanceof Mn&&o.condition._expr.params[0].fieldName===mn)continue;return!1}}return!0})(t):Vo(t))||s.isEqual(b.min())?m.resolve(null):this.So.getDocuments(e,n).next((i=>{const a=this.Fo(t,i);return this.Oo(t,a,n,s)?m.resolve(null):(an()<=Ge.DEBUG&&I("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),$o(t)),this.Mo(e,a,t,sc(s,An)).next((o=>o)))}))}Fo(e,t){let n,s;return Q(e)?(n=new U(C_),s=i=>Xs(e,i)):(n=new U(ua(e)),s=i=>Os(e,i)),t.forEach(((i,a)=>{s(a)&&(n=n.add(a))})),n}Oo(e,t,n,s){if(Q(e))return(function(o){return o.stages.some((u=>u instanceof Vn||u instanceof qo))})(e);if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,n){return an()<=Ge.DEBUG&&I("QueryEngine","Using full collection scan to execute query:",$o(t)),this.So.getDocumentsMatchingQuery(e,t,Pe.min(),n)}Mo(e,t,n,s){return this.So.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $a="LocalStore",D_=3e8;class k_{constructor(e,t,n,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new q(S),this.Bo=new tt((i=>Qs(i)),ba),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(n)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Sl(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Lo)))}}function Dl(r,e,t,n){return new k_(r,e,t,n)}async function kl(r,e){const t=R(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const a=[],o=[];let u=C();for(const c of s){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return t.localDocuments.getDocuments(n,u).next((c=>({$o:c,removedBatchIds:a,addedBatchIds:o})))}))}))}function O_(r,e){const t=R(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.ko.newChangeBuffer({trackRemovals:!0});return(function(o,u,c,l){const h=c.batch,d=h.keys();let _=m.resolve();return d.forEach((y=>{_=_.next((()=>l.getEntry(u,y))).next((v=>{const P=c.docVersions.get(y);E(P!==null,48541),v.version.compareTo(P)<0&&(h.applyToRemoteDocument(v,c),v.isValidDocument()&&(v.setReadTime(c.commitVersion),l.addEntry(v)))}))})),_.next((()=>o.mutationQueue.removeMutationBatch(u,h)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(o){let u=C();for(let c=0;c<o.mutationResults.length;++c)o.mutationResults[c].transformResults.length>0&&(u=u.add(o.batch.mutations[c].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function Ol(r){const e=R(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.V_.getLastRemoteSnapshotVersion(t)))}function L_(r,e){const t=R(r),n=e.snapshotVersion;let s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;const o=[];e.targetChanges.forEach(((l,h)=>{const d=s.get(h);if(!d)return;o.push(t.V_.removeMatchingKeys(i,l.removedDocuments,h).next((()=>t.V_.addMatchingKeys(i,l.addedDocuments,h))));let _=d.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(h)!==null?_=_.withResumeToken(K.EMPTY_BYTE_STRING,b.min()).withLastLimboFreeSnapshotVersion(b.min()):l.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(l.resumeToken,n)),s=s.insert(h,_),(function(v,P,k){return v.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-v.snapshotVersion.toMicroseconds()>=D_?!0:k.addedDocuments.size+k.modifiedDocuments.size+k.removedDocuments.size>0})(d,_,l)&&o.push(t.V_.updateTargetData(i,_))}));let u=Z(),c=C();if(e.documentUpdates.forEach((l=>{e.resolvedLimboDocuments.has(l)&&o.push(t.persistence.referenceDelegate.updateLimboDocument(i,l))})),o.push(M_(i,a,e.documentUpdates).next((l=>{u=l.Ko,c=l.Qo}))),!n.isEqual(b.min())){const l=t.V_.getLastRemoteSnapshotVersion(i).next((h=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,n)));o.push(l)}return m.waitFor(o).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(t.Lo=s,i)))}function M_(r,e,t){let n=C(),s=C();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let a=Z();return t.forEach(((o,u)=>{const c=i.get(o);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(o)),u.isNoDocument()&&u.version.isEqual(b.min())?(e.removeEntry(o,u.readTime),a=a.insert(o,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),a=a.insert(o,u)):I($a,"Ignoring outdated watch update for ",o,". Current version:",c.version," Watch version:",u.version)})),{Ko:a,Qo:s}}))}function F_(r,e){const t=R(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=kt),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function vs(r,e){const t=R(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.V_.getTargetData(n,e).next((i=>i?(s=i,m.resolve(s)):t.V_.allocateTargetId(n).next((a=>(s=new Be(e,a,"TargetPurposeListen",n.currentSequenceNumber),t.V_.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.Lo.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(n.targetId,n),t.Bo.set(e,n.targetId)),n}))}async function xn(r,e,t){const n=R(r),s=n.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(a=>n.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!wt(a))throw a;I($a,`Failed to update sequence numbers for target ${e}: ${a}`)}n.Lo=n.Lo.remove(e),n.Bo.delete(s.target)}function Bi(r,e,t){const n=R(r);let s=b.min(),i=C();return n.persistence.runTransaction("Execute query","readwrite",(a=>(function(u,c,l){const h=R(u),d=h.Bo.get(l);return d!==void 0?m.resolve(h.Lo.get(d)):h.V_.getTargetData(c,l)})(n,a,Q(e)?e:Re(e)).next((o=>{if(o)return s=o.lastLimboFreeSnapshotVersion,n.V_.getMatchingKeysForTargetId(a,o.targetId).next((u=>{i=u}))})).next((()=>n.No.getDocumentsMatchingQuery(a,e,t?s:b.min(),t?i:C()))).next((o=>(Ml(n,o),{documents:o,Wo:i})))))}function Ll(r,e){const t=R(r),n=R(t.V_),s=t.Lo.get(e);return s?Promise.resolve(s.target??null):t.persistence.runTransaction("Get target data","readonly",(i=>n.ye(i,e).next((a=>(a==null?void 0:a.target)??null))))}function qi(r,e){const t=R(r),n=t.Uo.get(e)||b.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.ko.getAllFromCollectionGroup(s,e,sc(n,An),Number.MAX_SAFE_INTEGER))).then((s=>(Ml(t,s),s)))}function Ml(r,e){e.forEach(((t,n)=>{const s=n.key.getCollectionGroup(),i=r.Uo.get(s)||b.min();n.readTime.compareTo(i)>0&&r.Uo.set(s,n.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve()))))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(W(t),this.Xo=!1):I("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="RemoteStore";class B_{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new Ze(1e3),this.ca=new Ze(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe((a=>{n.enqueueAndForget((async()=>{Jt(this)&&(I(Ke,"Restarting streams for network reachability change."),await(async function(u){const c=R(u);c.la.add(4),await qr(c),c.Ta.set("Unknown"),c.la.delete(4),await ei(c)})(this))}))})),this.Ta=new U_(n,s)}}async function ei(r){if(Jt(r))for(const e of r.Ea)await e(!0)}async function qr(r){for(const e of r.Ea)await e(!1)}function $i(r,e){return r.oa.get(e)||void 0}function ti(r,e){const t=R(r),n=$i(t,e.targetId);if(n!==void 0&&t._a.has(n))return;const s=(function(o,u){const c=$i(o,u);c!==void 0&&o.aa.delete(c);const l=(function(d,_){return _%2!=0?d.ca.next():d.ua.next()})(o,u);return o.oa.set(u,l),o.aa.set(l,u),l})(t,e.targetId);I(Ke,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Be(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),Ga(t)?Ka(t):qn(t).Yt()&&za(t,i)}function Sn(r,e){const t=R(r),n=qn(t),s=$i(t,e);I(Ke,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),n.Yt()&&Fl(t,s),t._a.size===0&&(n.Yt()?n.en():Jt(t)&&t.Ta.set("Unknown"))}function za(r,e){if(r.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(b.min())>0){const t=r.aa.get(e.targetId);if(t===void 0)return void I(Ke,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}qn(r).Pn(e)}function Fl(r,e){r.Pa.J(e),qn(r).In(e)}function Ka(r){r.Pa=new md({getRemoteKeysForTarget:e=>{const t=r.aa.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):C()},ye:e=>r._a.get(e)||null,Ve:()=>r.datastore.serializer.databaseId}),qn(r).start(),r.Ta.ea()}function Ga(r){return Jt(r)&&!qn(r).Jt()&&r._a.size>0}function Jt(r){return R(r).la.size===0}function Ul(r){r.Pa=void 0}async function q_(r){r.Ta.set("Online")}async function $_(r){r._a.forEach(((e,t)=>{za(r,e)}))}async function z_(r,e){Ul(r),Ga(r)?(r.Ta.ra(e),Ka(r)):r.Ta.set("Unknown")}async function K_(r,e,t){if(r.Ta.set("Online"),e instanceof fc&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const o of i.targetIds){if(s._a.has(o)){const u=s.aa.get(o);u!==void 0&&(await s.remoteSyncer.rejectListen(u,a),s.oa.delete(u),s.aa.delete(o)),s._a.delete(o)}s.Pa.removeTarget(o)}})(r,e)}catch(n){I(Ke,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Rs(r,n)}else if(e instanceof es?r.Pa._e(e):e instanceof dc?r.Pa.he(e):r.Pa.ue(e),!t.isEqual(b.min()))try{const n=await Ol(r.localStore);t.compareTo(n)>=0&&await(function(i,a){const o=i.Pa.fe(a);o.targetChanges.forEach(((c,l)=>{if(c.resumeToken.approximateByteSize()>0){const h=i._a.get(l);h&&i._a.set(l,h.withResumeToken(c.resumeToken,a))}})),o.targetMismatches.forEach(((c,l)=>{const h=i._a.get(c);if(!h)return;i._a.set(c,h.withResumeToken(K.EMPTY_BYTE_STRING,h.snapshotVersion)),Fl(i,c);const d=new Be(h.target,c,l,h.sequenceNumber);za(i,d)}));const u=(function(l,h){const d=new Map;h.targetChanges.forEach(((y,v)=>{const P=l.aa.get(v);P!==void 0&&d.set(P,y)}));let _=new q(S);return h.targetMismatches.forEach(((y,v)=>{const P=l.aa.get(y);P!==void 0&&(_=_.insert(P,v))})),new Ln(h.snapshotVersion,d,_,h.documentUpdates,h.augmentedDocumentUpdates,h.resolvedLimboDocuments)})(i,o);return i.remoteSyncer.applyRemoteEvent(u)})(r,t)}catch(n){I(Ke,"Failed to raise snapshot:",n),await Rs(r,n)}}async function Rs(r,e,t){if(!wt(e))throw e;r.la.add(1),await qr(r),r.Ta.set("Offline"),t||(t=()=>Ol(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{I(Ke,"Retrying IndexedDB access"),await t(),r.la.delete(1),await ei(r)}))}function Bl(r,e){return e().catch((t=>Rs(r,t,e)))}async function Bn(r){const e=R(r),t=yt(e);let n=e.sa.length>0?e.sa[e.sa.length-1].batchId:kt;for(;G_(e);)try{const s=await F_(e.localStore,n);if(s===null){e.sa.length===0&&t.en();break}n=s.batchId,Q_(e,s)}catch(s){await Rs(e,s)}ql(e)&&$l(e)}function G_(r){return Jt(r)&&r.sa.length<10}function Q_(r,e){r.sa.push(e);const t=yt(r);t.Yt()&&t.Rn&&t.An(e.mutations)}function ql(r){return Jt(r)&&!yt(r).Jt()&&r.sa.length>0}function $l(r){yt(r).start()}async function j_(r){yt(r).fn()}async function W_(r){const e=yt(r);for(const t of r.sa)e.An(t.mutations)}async function H_(r,e,t){const n=r.sa.shift(),s=Sa.from(n,e,t);await Bl(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await Bn(r)}async function Y_(r,e){e&&yt(r).Rn&&await(async function(n,s){if((function(a){return od(a)&&a!==p.ABORTED})(s.code)){const i=n.sa.shift();yt(n).Xt(),await Bl(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Bn(n)}})(r,e),ql(r)&&$l(r)}async function lu(r,e){const t=R(r);t.asyncQueue.verifyOperationInProgress(),I(Ke,"RemoteStore received new credentials");const n=Jt(t);t.la.add(3),await qr(t),n&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await ei(t)}async function zi(r,e){const t=R(r);e?(t.la.delete(2),await ei(t)):e||(t.la.add(2),await qr(t),t.Ta.set("Unknown"))}function qn(r){return r.Ia||(r.Ia=(function(t,n,s){const i=R(t);return i.pn(),new Ud(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{ct:q_.bind(null,r),Et:$_.bind(null,r),Tt:z_.bind(null,r),Tn:K_.bind(null,r)}),r.Ea.push((async e=>{e?(r.Ia.Xt(),Ga(r)?Ka(r):r.Ta.set("Unknown")):(await r.Ia.stop(),Ul(r))}))),r.Ia}function yt(r){return r.Ra||(r.Ra=(function(t,n,s){const i=R(t);return i.pn(),new Bd(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{ct:()=>Promise.resolve(),Et:j_.bind(null,r),Tt:Y_.bind(null,r),Vn:W_.bind(null,r),dn:H_.bind(null,r)}),r.Ea.push((async e=>{e?(r.Ra.Xt(),await Bn(r)):(await r.Ra.stop(),r.sa.length>0&&(I(Ke,`Stopping write stream with ${r.sa.length} pending writes`),r.sa=[]))}))),r.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zl{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):W("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new je,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const a=Date.now()+n,o=new Qa(e,t,a,s,i);return o.start(n),o}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new T(p.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ja(r,e){if(W("AsyncQueue",`${e}: ${r}`),wt(r))return new T(p.UNAVAILABLE,`${e}: ${r}`);throw r}const ur="IndexBackfiller";class J_{constructor(e,t){this.asyncQueue=e,this.Da=t,this.task=null}start(){this.xa(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}xa(e){I(ur,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.Da.Ca();I(ur,`Documents written: ${t}`)}catch(t){wt(t)?I(ur,"Ignoring IndexedDB error during index backfill: ",t):await Et(t)}await this.xa(6e4)}))}}class X_{constructor(e,t){this.localStore=e,this.persistence=t}async Ca(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.Fa(t,e)))}Fa(e,t){const n=new Set;let s=t,i=!0;return m.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((a=>{if(a!==null&&!n.has(a))return I(ur,`Processing collection: ${a}`),this.Oa(e,a,s).next((o=>{s-=o,n.add(a)}));i=!1})))).next((()=>t-s))}Oa(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const a=i.changes;return this.localStore.indexManager.updateIndexEntries(e,a).next((()=>this.Ma(s,i))).next((o=>(I(ur,`Updating offset: ${o}`),this.localStore.indexManager.updateCollectionGroup(e,t,o)))).next((()=>a.size))}))))}Ma(e,t){let n=e;return t.changes.forEach(((s,i)=>{const a=ic(i);ia(a,n)>0&&(n=a)})),new Pe(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="firestore_clients";function hu(r,e){return`${Kl}_${r}_${e}`}const Gl="firestore_mutations";function du(r,e,t){let n=`${Gl}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const Ql="firestore_targets";function fi(r,e){return`${Ql}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="SharedClientState";class Ps{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static Na(e,t,n){const s=JSON.parse(n);let i,a=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return a&&s.error&&(a=typeof s.error.message=="string"&&typeof s.error.code=="string",a&&(i=new T(s.error.code,s.error.message))),a?new Ps(e,t,s.state,i):(W(Me,`Failed to parse mutation state for ID '${t}': ${n}`),null)}La(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class cr{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Na(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new T(n.error.code,n.error.message))),i?new cr(e,n.state,s):(W(Me,`Failed to parse target state for ID '${e}': ${t}`),null)}La(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class bs{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Na(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=ca();for(let a=0;s&&a<n.activeTargetIds.length;++a)s=Uu(n.activeTargetIds[a]),i=i.add(n.activeTargetIds[a]);return s?new bs(e,i):(W(Me,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Wa{constructor(e,t){this.clientId=e,this.onlineState=t}static Na(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new Wa(t.clientId,t.onlineState):(W(Me,`Failed to parse online state: ${e}`),null)}}class Ki{constructor(){this.activeTargetIds=ca()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class mi{constructor(e,t,n,s,i){this.window=e,this.Ct=t,this.persistenceKey=n,this.ka=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.qa=this.$a.bind(this),this.Ka=new q(S),this.started=!1,this.Qa=[];const a=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Wa=hu(this.persistenceKey,this.ka),this.Ga=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.Ka=this.Ka.insert(this.ka,new Ki),this.za=new RegExp(`^${Kl}_${a}_([^_]*)$`),this.ja=new RegExp(`^${Gl}_${a}_(\\d+)(?:_(.*))?$`),this.Ha=new RegExp(`^${Ql}_${a}_(\\d+)$`),this.Ja=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this.Ya=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.qa)}static Ye(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ro();for(const n of e){if(n===this.ka)continue;const s=this.getItem(hu(this.persistenceKey,n));if(s){const i=bs.Na(n,s);i&&(this.Ka=this.Ka.insert(i.clientId,i))}}this.Za();const t=this.storage.getItem(this.Ja);if(t){const n=this.Xa(t);n&&this.eu(n)}for(const n of this.Qa)this.$a(n);this.Qa=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ga,JSON.stringify(e))}getAllActiveQueryTargets(){return this.tu(this.Ka)}isActiveQueryTarget(e){let t=!1;return this.Ka.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.nu(e,"pending")}updateMutationState(e,t,n){this.nu(e,t,n),this.ru(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(fi(this.persistenceKey,e));if(s){const i=cr.Na(e,s);i&&(n=i.state)}}return t&&this.iu.Ba(e),this.Za(),n}removeLocalQueryTarget(e){this.iu.Ua(e),this.Za()}isLocalQueryTarget(e){return this.iu.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(fi(this.persistenceKey,e))}updateQueryState(e,t,n){this.su(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.ru(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this._u(e)}notifyBundleLoaded(e){this.ou(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.qa),this.removeItem(this.Wa),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return I(Me,"READ",e,t),t}setItem(e,t){I(Me,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){I(Me,"REMOVE",e),this.storage.removeItem(e)}$a(e){const t=e;if(t.storageArea===this.storage){if(I(Me,"EVENT",t.key,t.newValue),t.key===this.Wa)return void W("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ct.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.za.test(t.key)){if(t.newValue==null){const n=this.au(t.key);return this.uu(n,null)}{const n=this.cu(t.key,t.newValue);if(n)return this.uu(n.clientId,n)}}else if(this.ja.test(t.key)){if(t.newValue!==null){const n=this.lu(t.key,t.newValue);if(n)return this.Eu(n)}}else if(this.Ha.test(t.key)){if(t.newValue!==null){const n=this.hu(t.key,t.newValue);if(n)return this.Tu(n)}}else if(t.key===this.Ja){if(t.newValue!==null){const n=this.Xa(t.newValue);if(n)return this.eu(n)}}else if(t.key===this.Ga){const n=(function(i){let a=Ie.wn;if(i!=null)try{const o=JSON.parse(i);E(typeof o=="number",30636,{Pu:i}),a=o}catch(o){W(Me,"Failed to read sequence number from WebStorage",o)}return a})(t.newValue);n!==Ie.wn&&this.sequenceNumberHandler(n)}else if(t.key===this.Ya){const n=this.Iu(t.newValue);await Promise.all(n.map((s=>this.syncEngine.Ru(s))))}}}else this.Qa.push(t)}))}}get iu(){return this.Ka.get(this.ka)}Za(){this.setItem(this.Wa,this.iu.La())}nu(e,t,n){const s=new Ps(this.currentUser,e,t,n),i=du(this.persistenceKey,this.currentUser,e);this.setItem(i,s.La())}ru(e){const t=du(this.persistenceKey,this.currentUser,e);this.removeItem(t)}_u(e){const t={clientId:this.ka,onlineState:e};this.storage.setItem(this.Ja,JSON.stringify(t))}su(e,t,n){const s=fi(this.persistenceKey,e),i=new cr(e,t,n);this.setItem(s,i.La())}ou(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Ya,t)}au(e){const t=this.za.exec(e);return t?t[1]:null}cu(e,t){const n=this.au(e);return bs.Na(n,t)}lu(e,t){const n=this.ja.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return Ps.Na(new se(i),s,t)}hu(e,t){const n=this.Ha.exec(e),s=Number(n[1]);return cr.Na(s,t)}Xa(e){return Wa.Na(e)}Iu(e){return JSON.parse(e)}async Eu(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Au(e.batchId,e.state,e.error);I(Me,`Ignoring mutation for non-active user ${e.user.uid}`)}Tu(e){return this.syncEngine.Vu(e.targetId,e.state,e.error)}uu(e,t){const n=t?this.Ka.insert(e,t):this.Ka.remove(e),s=this.tu(this.Ka),i=this.tu(n),a=[],o=[];return i.forEach((u=>{s.has(u)||a.push(u)})),s.forEach((u=>{i.has(u)||o.push(u)})),this.syncEngine.du(a,o).then((()=>{this.Ka=n}))}eu(e){this.Ka.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}tu(e){let t=ca();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class jl{constructor(){this.fu=new Ki,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,n){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new Ki,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wl(){return typeof window<"u"?window:null}function is(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{static emptySet(e){return new Ut(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||A.comparator(t.key,n.key):(t,n)=>A.comparator(t.key,n.key),this.keyedMap=Rt(),this.sortedSet=new q(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ut)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Ut;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fu{constructor(){this.pu=new q(A.comparator)}track(e){const t=e.doc.key,n=this.pu.get(t);n?e.type!==0&&n.type===3?this.pu=this.pu.insert(t,e):e.type===3&&n.type!==1?this.pu=this.pu.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.pu=this.pu.remove(t):e.type===1&&n.type===2?this.pu=this.pu.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):V(63341,{we:e,gu:n}):this.pu=this.pu.insert(t,e)}yu(){const e=[];return this.pu.inorderTraversal(((t,n)=>{e.push(n)})),e}}class Cn{constructor(e,t,n,s,i,a,o,u,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=o,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,s,i){const a=[];return t.forEach((o=>{a.push({type:0,doc:o})})),new Cn(e,t,Ut.emptySet(t),a,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Gs(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some((e=>e.vu()))}}class ep{constructor(){this.queries=mu(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,n){const s=R(t),i=s.queries;s.queries=mu(),i.forEach(((a,o)=>{for(const u of o.bu)u.onError(n)}))})(this,new T(p.ABORTED,"Firestore shutting down"))}}function mu(){return new tt((r=>ol(r)),Gs)}async function Hl(r,e){const t=R(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.Su()&&e.vu()&&(n=2):(i=new Z_,n=e.vu()?0:1);try{switch(n){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const o=ja(a,`Initialization of query '${Q(e.query)?He(e.query):nr(e.query)}' failed`);return void e.onError(o)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&Ha(t)}async function Yl(r,e){const t=R(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const a=i.bu.indexOf(e);a>=0&&(i.bu.splice(a,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function tp(r,e){const t=R(r);let n=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const o of a.bu)o.Cu(s)&&(n=!0);a.wu=s}}n&&Ha(t)}function np(r,e,t){const n=R(r),s=n.queries.get(e);if(s)for(const i of s.bu)i.onError(t);n.queries.delete(e)}function Ha(r){r.Du.forEach((e=>{e.next()}))}var Gi;(function(r){r.Default="default",r.Cache="cache"})(Gi||(Gi={}));class Jl{constructor(e,t,n){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=n||{}}Cu(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new Cn(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;const n=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;const t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=Cn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==Gi.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xl{constructor(e){this.key=e}}class Zl{constructor(e){this.key=e}}class rp{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=C(),this.mutatedKeys=C(),this.Ju=Q(e)?Ui(e):ua(e),this.Yu=new Ut(this.Ju)}get Zu(){return this.zu}Xu(e,t){const n=t?t.ec:new fu,s=t?t.Yu:this.Yu;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,o=!1;const[u,c]=this.tc(this.query,s);e.inorderTraversal(((h,d)=>{const _=s.get(h),y=Pl(this.query,d)?d:null,v=!!_&&this.mutatedKeys.has(_.key),P=!!y&&(y.hasLocalMutations||this.mutatedKeys.has(y.key)&&y.hasCommittedMutations);let k=!1;_&&y?_.data.isEqual(y.data)?v!==P&&(n.track({type:3,doc:y}),k=!0):this.nc(_,y)||(n.track({type:2,doc:y}),k=!0,(u&&this.Ju(y,u)>0||c&&this.Ju(y,c)<0)&&(o=!0)):!_&&y?(n.track({type:0,doc:y}),k=!0):_&&!y&&(n.track({type:1,doc:_}),k=!0,(u||c)&&(o=!0)),k&&(y?(a=a.add(y),i=P?i.add(h):i.delete(h)):(a=a.delete(h),i=i.delete(h)))}));const l=this.rc(this.query);if(l)if(Q(this.query)){const h=[];a.forEach((y=>h.push(y)));const d=Rl(this.query,h);let _=new Ut(Ui(this.query));for(const y of d)_=_.add(y);a.forEach((y=>{_.has(y.key)||(i=i.delete(y.key),n.track({type:1,doc:y}))})),a=_}else{const h=this.sc(this.query);for(;a.size>l;){const d=h==="F"?a.last():a.first();a=a.delete(d.key),i=i.delete(d.key),n.track({type:1,doc:d})}}return{Yu:a,ec:n,Oo:o,mutatedKeys:i}}rc(e){var t;return Q(e)?(t=ci(e))==null?void 0:t.limit:e.limit||void 0}sc(e){if(Q(e)){const t=ci(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){var n;if(Q(e)){const s=(n=ci(e))==null?void 0:n.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;const a=e.ec.yu();a.sort(((l,h)=>(function(_,y){const v=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return V(20277,{we:P})}};return v(_)-v(y)})(l.type,h.type)||this.Ju(l.doc,h.doc))),this._c(n),s=s??!1;const o=t&&!s?this.oc():[],u=this.Hu.size===0&&this.current&&!s?1:0,c=u!==this.ju;return this.ju=u,a.length!==0||c?{snapshot:new Cn(this.query,e.Yu,i,a,e.mutatedKeys,u===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),ac:o}:{ac:o}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new fu,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach((t=>this.zu=this.zu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.zu=this.zu.delete(t))),this.current=e.current)}oc(){if(!this.current)return[];const e=this.Hu;this.Hu=C(),this.Yu.forEach((n=>{this.uc(n.key)&&(this.Hu=this.Hu.add(n.key))}));const t=[];return e.forEach((n=>{this.Hu.has(n)||t.push(new Zl(n))})),this.Hu.forEach((n=>{e.has(n)||t.push(new Xl(n))})),t}cc(e){this.zu=e.Wo,this.Hu=C();const t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return Cn.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}}const $n="SyncEngine";class sp{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class ip{constructor(e){this.key=e,this.Ec=!1}}class ap{constructor(e,t,n,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.hc={},this.Tc=new tt((o=>ol(o)),Gs),this.Pc=new Map,this.Ic=new Set,this.Rc=new q(A.comparator),this.Ac=new Map,this.Vc=new Fa,this.dc={},this.fc=new Map,this.mc=Ze.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}}async function op(r,e,t=!0){const n=ni(r);let s;const i=n.Tc.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await eh(n,e,t,!0),s}async function up(r,e){const t=ni(r);await eh(t,e,!0,!1)}async function eh(r,e,t,n){const s=await vs(r.localStore,Q(e)?e:Re(e)),i=s.targetId,a=r.sharedClientState.addLocalQueryTarget(i,t);let o;return n&&(o=await Ya(r,e,i,a==="current",s.resumeToken)),r.isPrimaryClient&&t&&ti(r.remoteStore,s),o}async function Ya(r,e,t,n,s){r.yc=(h,d,_)=>(async function(v,P,k,D){let O=P.view.Xu(k);O.Oo&&(O=await Bi(v.localStore,P.query,!1).then((({documents:_e})=>P.view.Xu(_e,O))));const ne=D&&D.targetChanges.get(P.targetId),z=D&&D.targetMismatches.get(P.targetId)!=null,X=P.view.applyChanges(O,v.isPrimaryClient,ne,z);return Qi(v,P.targetId,X.ac),X.snapshot})(r,h,d,_);const i=await Bi(r.localStore,e,!0),a=new rp(e,i.Wo),o=a.Xu(i.documents),u=kr.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),c=a.applyChanges(o,r.isPrimaryClient,u);Qi(r,t,c.ac);const l=new sp(e,t,a);return r.Tc.set(e,l),r.Pc.has(t)?r.Pc.get(t).push(e):r.Pc.set(t,[e]),c.snapshot}async function cp(r,e,t){const n=R(r),s=n.Tc.get(e),i=n.Pc.get(s.targetId);if(i.length>1)return n.Pc.set(s.targetId,i.filter((a=>!Gs(a,e)))),void n.Tc.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await xn(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&Sn(n.remoteStore,s.targetId),Nn(n,s.targetId)})).catch(Et)):(Nn(n,s.targetId),await xn(n.localStore,s.targetId,!0))}async function lp(r,e){const t=R(r),n=t.Tc.get(e),s=t.Pc.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Sn(t.remoteStore,n.targetId))}async function hp(r,e,t){const n=eo(r);try{const s=await(function(a,o){const u=R(a),c=F.now(),l=o.reduce(((_,y)=>_.add(y.key)),C());let h,d;return u.persistence.runTransaction("Locally write mutations","readwrite",(_=>{let y=Z(),v=C();return u.ko.getEntries(_,l).next((P=>{y=P,y.forEach(((k,D)=>{D.isValidDocument()||(v=v.add(k))}))})).next((()=>u.localDocuments.getOverlayedDocuments(_,y))).next((P=>{h=P;const k=[];for(const D of o){const O=jh(D,h.get(D.key).overlayedDocument);O!=null&&k.push(new et(D.key,O,zu(O.value.mapValue),ue.exists(!0)))}return u.mutationQueue.addMutationBatch(_,c,k,o)})).next((P=>{d=P;const k=P.applyToLocalDocumentSet(h,v);return u.documentOverlayCache.saveOverlays(_,P.batchId,k)}))})).then((()=>({batchId:d.batchId,changes:lc(h)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(a,o,u){let c=a.dc[a.currentUser.toKey()];c||(c=new q(S)),c=c.insert(o,u),a.dc[a.currentUser.toKey()]=c})(n,s.batchId,t),await At(n,s.changes),await Bn(n.remoteStore)}catch(s){const i=ja(s,"Failed to persist write");t.reject(i)}}async function th(r,e){const t=R(r);try{const n=await L_(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.Ac.get(i);a&&(E(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.Ec=!0:s.modifiedDocuments.size>0?E(a.Ec,14607):s.removedDocuments.size>0&&(E(a.Ec,42227),a.Ec=!1))})),await At(t,n,e)}catch(n){await Et(n)}}function _u(r,e,t){const n=R(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Tc.forEach(((i,a)=>{const o=a.view.xu(e);o.snapshot&&s.push(o.snapshot)})),(function(a,o){const u=R(a);u.onlineState=o;let c=!1;u.queries.forEach(((l,h)=>{for(const d of h.bu)d.xu(o)&&(c=!0)})),c&&Ha(u)})(n.eventManager,e),s.length&&n.hc.Tn(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function dp(r,e,t){const n=R(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Ac.get(e),i=s&&s.key;if(i){let a=new q(A.comparator);a=a.insert(i,G.newNoDocument(i,b.min()));const o=C().add(i),u=new Ln(b.min(),new Map,new q(S),a,Z(),o);await th(n,u),n.Rc=n.Rc.remove(i),n.Ac.delete(e),Za(n)}else await xn(n.localStore,e,!1).then((()=>Nn(n,e,t))).catch(Et)}async function fp(r,e){const t=R(r),n=e.batch.batchId;try{const s=await O_(t.localStore,e);Xa(t,n,null),Ja(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await At(t,s)}catch(s){await Et(s)}}async function mp(r,e,t){const n=R(r);try{const s=await(function(a,o){const u=R(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let l;return u.mutationQueue.lookupMutationBatch(c,o).next((h=>(E(h!==null,37113),l=h.keys(),u.mutationQueue.removeMutationBatch(c,h)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,l,o))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,l))).next((()=>u.localDocuments.getDocuments(c,l)))}))})(n.localStore,e);Xa(n,e,t),Ja(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await At(n,s)}catch(s){await Et(s)}}function Ja(r,e){(r.fc.get(e)||[]).forEach((t=>{t.resolve()})),r.fc.delete(e)}function Xa(r,e,t){const n=R(r);let s=n.dc[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.dc[n.currentUser.toKey()]=s}}function Nn(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Pc.get(e))r.Tc.delete(n),t&&r.hc.wc(n,t);r.Pc.delete(e),r.isPrimaryClient&&r.Vc.e_(e).forEach((n=>{r.Vc.containsKey(n)||nh(r,n)}))}function nh(r,e){r.Ic.delete(e.path.canonicalString());const t=r.Rc.get(e);t!==null&&(Sn(r.remoteStore,t),r.Rc=r.Rc.remove(e),r.Ac.delete(t),Za(r))}function Qi(r,e,t){for(const n of t)n instanceof Xl?(r.Vc.addReference(n.key,e),_p(r,n)):n instanceof Zl?(I($n,"Document no longer in limbo: "+n.key),r.Vc.removeReference(n.key,e),r.Vc.containsKey(n.key)||nh(r,n.key)):V(19791,{bc:n})}function _p(r,e){const t=e.key,n=t.path.canonicalString();r.Rc.get(t)||r.Ic.has(n)||(I($n,"New document in limbo: "+t),r.Ic.add(n),Za(r))}function Za(r){for(;r.Ic.size>0&&r.Rc.size<r.maxConcurrentLimboResolutions;){const e=r.Ic.values().next().value;r.Ic.delete(e);const t=new A(N.fromString(e)),n=r.mc.next();r.Ac.set(n,new ip(t)),r.Rc=r.Rc.insert(t,n),ti(r.remoteStore,new Be(Re(Dr(t.path)),n,"TargetPurposeLimboResolution",Ie.wn))}}async function At(r,e,t){const n=R(r),s=[],i=[],a=[];n.Tc.isEmpty()||(n.Tc.forEach(((o,u)=>{a.push(n.yc(u,e,t).then((c=>{var l;if((c||t)&&n.isPrimaryClient){const h=c?!c.fromCache:(l=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:l.current;n.sharedClientState.updateQueryState(u.targetId,h?"current":"not-current")}if(c){s.push(c);const h=qa.mo(u.targetId,c);i.push(h)}})))})),await Promise.all(a),n.hc.Tn(s),await(async function(u,c){const l=R(u);try{await l.persistence.runTransaction("notifyLocalViewChanges","readwrite",(h=>m.forEach(c,(d=>m.forEach(d.Vo,(_=>l.persistence.referenceDelegate.addReference(h,d.targetId,_))).next((()=>m.forEach(d.fo,(_=>l.persistence.referenceDelegate.removeReference(h,d.targetId,_)))))))))}catch(h){if(!wt(h))throw h;I($a,"Failed to update sequence numbers: "+h)}for(const h of c){const d=h.targetId;if(!h.fromCache){const _=l.Lo.get(d),y=_.snapshotVersion,v=_.withLastLimboFreeSnapshotVersion(y);l.Lo=l.Lo.insert(d,v)}}})(n.localStore,i))}async function pp(r,e){const t=R(r);if(!t.currentUser.isEqual(e)){I($n,"User change. New user:",e.toKey());const n=await kl(t.localStore,e);t.currentUser=e,(function(i,a){i.fc.forEach((o=>{o.forEach((u=>{u.reject(new T(p.CANCELLED,a))}))})),i.fc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await At(t,n.$o)}}function gp(r,e){const t=R(r),n=t.Ac.get(e);if(n&&n.Ec)return C().add(n.key);{let s=C();const i=t.Pc.get(e);if(!i)return s;for(const a of i??[]){const o=t.Tc.get(a);s=s.unionWith(o.view.Zu)}return s}}async function yp(r,e){const t=R(r),n=await Bi(t.localStore,e.query,!0),s=e.view.cc(n);return t.isPrimaryClient&&Qi(t,e.targetId,s.ac),s}async function Ip(r,e){const t=R(r);return qi(t.localStore,e).then((n=>At(t,n)))}async function Tp(r,e,t,n){const s=R(r),i=await(function(o,u){const c=R(o),l=R(c.mutationQueue);return c.persistence.runTransaction("Lookup mutation documents","readonly",(h=>l.Wr(h,u).next((d=>d?c.localDocuments.getDocuments(h,d):m.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await Bn(s.remoteStore):t==="acknowledged"||t==="rejected"?(Xa(s,e,n||null),Ja(s,e),(function(o,u){R(R(o).mutationQueue).Hr(u)})(s.localStore,e)):V(6720,"Unknown batchState",{Sc:t}),await At(s,i)):I($n,"Cannot apply mutation batch with id: "+e)}async function Ep(r,e){const t=R(r);if(ni(t),eo(t),e===!0&&t.gc!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await pu(t,n.toArray());t.gc=!0,await zi(t.remoteStore,!0);for(const i of s)ti(t.remoteStore,i)}else if(e===!1&&t.gc!==!1){const n=[];let s=Promise.resolve();t.Pc.forEach(((i,a)=>{t.sharedClientState.isLocalQueryTarget(a)?n.push(a):s=s.then((()=>(Nn(t,a),xn(t.localStore,a,!0)))),Sn(t.remoteStore,a)})),await s,await pu(t,n),(function(a){const o=R(a);o.Ac.forEach(((u,c)=>{Sn(o.remoteStore,c)})),o.Vc.t_(),o.Ac=new Map,o.Rc=new q(A.comparator)})(t),t.gc=!1,await zi(t.remoteStore,!1)}}async function pu(r,e,t){const n=R(r),s=[],i=[];for(const a of e){let o;const u=n.Pc.get(a);if(u&&u.length!==0){o=await vs(n.localStore,Q(u[0])?u[0]:Re(u[0]));for(const c of u){const l=n.Tc.get(c),h=await yp(n,l);h.snapshot&&i.push(h.snapshot)}}else{const c=await Ll(n.localStore,a);o=await vs(n.localStore,c),await Ya(n,rh(c),a,!1,o.resumeToken)}s.push(o)}return n.hc.Tn(i),s}function rh(r){return Qe(r)?r:ac(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function wp(r){return(function(t){return R(R(t).persistence).Ro()})(R(r).localStore)}async function Ap(r,e,t,n){const s=R(r);if(s.gc)return void I($n,"Ignoring unexpected query state notification.");const i=s.Pc.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{let a;if(Q(i[0]))switch(We(i[0])){case"collection_group":case"collection":a=await qi(s.localStore,el(i[0]));break;case"documents":a=await(function(c,l){const h=R(c),d=C(...ps(l).map((_=>A.fromPath(_))));return h.persistence.runTransaction("Get documents for pipeline","readonly",(_=>h.ko.getEntries(_,d))).then((_=>_))})(s.localStore,i[0]);break;default:Ce(""),a=Rt()}else a=await qi(s.localStore,(function(c){return c.collectionGroup||(c.path.length%2==1?c.path.lastSegment():c.path.get(c.path.length-2))})(i[0]));const o=Ln.createSynthesizedRemoteEventForCurrentChange(e,t==="current",K.EMPTY_BYTE_STRING);await At(s,a,o);break}case"rejected":await xn(s.localStore,e,!0),Nn(s,e,n);break;default:V(64155,t)}}async function Vp(r,e,t){const n=ni(r);if(n.gc){for(const s of e){if(n.Pc.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){I($n,"Adding an already active target "+s);continue}const i=await Ll(n.localStore,s),a=await vs(n.localStore,i);await Ya(n,rh(i),a.targetId,!1,a.resumeToken),ti(n.remoteStore,a)}for(const s of t)n.Pc.has(s)&&await xn(n.localStore,s,!1).then((()=>{Sn(n.remoteStore,s),Nn(n,s)})).catch(Et)}}function ni(r){const e=R(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=th.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=gp.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=dp.bind(null,e),e.hc.Tn=tp.bind(null,e.eventManager),e.hc.wc=np.bind(null,e.eventManager),e}function eo(r){const e=R(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=fp.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=mp.bind(null,e),e}class Pr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ls(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return Dl(this.persistence,new Nl,e.initialUser,this.serializer)}Dc(e){return new Ua(Zs.b_,this.serializer)}vc(e){return new jl}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Pr.provider={build:()=>new Pr};class vp extends Pr{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){E(this.persistence.referenceDelegate instanceof Vs,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Mc(n,e.asyncQueue,t)}Dc(e){const t=this.cacheSizeBytes!==void 0?he.withCacheSize(this.cacheSizeBytes):he.DEFAULT;return new Ua((n=>Vs.b_(n,t)),this.serializer)}}class sh extends Pr{constructor(e,t,n){super(),this.Oc=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Oc.initialize(this,e),await eo(this.Oc.syncEngine),await Bn(this.Oc.remoteStore),await this.persistence.eo((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}xc(e){return Dl(this.persistence,new Nl,e.initialUser,this.serializer)}Cc(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Mc(n,e.asyncQueue,t)}Fc(e,t){const n=new X_(t,this.persistence);return new J_(e.asyncQueue,n)}Dc(e){const t=Cl(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?he.withCacheSize(this.cacheSizeBytes):he.DEFAULT;return new Ba(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Wl(),is(),this.serializer,this.sharedClientState,!!this.forceOwnership)}vc(e){return new jl}}class Rp extends sh{constructor(e,t){super(e,t,!1),this.Oc=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Oc.syncEngine;this.sharedClientState instanceof mi&&(this.sharedClientState.syncEngine={Au:Tp.bind(null,t),Vu:Ap.bind(null,t),du:Vp.bind(null,t),Ro:wp.bind(null,t),Ru:Ip.bind(null,t)},await this.sharedClientState.start()),await this.persistence.eo((async n=>{await Ep(this.Oc.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}vc(e){const t=Wl();if(!mi.Ye(t))throw new T(p.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Cl(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new mi(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class br{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>_u(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=pp.bind(null,this.syncEngine),await zi(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new ep})()}createDatastore(e){const t=Ls(e.databaseInfo.databaseId),n=Fd(e.databaseInfo);return zd(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,a,o){return new B_(n,s,i,a,o)})(this.localStore,this.datastore,e.asyncQueue,(t=>_u(this.syncEngine,t,0)),(function(){return No.Ye()?new No:new kd})())}createSyncEngine(e,t){return(function(s,i,a,o,u,c,l){const h=new ap(s,i,a,o,u,c);return l&&(h.gc=!0),h})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=R(s);I(Ke,"RemoteStore shutting down."),i.la.add(5),await qr(i),i.ha.shutdown(),i.Ta.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}br.provider={build:()=>new br};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const It="FirestoreClient";class Pp{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=se.UNAUTHENTICATED,this.clientId=Ji.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async a=>{I(It,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(n,(a=>(I(It,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new je;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=ja(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function _i(r,e){r.asyncQueue.verifyOperationInProgress(),I(It,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await kl(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function gu(r,e){r.asyncQueue.verifyOperationInProgress();const t=await bp(r);I(It,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>lu(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>lu(e.remoteStore,s))),r._onlineComponents=e}async function bp(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){I(It,"Using user provided OfflineComponentProvider");try{await _i(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===p.FAILED_PRECONDITION||s.code===p.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Ce("Error using user provided cache. Falling back to memory cache: "+t),await _i(r,new Pr)}}else I(It,"Using default OfflineComponentProvider"),await _i(r,new vp(void 0));return r._offlineComponents}async function ih(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(I(It,"Using user provided OnlineComponentProvider"),await gu(r,r._uninitializedComponentsProvider._online)):(I(It,"Using default OnlineComponentProvider"),await gu(r,new br))),r._onlineComponents}function xp(r){return ih(r).then((e=>e.syncEngine))}async function ji(r){const e=await ih(r),t=e.eventManager;return t.onListen=op.bind(null,e.syncEngine),t.onUnlisten=cp.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=up.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=lp.bind(null,e.syncEngine),t}function Sp(r,e,t,n){const s=new zl(n),i=new Jl(e,s,t);return r.asyncQueue.enqueueAndForget((async()=>Hl(await ji(r),i))),()=>{s.Va(),r.asyncQueue.enqueueAndForget((async()=>Yl(await ji(r),i)))}}function Cp(r,e,t={}){const n=new je;return r.asyncQueue.enqueueAndForget((async()=>(function(i,a,o,u,c){const l=new zl({next:d=>{l.Va(),a.enqueueAndForget((()=>Yl(i,h)));const _=d.docs.has(o);!_&&d.fromCache?c.reject(new T(p.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&d.fromCache&&u&&u.source==="server"?c.reject(new T(p.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(d)},error:d=>c.reject(d)}),h=new Jl(Dr(o.path),l,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Hl(i,h)})(await ji(r),r.asyncQueue,e,t,n))),n.promise}function Np(r,e){const t=new je;return r.asyncQueue.enqueueAndForget((async()=>hp(await xp(r),e,t))),t.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ah=class{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new j(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Dp(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(_t("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},Dp=class extends ah{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kp{convertValue(e,t="none"){switch(J(e)){case 0:return null;case 1:return e.booleanValue;case 2:return $(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Je(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw V(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Tt(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[zt].arrayValue)==null?void 0:s.values)==null?void 0:i.map((a=>$(a.doubleValue)));return new Te(t)}convertGeoPoint(e){return new $e($(e.latitude),$(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Cr(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(_n(e));default:return null}}convertTimestamp(e){const t=Ye(e);return new F(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=N.fromString(e);E(vc(n),9688,{name:e});const s=new $t(n.get(1),n.get(3)),i=new A(n.popFirst(5));return s.isEqual(t)||W(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oh(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yu="AsyncQueue";class Iu{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new Sc(this,"async_queue_retry"),this.Hc=()=>{const n=is();n&&I(yu,"Visibility state changed to "+n.visibilityState),this.Ht.$t()},this.Jc=e;const t=is();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;const t=is();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise((()=>{}));const t=new je;return this.Zc((()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.$c.push(e),this.Xc())))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!wt(e))throw e;I(yu,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt((()=>this.Xc()))}}Zc(e){const t=this.Jc.then((()=>(this.Gc=!0,e().catch((n=>{throw this.Wc=n,this.Gc=!1,W("INTERNAL UNHANDLED ERROR: ",Tu(n)),n})).then((n=>(this.Gc=!1,n))))));return this.Jc=t,t}enqueueAfterDelay(e,t,n){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);const s=Qa.createAndSchedule(this,e,t,n,(i=>this.el(i)));return this.Qc.push(s),s}Yc(){this.Wc&&V(47125,{tl:Tu(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(const t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then((()=>{this.Qc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()}))}sl(e){this.jc.push(e)}el(e){const t=this.Qc.indexOf(e);this.Qc.splice(t,1)}}function Tu(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class jt extends Or{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Iu,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Iu(e),this._firestoreClient=void 0,await e}}}function Zp(r,e,t){t||(t=lr);const n=Ru(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(Pu(i,e))return s;throw new T(p.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new T(p.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Lc)throw new T(p.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Wi(e.host)&&bu(e.host),n.initialize({options:e,instanceIdentifier:t})}function eg(r,e){const t=typeof r=="object"?r:mh(),n=typeof r=="string"?r:lr,s=Ru(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=_h("firestore");i&&Yd(s,...i)}return s}function ri(r){if(r._terminated)throw new T(p.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Op(r),r._firestoreClient}function Op(r){var n,s,i,a;const e=r._freezeSettings(),t=Gd(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new Pp(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(u){const c=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(c),_online:c}})(r._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh extends kp{constructor(e){super(),this.firestore=e}convertBytes(e){return new Se(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new j(this.firestore,null,t)}}class Xn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Bt extends ah{constructor(e,t,n,s,i,a){super(e,t,n,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new as(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(_t("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new T(p.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Bt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Bt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Bt._jsonSchema={type:Y("string",Bt._jsonSchemaVersion),bundleSource:Y("string","DocumentSnapshot"),bundleName:Y("string"),bundle:Y("string")};class as extends Bt{data(e={}){return super.data(e)}}class dn{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Xn(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new as(this._firestore,this._userDataWriter,n.key,n,new Xn(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new T(p.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((o=>{Q(s._snapshot.query)?Ui(s._snapshot.query):ua(s.query._query);const u=new as(s._firestore,s._userDataWriter,o.doc.key,o.doc,new Xn(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);return o.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((o=>i||o.type!==3)).map((o=>{const u=new as(s._firestore,s._userDataWriter,o.doc.key,o.doc,new Xn(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,l=-1;return o.type!==0&&(c=a.indexOf(o.doc.key),a=a.delete(o.doc.key)),o.type!==1&&(a=a.add(o.doc),l=a.indexOf(o.doc.key)),{type:Lp(o.type),doc:u,oldIndex:c,newIndex:l}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new T(p.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=dn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ji.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Lp(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return V(61501,{type:r})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */dn._jsonSchemaVersion="firestore/querySnapshot/1.0",dn._jsonSchema={type:Y("string",dn._jsonSchemaVersion),bundleSource:Y("string","QuerySnapshot"),bundleName:Y("string"),bundle:Y("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mp(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new T(p.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class to{}class Fp extends to{}function tg(r,e,...t){let n=[];e instanceof to&&n.push(e),n=n.concat(t),(function(i){const a=i.filter((u=>u instanceof no)).length,o=i.filter((u=>u instanceof si)).length;if(a>1||a>0&&o>0)throw new T(p.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class si extends Fp{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new si(e,t,n)}_apply(e){const t=this._parse(e);return ch(e._query,t),new Wt(e.firestore,e.converter,Vi(e._query,t))}_parse(e){const t=pa(e.firestore);return(function(i,a,o,u,c,l,h){let d;if(c.isKeyField()){if(l==="array-contains"||l==="array-contains-any")throw new T(p.INVALID_ARGUMENT,`Invalid Query. You can't perform '${l}' queries on documentId().`);if(l==="in"||l==="not-in"){wu(h,l);const y=[];for(const v of h)y.push(Eu(u,i,v));d={arrayValue:{values:y}}}else d=Eu(u,i,h)}else l!=="in"&&l!=="not-in"&&l!=="array-contains-any"||wu(h,l),d=nf(o,a,h,l==="in"||l==="not-in");return L.create(c,l,d)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function ng(r,e,t){const n=e,s=_t("where",r);return si._create(s,n,t)}class no extends to{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new no(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:B.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let a=s;const o=i.getFlattenedFilters();for(const u of o)ch(a,u),a=Vi(a,u)})(e._query,t),new Wt(e.firestore,e.converter,Vi(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function Eu(r,e,t){if(typeof(t=Oe(t))=="string"){if(t==="")throw new T(p.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!oc(e)&&t.indexOf("/")!==-1)throw new T(p.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(N.fromString(t));if(!A.isDocumentKey(n))throw new T(p.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return dr(r,new A(n))}if(t instanceof j)return dr(r,t._key);throw new T(p.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${xs(t)}.`)}function wu(r,e){if(!Array.isArray(r)||r.length===0)throw new T(p.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function ch(r,e){const t=(function(s,i){for(const a of s)for(const o of a.getFlattenedFilters())if(i.indexOf(o.op)>=0)return o.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new T(p.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new T(p.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Au(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}class Up{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=$p(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function rg(r){return new Up(r)}class Bp{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=br.provider,this._offlineComponentProvider={build:t=>new sh(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class qp{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=br.provider,this._offlineComponentProvider={build:t=>new Rp(t,e==null?void 0:e.cacheSizeBytes)}}}function $p(r){return new Bp(r==null?void 0:r.forceOwnership)}function sg(){return new qp}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=pa(e)}set(e,t,n){this._verifyNotCommitted();const s=pi(e,this._firestore),i=oh(s.converter,t,n),a=$c(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(a.toMutation(s._key,ue.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=pi(e,this._firestore);let a;return a=typeof(t=Oe(t))=="string"||t instanceof Ms?tf(this._dataReader,"WriteBatch.update",i._key,t,n,s):ef(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,ue.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=pi(e,this._firestore);return this._mutations=this._mutations.concat(new Nr(t._key,ue.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new T(p.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function pi(r,e){if((r=Oe(r)).firestore!==e)throw new T(p.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ig(r){r=ke(r,j);const e=ke(r.firestore,jt),t=ri(e);return Cp(t,r._key).then((n=>lh(e,r,n)))}function ag(r,e,t){r=ke(r,j);const n=ke(r.firestore,jt),s=oh(r.converter,e,t),i=pa(n);return ro(n,[$c(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,ue.none())])}function og(r){return ro(ke(r.firestore,jt),[new Nr(r._key,ue.none())])}function ug(r,...e){var c,l,h;r=Oe(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Au(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Au(e[n])){const d=e[n];e[n]=(c=d.next)==null?void 0:c.bind(d),e[n+1]=(l=d.error)==null?void 0:l.bind(d),e[n+2]=(h=d.complete)==null?void 0:h.bind(d)}let i,a,o;if(r instanceof j)a=ke(r.firestore,jt),o=Dr(r._key.path),i={next:d=>{e[n]&&e[n](lh(a,r,d))},error:e[n+1],complete:e[n+2]};else{const d=ke(r,Wt);a=ke(d.firestore,jt),o=d._query;const _=new uh(a);i={next:y=>{e[n]&&e[n](new dn(a,_,d,y))},error:e[n+1],complete:e[n+2]},Mp(r._query)}const u=ri(a);return Sp(u,o,s,i)}function ro(r,e){const t=ri(r);return Np(t,e)}function lh(r,e,t){const n=t.docs.get(e._key),s=new uh(r);return new Bt(r,s,e._key,n,new Xn(t.hasPendingWrites,t.fromCache),e.converter)}function cg(r){return r=ke(r,jt),ri(r),new zp(r,(e=>ro(r,e)))}const Vu="@firebase/firestore",vu="4.17.2";(function(e,t=!0){bh(Ph),vh(new Rh("firestore",((n,{instanceIdentifier:s,options:i})=>{const a=n.getProvider("app").getImmediate(),o=new jt(new Sd(n.getProvider("auth-internal")),new Dd(a,n.getProvider("app-check-internal")),Mh(a,s),a);return i={useFetchStreams:t,...i},o._setSettings(i),o}),"PUBLIC").setMultipleInstances(!0)),io(Vu,vu,e),io(Vu,vu,"esm2020")})();export{sg as a,ig as b,Hp as c,Yp as d,Wp as e,Pd as f,eg as g,og as h,Zp as i,cg as j,ug as o,rg as p,tg as q,ag as s,ng as w};

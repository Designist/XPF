!function(e){var t={};function s(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}([function(e,t,s){const r=s(1);s(2);function n(e,t){return ret=e,e.match(/\{[^}]+\}/g).forEach(function(e){key=e.replace(/[{}]/g,""),ret=ret.replace(e,t[key])}),ret}class o{constructor(e,t){const s=["sfrom","sto","precede","follow","weight"];for(var r=0;r<s.length;r++){let o=s[r],i=e[o];const l=new RegExp("{.*}");for(;l.test(i);)i=n(i,t);this[o]=i}this.weight=parseFloat(this.weight),this.sfrom_save=this.sfrom,this.sfrom=new RegExp(this.sfrom),this.precede=new RegExp(this.precede+"$"),this.follow=new RegExp("^"+this.follow)}sub_score(e,t,s){return this.sfrom.test(e)&&this.precede.test(t)&&this.follow.test(s)?this.weight:null}sub(e){return e.replace(this.sfrom_save,this.sto)}}new class{constructor(e){this.rule_list=function(e){const t=r.readFileSync(e,"utf8").split("\n");let s=t[0].split(",");for(var n=0;n<t.length;n++)if(t[n].length>0&&"#"!=t[n][0]){s=t[n].split(",");break}var o=[];for(n=0;n<t.length;n++)if(t[n].length>0&&"#"!=t[n][0]){var i=t[n].split(",");if(i[0]!=s[0]){for(var l={},u=0;u<s.length;u++)l[s[u]]=i[u];o.push(l)}}return o}(e),this.classes={},this.subs=new Set([]),this.ipasubs=new Set([]),this.words={},this.pre=[],this.NO_TRANSLATE="@";for(var t=0;t<this.rule_list.length;t++){let e=this.rule_list[t];if("pre"==e.type)this.pre.push([e.sfrom,e.sto]);else if("class"==e.type)this.classes[e.sfrom]=e.sto;else if("sub"==e.type){let t=new o(e,this.classes);this.subs.add(t)}else if("ipasub"==e.type){let t=new o(e,this.classes);this.ipasubs.add(t)}else"word"==e.type?this.words[e.sfrom]=e.sto.split():console.log("Unrecognized rule type.")}}translate(e){if(e in this.words)return this.words[e];for(var t=0;t<this.pre.length;t++){let s=this.pre[t];e=e.replace(s[0],s[1])}var s=(e=e.toLowerCase()).split(""),r=[];for(t=0;t<s.length;t++){let e=s[t],i=s.slice(0,t).join(""),l=s.slice(t+1).join("");var n=[];if(this.subs.forEach(function(t){let s=[t.sub_score(e,i,l),t.sub(e)];n.push(s)}),(n=n.filter(e=>e[0])).length>0){var o=n.sort(function(e,t){return t[0]-e[0]})[0][1];o.length>0&&r.push(o)}else r.push(this.NO_TRANSLATE)}var i=r.join(" ");l=i,console.log(l);var l,u=[];for(this.subs.forEach(function(e){let t=[e.weight,e];u.push(t)}),u=u.sort(function(e,t){return t[0]-e[0]}),t=0;t<u.length;t++)i=u[t][1].sub(i);return i.split()}}("mt.rules").translate("bniet")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("http")}]);
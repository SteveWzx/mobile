if(!window.jQuery){var jQuery=Zepto;(function(A){["width","height"].forEach(function(B){A.fn[B]=function(D){var G,C=document.body,E=document.documentElement,F=B.replace(/./,function(H){return H[0].toUpperCase()});if(D===undefined){return this[0]==window?E["client"+F]:this[0]==document?Math.max(C["scroll"+F],C["offset"+F],E["client"+F],E["scroll"+F],E["offset"+F]):(G=this.offset())&&G[B]}else{return this.each(function(H){A(this).css(B,D)})}}});["width","height"].forEach(function(B){var D,C=B.replace(/./,function(E){return E[0].toUpperCase()});A.fn["outer"+C]=function(H){var G=this;if(G){var E=G[0]["offset"+C],F={"width":["left","right"],"height":["top","bottom"]};F[B].forEach(function(I){if(H){E+=parseInt(G.css("margin-"+I),10)}});return E}else{return null}}});["width","height"].forEach(function(B){var D,C=B.replace(/./,function(E){return E[0].toUpperCase()});A.fn["inner"+C]=function(){var G=this;if(G[0]["inner"+C]){return G[0]["inner"+C]}else{var E=G[0]["offset"+C],F={"width":["left","right"],"height":["top","bottom"]};F[B].forEach(function(H){E-=parseInt(G.css("border-"+H+"-width"),10)});return E}}});["Left","Top"].forEach(function(B,E){var C="scroll"+B;function D(G){return G&&typeof G==="object"&&"setInterval" in G}function F(G){return D(G)?G:G.nodeType===9?G.defaultView||G.parentWindow:false}A.fn[C]=function(I){var G,H;if(I===undefined){G=this[0];if(!G){return null}H=F(G);return H?("pageXOffset" in H)?H[E?"pageYOffset":"pageXOffset"]:H.document.documentElement[C]||H.document.body[C]:G[C]}this.each(function(){H=F(this);if(H){var J=!E?I:A(H).scrollLeft(),K=E?I:A(H).scrollTop();H.scrollTo(J,K)}else{this[C]=I}})}});A._extend=A.extend;A.extend=function(){arguments[0]=arguments[0]||{};return A._extend.apply(this,arguments)}})(jQuery)};
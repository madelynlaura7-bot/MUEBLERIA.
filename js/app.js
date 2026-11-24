(() => {
 'use strict';
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const PHONE_BUSINESS='59174035358';
 const state={products:[],category:'Todos',search:'',sort:'featured',cart:[],hydrated:false};
 const money=n=>'Bs '+Number(n).toLocaleString('es-BO',{minimumFractionDigits:2,maximumFractionDigits:2});
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const local=(k,v)=>{try{localStorage.setItem('casa-nativa-'+k,JSON.stringify(v));}catch(e){console.warn('No se pudo guardar localmente',e);}};
 const read=(k,d)=>{try{return JSON.parse(localStorage.getItem('casa-nativa-'+k))??d;}catch{return d;}};
 state.cart=read('cart',[]);
 let toastTimer=null;
 function log(message){const li=document.createElement('li');li.textContent=new Date().toLocaleTimeString()+' · '+message;$('#logList').prepend(li);while($('#logList').children.length>30)$('#logList').lastElementChild.remove();}
 function toast(message){const el=$('#toast');el.textContent=message;if(window.jQuery){$(el).stop(true,true).fadeIn(150);clearTimeout(toastTimer);toastTimer=setTimeout(()=>$(el).fadeOut(220),3000);}else{el.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.style.display='none',3000);}}
 function safeMarkup(markup){return window.DOMPurify?DOMPurify.sanitize(markup):markup;}
 async function loadProducts(){try{const response=await fetch('./data/muebles.json');if(!response.ok)throw Error('No se pudo consultar la carta');state.products=await response.json();renderFilters();renderProducts();renderCart();log('Catálogo cargado desde JSON con Fetch API.');}catch(error){$('#carousel').textContent='No se pudo cargar el catálogo. Comprueba la conexión y vuelve a intentarlo.';log('Error al cargar muebles.json.');}}
 function renderFilters(){const cats=['Todos',...new Set(state.products.map(p=>p.category))];$('#filters').innerHTML=safeMarkup(cats.map(c=>`<button type="button" class="filter ${c===state.category?'active':''}" data-category="${esc(c)}">${esc(c)}</button>`).join(''));}
 function getProducts(){let list=state.products.filter(p=>(state.category==='Todos'||p.category===state.category)&&`${p.name} ${p.description} ${p.category} ${p.material}`.toLowerCase().includes(state.search));if(state.sort==='low')list.sort((a,b)=>a.price-b.price);if(state.sort==='high')list.sort((a,b)=>b.price-a.price);if(state.sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name,'es'));return list;}
 function renderProducts(){const list=getProducts();if(!list.length){$('#carousel').innerHTML='<div class="empty">No encontramos muebles con esos criterios. Prueba otra búsqueda.</div>';return;}
 const html=list.map(p=>`<article class="product" data-product="${esc(p.id)}"><div class="product__image"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="1100" height="930" loading="lazy"><span class="product__tag">${esc(p.tag)}</span></div><div class="product__body"><span class="product__category">${esc(p.category)}</span><h3>${esc(p.name)}</h3><p class="product__desc">${esc(p.description)}</p><div class="product__colors">${p.colors.map(c=>`<span class="color-chip">${esc(c)}</span>`).join('')}</div><button class="details" type="button" aria-expanded="false">Materiales y detalles +</button><div class="details-panel"><b>Materiales:</b> ${esc(p.material)}<br><b>Acabados:</b> ${p.colors.map(esc).join(' · ')}<br>Consulta medidas, fabricación y disponibilidad.</div><div class="product__bottom"><span class="price">${money(p.price)} <small>REFERENCIAL</small></span><button type="button" class="add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.name)}">+</button></div></div></article>`).join('');
 $('#carousel').innerHTML=safeMarkup(html);
 }
 function add(id){const p=state.products.find(x=>x.id===id);if(!p)return;const found=state.cart.find(x=>x.id===id);if(found)found.qty++;else state.cart.push({id,qty:1});local('cart',state.cart);renderCart();toast(p.name+' agregado a tu selección.');log('Producto agregado: '+p.name);}
 function changeQty(id,delta){const row=state.cart.find(x=>x.id===id);if(!row)return;row.qty+=delta;if(row.qty<=0)state.cart=state.cart.filter(x=>x.id!==id);local('cart',state.cart);renderCart();}
 function renderCart(){let total=0,count=0;const box=$('#cartItems');if(!state.cart.length)box.innerHTML='<p class="muted">Tu selección está vacía por ahora.</p>';else box.innerHTML=safeMarkup(state.cart.map(row=>{const p=state.products.find(x=>x.id===row.id);if(!p)return'';total+=p.price*row.qty;count+=row.qty;return `<div class="cart-line"><div class="cart-line__name">${esc(p.name)}<small>${money(p.price)} · ${row.qty} unidad(es)</small></div><div class="quantity"><button type="button" data-minus="${esc(p.id)}" aria-label="Quitar una unidad">−</button><span>${row.qty}</span><button type="button" data-plus="${esc(p.id)}" aria-label="Agregar una unidad">+</button></div></div>`;}).join(''));$('#count').textContent=count+' producto(s)';$('#total').textContent=money(total);}
 function setField(id,errorId,message){const field=$('#'+id),wrap=field.closest('.field');$('#'+errorId).textContent=message;wrap.classList.toggle('invalid',!!message);wrap.classList.toggle('valid',!message&&field.value.trim()!=='');return !message;}
 function validName(){const v=$('#customerName').value.trim();return setField('customerName','nameError',v.length<3?'Ingresa al menos 3 caracteres.':v.length>70?'El nombre supera el máximo permitido.':/[<>]/.test(v)?'No se permiten esos caracteres.':'');}
 function validPhone(){const v=$('#customerPhone').value.replace(/\D/g,'');$('#customerPhone').value=v;return setField('customerPhone','phoneError',!/^[67]\d{7}$/.test(v)?'Ingresa un número boliviano válido de 8 dígitos (comienza con 6 o 7).':'');}
 function validEmail(){const v=$('#customerEmail').value.trim();return setField('customerEmail','emailError',!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'Ingresa un correo electrónico válido.':'');}
 function validZone(){return setField('zone','zoneError',$('#zone').value?'':'Selecciona una zona o ciudad.');}
 function validAddress(){const v=$('#address').value.trim();return setField('address','addressError',v.length<5?'Escribe una dirección o referencia (mínimo 5 caracteres).':v.length>120?'La dirección supera el máximo permitido.':'');}
 function validateAll(){const a=[validName(),validPhone(),validEmail(),validZone(),validAddress()];const terms=$('#terms').checked;$('#termsError').textContent=terms?'':'Debes aceptar el aviso para continuar.';if(!state.cart.length){toast('Primero agrega al menos un mueble a tu selección.');a.push(false);}if(!terms)a.push(false);return a.every(Boolean);}
 function sendWhatsApp(){const name=$('#customerName').value.trim(),phone=$('#customerPhone').value.trim(),email=$('#customerEmail').value.trim(),zone=$('#zone').value,address=$('#address').value.trim(),notes=$('#notes').value.trim();const lines=state.cart.map(r=>{const p=state.products.find(x=>x.id===r.id);return p?`- ${p.name} x${r.qty} (${money(p.price*r.qty)})`:'';}).filter(Boolean);const total=state.cart.reduce((sum,r)=>sum+(state.products.find(p=>p.id===r.id)?.price||0)*r.qty,0);const msg=`Hola, Casa Nativa. Quisiera consultar por estos muebles:\n${lines.join('\n')}\nTotal referencial: ${money(total)}\n\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${email}\nZona: ${zone}\nDirección/referencia: ${address}\nDetalles: ${notes||'Sin detalles adicionales'}\n\nPor favor, confirmar disponibilidad, medidas, materiales, precio final y entrega.`;const history=read('consultas',[]);history.unshift({date:new Date().toISOString(),name,phone,email,zone,address,notes,items:state.cart,total});local('consultas',history.slice(0,20));log('Consulta validada y preparada para WhatsApp.');window.open(`https://wa.me/${PHONE_BUSINESS}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');toast('Se preparó tu consulta. Revisa WhatsApp para enviarla.');}
 function hydrate(){if(state.hydrated){toast('La interfaz ya está hidratada.');return;}if(!window.jQuery){toast('No se pudo cargar jQuery. Comprueba tu conexión.');return;}
  // Hidratación: conecta eventos al DOM ya renderizado, sin reconstruir la interfaz.
  // .off() evita acumular listeners si el proceso se ejecuta nuevamente.
  const $doc=$(document);
  $doc.off('.casaNativa');
  $doc.on('click.casaNativa','#filters [data-category]',function(){state.category=this.dataset.category;renderFilters();renderProducts();log('Filtro de categoría: '+state.category);});
  $doc.on('click.casaNativa','#carousel [data-add]',function(){add(this.dataset.add);});
  $doc.on('click.casaNativa','#carousel .details',function(){const panel=this.nextElementSibling,open=this.getAttribute('aria-expanded')==='true';this.setAttribute('aria-expanded',String(!open));this.textContent=open?'Materiales y detalles +':'Ocultar detalles −';$(panel).stop(true,true).slideToggle(180);});
  $doc.on('click.casaNativa','#cartItems [data-plus]',function(){changeQty(this.dataset.plus,1);});
  $doc.on('click.casaNativa','#cartItems [data-minus]',function(){changeQty(this.dataset.minus,-1);});
  $doc.on('input.casaNativa','#search',function(){state.search=this.value.trim().toLowerCase();renderProducts();});
  $doc.on('change.casaNativa','#sort',function(){state.sort=this.value;renderProducts();});
  $doc.on('click.casaNativa','#prev',()=>$('#carousel').scrollBy({left:-$('#carousel').clientWidth*.8,behavior:'smooth'}));
  $doc.on('click.casaNativa','#next',()=>$('#carousel').scrollBy({left:$('#carousel').clientWidth*.8,behavior:'smooth'}));
  $doc.on('click.casaNativa','#clearCart',()=>{state.cart=[];local('cart',state.cart);renderCart();toast('Selección vaciada.');});
  $doc.on('click.casaNativa','#themeBtn',()=>{document.body.classList.toggle('dark');local('dark',document.body.classList.contains('dark'));log('Tema visual actualizado.');});
  $doc.on('click.casaNativa','#menuBtn',function(){const open=$('#nav').classList.toggle('open');this.setAttribute('aria-expanded',String(open));$('#nav').style.display=open?'flex':'';});
  $doc.on('click.casaNativa','#nav a',()=>{$('#nav').classList.remove('open');$('#nav').style.display='';$('#menuBtn').setAttribute('aria-expanded','false');});
  $doc.on('submit.casaNativa','#orderForm',function(e){e.preventDefault();$('#formStatus').textContent='';if(!validateAll()){toast('Revisa los campos marcados antes de continuar.');const bad=$('.field.invalid input, .field.invalid select');if(bad)bad.focus();return;}sendWhatsApp();});
  $doc.on('input.casaNativa','#customerName',validName);
  $doc.on('input.casaNativa','#customerPhone',validPhone);
  $doc.on('input.casaNativa','#customerEmail',validEmail);
  $doc.on('change.casaNativa','#zone',validZone);
  $doc.on('input.casaNativa','#address',validAddress);
  $doc.on('click.casaNativa','#clearLog',()=>{$('#logList').replaceChildren();log('Bitácora reiniciada.');});
  $doc.on('click.casaNativa','#logToggle',function(){const panel=$('#eventLog'),opening=panel.hidden;panel.hidden=!opening;this.setAttribute('aria-expanded',String(opening));});
  $doc.on('click.casaNativa','#hydrateBtn',()=>{toast('Interfaz ya hidratada e interactiva.');});
  $doc.on('click.casaNativa','a[href^="#"]',function(){const target=document.querySelector(this.getAttribute('href'));if(target)log('Navegación a '+this.getAttribute('href'));});
  state.hydrated=true;$('#hydrationText').textContent='Interfaz hidratada · Eventos activos';$('#hydrationDot').style.background='#4d9a69';$('.hydration').classList.add('is-ready');$('#hydrateBtn').textContent='Interfaz activa ✓';$('#hydrateBtn').setAttribute('aria-label','Interfaz hidratada');log('Hidratación completada: eventos conectados al DOM existente.');toast('¡Catálogo hidratado! Ya puedes interactuar.');}
 function registerSW(){if('serviceWorker'in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(()=>log('Service Worker registrado.')).catch(()=>log('No se pudo registrar el Service Worker.')));}}
 document.addEventListener('DOMContentLoaded',()=>{if(read('dark',false))document.body.classList.add('dark');$('#year').textContent=new Date().getFullYear();loadProducts();$('#hydrateBtn').addEventListener('click',hydrate);$('#hydrationText').textContent='Interfaz estática · Pulsa hidratar para activar';$('#eventLog').hidden=true;registerSW();});
})();
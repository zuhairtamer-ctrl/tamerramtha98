const glow=document.querySelector('.cursor-glow');
let audioOn=false, audioCtx;
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';document.querySelectorAll('.hero-art .float-chip').forEach((el,i)=>{el.style.transform=`translate(${(e.clientX-innerWidth/2)*(.012+i*.004)}px,${(e.clientY-innerHeight/2)*(.012+i*.004)}px)`})});
function ping(freq=420){if(!audioOn)return;if(!audioCtx)audioCtx=new AudioContext();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.12);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.13)}
document.querySelectorAll('a,button').forEach((el,i)=>el.addEventListener('mouseenter',()=>ping(300+i*18)));
const sound=document.getElementById('soundToggle');sound.addEventListener('click',()=>{audioOn=!audioOn;sound.innerHTML=audioOn?'◉ <span>صوت: ON</span>':'◉ <span>صوت</span>';if(audioOn)ping(620)});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('langToggle').addEventListener('click',e=>{const on=document.documentElement.lang==='ar';document.documentElement.lang=on?'en':'ar';document.documentElement.dir=on?'ltr':'rtl';e.target.textContent=on?'AR':'EN';document.body.classList.toggle('english',on);alert(on?'English interface is available for navigation.':'تمت استعادة الواجهة العربية.');});
const contactForm=document.querySelector('.contact-form');const formStatus=contactForm?.querySelector('.form-status');contactForm?.addEventListener('submit',e=>{if(!contactForm.checkValidity()){e.preventDefault();contactForm.reportValidity();return}ping(700);if(formStatus)formStatus.textContent='جارٍ إرسال رسالتك…';contactForm.querySelector('button[type=submit]').disabled=true;});if(location.search.includes('sent=1')&&formStatus){formStatus.textContent='تم إرسال رسالتك بنجاح، شكراً لتواصلك.';history.replaceState({},document.title,location.pathname+'#contact');}
const workTabs=document.querySelectorAll('.work-tab');const groups=document.querySelectorAll('.media-group');workTabs.forEach(tab=>tab.addEventListener('click',()=>{workTabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');groups.forEach(g=>g.style.display=g.dataset.group===tab.dataset.filter?'grid':'none');ping(520)}));
(function initThree(){if(!window.THREE)return;const canvas=document.getElementById('three-bg'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);camera.position.z=8;const mobile=matchMedia('(max-width: 700px)').matches;const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile});renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.75));renderer.setSize(innerWidth,innerHeight);const group=new THREE.Group();scene.add(group);const material=new THREE.PointsMaterial({color:0x57b994,size:.045,transparent:true,opacity:.75});const geo=new THREE.BufferGeometry(),count=mobile?260:700,positions=new Float32Array(count*3);for(let i=0;i<count*3;i+=3){positions[i]=(Math.random()-.5)*16;positions[i+1]=(Math.random()-.5)*10;positions[i+2]=(Math.random()-.5)*8}geo.setAttribute('position',new THREE.BufferAttribute(positions,3));group.add(new THREE.Points(geo,material));const torus=new THREE.Mesh(new THREE.TorusGeometry(3.7,.008,8,180),new THREE.MeshBasicMaterial({color:0x8bd9bd,transparent:true,opacity:.35}));torus.rotation.x=1.1;group.add(torus);const torus2=torus.clone();torus2.scale.set(.7,.7,.7);torus2.rotation.y=.8;torus2.material=torus.material.clone();torus2.material.color.set(0x9bcfe0);group.add(torus2);let mx=0,my=0;window.addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*.5;my=(e.clientY/innerHeight-.5)*.3});let pageVisible=true;document.addEventListener('visibilitychange',()=>pageVisible=document.visibilityState==='visible');function animate(){requestAnimationFrame(animate);if(!pageVisible)return;group.rotation.y+=(mx-group.rotation.y)*.012;group.rotation.x+=(my-group.rotation.x)*.012;torus.rotation.z+=.0018;torus2.rotation.z-=.001;renderer.render(scene,camera)}animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)})})();
const themeToggle=document.getElementById('themeToggle');const savedTheme=localStorage.getItem('tamer-theme');if(savedTheme==='dark')document.body.classList.add('dark');function syncTheme(){const dark=document.body.classList.contains('dark');themeToggle.innerHTML=dark?'☀ <span>فاتح</span>':'☾ <span>الوضع</span>';themeToggle.setAttribute('aria-label',dark?'تفعيل الوضع الفاتح':'تفعيل الوضع المظلم')}syncTheme();themeToggle.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('tamer-theme',document.body.classList.contains('dark')?'dark':'light');syncTheme();ping(580)});
groups.forEach((g,i)=>{g.hidden=i!==0});workTabs.forEach(tab=>tab.addEventListener('click',()=>groups.forEach(g=>{g.hidden=g.dataset.group!==tab.dataset.filter}))); 


// Preview-only media experience: prevent common download actions while preserving viewing.
(function initPreviewOnly() {
  const modal = document.getElementById('previewModal');
  const stage = document.getElementById('previewStage');
  const caption = document.getElementById('previewCaption');
  if (!modal || !stage) return;
  const mediaType = (url) => {
    const clean = url.split('?')[0].toLowerCase();
    if (/\.(png|jpe?g|gif|webp|svg|avif)$/.test(clean)) return 'image';
    if (/\.(mp4|webm|ogg|mov)$/.test(clean)) return 'video';
    if (/\.mp3$/.test(clean)) return 'audio';
    if (/\.pdf$/.test(clean)) return 'pdf';
    return 'document';
  };
  const close = () => { modal.hidden = true; stage.replaceChildren(); document.body.classList.remove('modal-open'); };
  const open = (url, title) => {
    stage.replaceChildren();
    const type = mediaType(url);
    let el;
    if (type === 'image') { el = document.createElement('img'); el.src = url; el.alt = title; el.draggable = false; }
    else if (type === 'video') { el = document.createElement('video'); el.src = url; el.controls = true; el.controlsList = 'nodownload noplaybackrate'; el.disablePictureInPicture = true; }
    else if (type === 'audio') { el = document.createElement('audio'); el.src = url; el.controls = true; el.controlsList = 'nodownload noplaybackrate'; }
    else {
      el = document.createElement('iframe');
      el.src = url;
      el.title = title;
      el.setAttribute('allow', 'fullscreen');
      // Do not sandbox PDF viewers: browser and Drive PDF plugins need their own viewer context.
      if (type !== 'pdf' && !url.includes('drive.google.com') && !url.includes('view.officeapps.live.com')) el.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    }
    el.className = `preview-${type}`;
    el.addEventListener('contextmenu', e => e.preventDefault());
    stage.appendChild(el); caption.textContent = title;
    modal.hidden = false; document.body.classList.add('modal-open');
  };
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.preview-trigger');
    if (trigger) { e.preventDefault(); open(trigger.dataset.preview, trigger.dataset.title || trigger.textContent.trim()); }
    if (e.target.closest('[data-close-preview]')) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
    if ((e.ctrlKey || e.metaKey) && ['s', 'u', 'p'].includes(e.key.toLowerCase())) e.preventDefault();
  });
  document.addEventListener('contextmenu', e => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
  document.addEventListener('dragstart', e => { if (e.target.matches('img, video, audio, a')) e.preventDefault(); });
  document.querySelectorAll('video, audio').forEach(el => { el.controlsList = 'nodownload noplaybackrate'; el.addEventListener('contextmenu', e => e.preventDefault()); });
})();


// Preview-only media experience: prevent common download actions while preserving viewing.
(function initPreviewOnly() {
  const modal = document.getElementById('previewModal');
  const stage = document.getElementById('previewStage');
  const caption = document.getElementById('previewCaption');
  if (!modal || !stage) return;
  const mediaType = (url) => {
    const clean = url.split('?')[0].toLowerCase();
    if (/\.(png|jpe?g|gif|webp|svg|avif)$/.test(clean)) return 'image';
    if (/\.(mp4|webm|ogg|mov)$/.test(clean)) return 'video';
    if (/\.mp3$/.test(clean)) return 'audio';
    if (/\.pdf$/.test(clean)) return 'pdf';
    return 'document';
  };
  const close = () => { modal.hidden = true; stage.replaceChildren(); document.body.classList.remove('modal-open'); };
  const open = (url, title) => {
    stage.replaceChildren();
    const type = mediaType(url);
    let el;
    if (type === 'image') { el = document.createElement('img'); el.src = url; el.alt = title; el.draggable = false; }
    else if (type === 'video') { el = document.createElement('video'); el.src = url; el.controls = true; el.controlsList = 'nodownload noplaybackrate'; el.disablePictureInPicture = true; }
    else if (type === 'audio') { el = document.createElement('audio'); el.src = url; el.controls = true; el.controlsList = 'nodownload noplaybackrate'; }
    else {
      el = document.createElement('iframe');
      el.src = url;
      el.title = title;
      el.setAttribute('allow', 'fullscreen');
      // Do not sandbox PDF viewers: browser and Drive PDF plugins need their own viewer context.
      if (type !== 'pdf' && !url.includes('drive.google.com') && !url.includes('view.officeapps.live.com')) el.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    }
    el.className = `preview-${type}`;
    el.addEventListener('contextmenu', e => e.preventDefault());
    stage.appendChild(el); caption.textContent = title;
    modal.hidden = false; document.body.classList.add('modal-open');
  };
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.preview-trigger');
    if (trigger) { e.preventDefault(); open(trigger.dataset.preview, trigger.dataset.title || trigger.textContent.trim()); }
    if (e.target.closest('[data-close-preview]')) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
    if ((e.ctrlKey || e.metaKey) && ['s', 'u', 'p'].includes(e.key.toLowerCase())) e.preventDefault();
  });
  document.addEventListener('contextmenu', e => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
  document.addEventListener('dragstart', e => { if (e.target.matches('img, video, audio, a')) e.preventDefault(); });
  document.querySelectorAll('video, audio').forEach(el => { el.controlsList = 'nodownload noplaybackrate'; el.addEventListener('contextmenu', e => e.preventDefault()); });
})();

// Fast local slide viewer for presentations: avoids browser PDF/PPT plugins.
(function initSlideViewer() {
  const modal = document.getElementById('previewModal');
  const stage = document.getElementById('previewStage');
  const caption = document.getElementById('previewCaption');
  if (!modal || !stage) return;
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.preview-trigger[data-slides]');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const slides = trigger.dataset.slides.split(',');
    let current = 0;
    stage.replaceChildren();
    const shell = document.createElement('div');
    shell.className = 'slide-viewer';
    const image = document.createElement('img');
    image.className = 'preview-image';
    image.alt = trigger.dataset.title || 'Presentation slide';
    image.draggable = false;
    const controls = document.createElement('div');
    controls.className = 'slide-controls';
    const previous = document.createElement('button');
    const next = document.createElement('button');
    const counter = document.createElement('span');
    previous.type = next.type = 'button';
    previous.textContent = 'السابق';
    next.textContent = 'التالي';
    const render = () => {
      image.src = slides[current];
      counter.textContent = `${current + 1} / ${slides.length}`;
      previous.disabled = current === 0;
      next.disabled = current === slides.length - 1;
    };
    previous.addEventListener('click', () => { if (current) { current -= 1; render(); } });
    next.addEventListener('click', () => { if (current < slides.length - 1) { current += 1; render(); } });
    controls.append(previous, counter, next);
    shell.append(image, controls);
    stage.appendChild(shell);
    caption.textContent = trigger.dataset.title || 'Presentation';
    modal.hidden = false;
    document.body.classList.add('modal-open');
    render();
  }, true);
})();

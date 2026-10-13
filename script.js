'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const header = $('#header');
const navLinks = $('#navLinks');
const menuToggle = $('#menuToggle');
function updateScroll(){
  header.classList.toggle('scrolled',window.scrollY>20);
  const available=document.documentElement.scrollHeight-window.innerHeight;
  $('#scrollProgress').style.width=(available>0?window.scrollY/available*100:0)+'%';
}
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
menuToggle.addEventListener('click',()=>{
  const open=navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
});
$$('.nav-links a').forEach(link=>link.addEventListener('click',()=>{
  navLinks.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menú');
}));
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
  },{threshold:.1});
  $$('.reveal').forEach(el=>observer.observe(el));
}else{$$('.reveal').forEach(el=>el.classList.add('visible'));}
$$('.risk-card').forEach(card=>card.addEventListener('click',()=>{
  const expanded=card.getAttribute('aria-expanded')==='true';
  card.setAttribute('aria-expanded',String(!expanded));
  card.querySelector('.risk-detail').hidden=expanded;
  card.querySelector('.risk-action').textContent=expanded?'Ver consejo +':'Ocultar consejo −';
}));

// Temporizador de enfoque: 25 minutos
const FOCUS_SECONDS=25*60;
let secondsLeft=FOCUS_SECONDS,timerId=null;
function renderTimer(){const minutes=String(Math.floor(secondsLeft/60)).padStart(2,'0');const seconds=String(secondsLeft%60).padStart(2,'0');$('#timerDisplay').textContent=`${minutes}:${seconds}`;}
$('#timerStart').addEventListener('click',()=>{
  if(timerId!==null){clearInterval(timerId);timerId=null;$('#timerStart').textContent='Continuar';$('#timerMessage').textContent='Sesión pausada';return;}
  if(secondsLeft===0)secondsLeft=FOCUS_SECONDS;
  $('#timerStart').textContent='Pausar';$('#timerMessage').textContent='¡Concéntrate en tu objetivo!';renderTimer();
  timerId=setInterval(()=>{secondsLeft--;renderTimer();if(secondsLeft<=0){clearInterval(timerId);timerId=null;$('#timerStart').textContent='Iniciar otra vez';$('#timerMessage').textContent='¡Sesión terminada! Es momento de descansar.';}},1000);
});
$('#timerReset').addEventListener('click',()=>{if(timerId!==null)clearInterval(timerId);timerId=null;secondsLeft=FOCUS_SECONDS;renderTimer();$('#timerStart').textContent='Iniciar';$('#timerMessage').textContent='Listo para concentrarte';});

// Test educativo
const questions=[
 {q:'Recibes un correo que te pide tu contraseña para evitar el bloqueo de tu cuenta. ¿Qué haces?',a:['Respondo con mi contraseña','Compruebo el remitente y entro al servicio por su web oficial','Reenvío el correo a mis amigos'],correct:1,why:'Nunca compartas tus contraseñas por correo ni por mensajes inesperados.'},
 {q:'¿Cuál es una buena práctica para proteger tus cuentas?',a:['Usar la misma contraseña en todas','Compartir contraseñas con conocidos','Usar contraseñas únicas y activar la verificación en dos pasos'],correct:2,why:'Las contraseñas únicas y el segundo factor reducen el riesgo de acceso no autorizado.'},
 {q:'Ves una noticia impactante en redes sociales. ¿Qué deberías hacer antes de compartirla?',a:['Verificarla con fuentes confiables','Compartirla inmediatamente','Confiar solo en el título'],correct:0,why:'Contrastar la información ayuda a frenar la desinformación.'},
 {q:'Un compañero recibe insultos constantes en un grupo digital. ¿Qué es lo más adecuado?',a:['Unirme a las burlas','Guardar pruebas y buscar ayuda de una persona de confianza','Ignorarlo siempre, sin avisar a nadie'],correct:1,why:'Ante el ciberacoso es importante documentar, denunciar y pedir apoyo.'},
 {q:'¿Qué información conviene evitar publicar de forma abierta?',a:['Una opinión sobre un libro','Una fotografía de un paisaje','Tu dirección, contraseñas y ubicación en tiempo real'],correct:2,why:'Los datos sensibles pueden poner en riesgo tu privacidad y seguridad.'},
 {q:'¿Qué significa tener una huella digital?',a:['El rastro de actividades y datos que dejamos en internet','Una marca física en la pantalla','Una contraseña de seis dígitos'],correct:0,why:'Publicaciones, comentarios y otras actividades pueden formar parte de tu huella digital.'},
 {q:'¿Cuál es un hábito de bienestar digital?',a:['Usar el teléfono toda la noche','Organizar pausas y momentos sin pantallas','Revisar notificaciones cada minuto'],correct:1,why:'El equilibrio entre actividades digitales y fuera de línea favorece el bienestar.'},
 {q:'Antes de subir una foto en la que aparece otra persona, lo responsable es...',a:['Publicarla sin preguntar','Etiquetarla para que todos la vean','Pedirle permiso y respetar su decisión'],correct:2,why:'El consentimiento y el respeto a la privacidad también importan en internet.'}
];
let questionIndex=0,score=0,answered=false;
function renderQuestion(){
  answered=false;const question=questions[questionIndex];
  $('#quizCounter').textContent=`PREGUNTA ${questionIndex+1} DE ${questions.length}`;
  $('#quizScore').textContent=`${score} puntos`;
  $('#quizBar').style.width=`${questionIndex/questions.length*100}%`;
  $('#quizQuestion').textContent=question.q;
  $('#quizFeedback').textContent='';$('#quizHint').textContent='Selecciona una respuesta';
  $('#quizNext').disabled=true;$('#quizNext').textContent=questionIndex===questions.length-1?'Ver resultado →':'Siguiente →';
  const options=$('#quizOptions');options.replaceChildren();
  question.a.forEach((answer,index)=>{
    const button=document.createElement('button');button.type='button';button.className='quiz-option';button.textContent=`${String.fromCharCode(65+index)}. ${answer}`;
    button.addEventListener('click',()=>chooseAnswer(index));options.appendChild(button);
  });
}
function chooseAnswer(index){
  if(answered)return;answered=true;const question=questions[questionIndex];const correct=index===question.correct;
  if(correct)score++;
  $$('.quiz-option').forEach((button,i)=>{button.disabled=true;if(i===question.correct)button.classList.add('correct');else if(i===index)button.classList.add('incorrect');});
  $('#quizFeedback').textContent=(correct?'✓ ¡Correcto! ':'✗ No exactamente. ')+question.why;
  $('#quizHint').textContent=correct?'¡Buen trabajo!':'Aprender también es equivocarse';
  $('#quizScore').textContent=`${score} puntos`;$('#quizNext').disabled=false;
}
$('#quizNext').addEventListener('click',()=>{if(!answered)return;questionIndex++;if(questionIndex<questions.length)renderQuestion();else showResult();});
function showResult(){
  $('#quizBox').hidden=true;$('#quizBox').style.display='none';$('#quizResult').hidden=false;
  $('#resultScore').textContent=`${score} / ${questions.length} puntos`;
  $('#resultEmoji').textContent=score>=7?'🏆':score>=4?'🌟':'📘';
  $('#resultTitle').textContent=score>=7?'¡Excelente conciencia digital!':score>=4?'¡Vas por buen camino!':'¡Cada día puedes aprender más!';
  $('#resultDescription').textContent=score>=7?'Conoces muy bien las prácticas digitales responsables. ¡Sigue aplicándolas!':score>=4?'Tienes una buena base. Revisa los consejos y continúa aprendiendo.':'Explora las secciones de seguridad y bienestar y vuelve a intentarlo.';
}
$('#quizRestart').addEventListener('click',()=>{questionIndex=0;score=0;$('#quizBox').hidden=false;$('#quizBox').style.display='block';$('#quizResult').hidden=true;renderQuestion();});
renderQuestion();

// Compromiso personal
const checks=$$('.commitment-check');
function updateCommitment(){const count=[...checks].filter(input=>input.checked).length;$('#commitmentCount').textContent=`${count} de ${checks.length} compromisos seleccionados`;$('#commitmentButton').disabled=count!==checks.length;$('#commitmentSuccess').hidden=true;}
checks.forEach(check=>check.addEventListener('change',updateCommitment));
$('#commitmentButton').addEventListener('click',()=>{$('#commitmentSuccess').hidden=false;});
$('#year').textContent=new Date().getFullYear();

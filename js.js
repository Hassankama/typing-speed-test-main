let passagesData = null;
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    passagesData = data;
  });

let words = "the sun rose over the quiet town. Birds sang in the trees as people woke up and started their day. It was going to be a warm and sunny morning.".split(" ");
let wordsCount = words.length;
const gameTime = 60 * 1000;
window.timer = null;
window.gameStart = null;
let gameEnded = false;
const WPM=document.getElementById('WPM');
const Accuracy=document.getElementById('Accuracy');
const best=document.getElementById('best')
const finalWPM=document.getElementById('finalWPM')
const finalac=document.getElementById('finalac')
const chars=document.getElementById('chars')
const r=document.getElementById('r')
const finish=document.getElementById('finish')
const finishp=document.getElementById('finishp')
const bimg=document.getElementById('bimg')






let minutes=0;
let right=0;
let wrong=0;

let Best = Number(localStorage.getItem('bestWPM')) || 0;
best.innerText = Best;

function addClass(el,name) {
  el.className += ' '+name;
}
function removeClass(el,name) {
  el.className = el.className.replace(name,'');
}

function loadByDifficulty(level) {
  if (!passagesData) return;
  const list = passagesData[level];
  const randomIndex = Math.floor(Math.random() * list.length);
  const text = list[randomIndex].text;
  words.length = 0;
  text.split(' ').forEach(w => words.push(w));
  wordsCount = words.length;
  right = 0;
  wrong = 0;
  minutes = 0;
  wordIndex = 0;
  newGame();
}



const difficultyRadios = document.querySelectorAll(
  'input[name="difficulty"]'
);

difficultyRadios.forEach(radio => {
  radio.addEventListener('change', () => {

    difficultyRadios.forEach(r => {
      r.closest('.choice').classList.remove('active');
    });

    radio.closest('.choice').classList.add('active');

    const level = radio.value.toLowerCase();
    loadByDifficulty(level);
  });
});

let wordIndex = 0;
function randomWord() {
  const word = words[wordIndex];
  wordIndex++;

  if (wordIndex >= words.length) {
    wordIndex = 0;
  }

  return word;
}

function formatWord(word){
       return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  gameEnded = false;

  clearInterval(window.timer);
  window.timer = null;
  window.gameStart = null;

  document.getElementById('game').classList.remove('disabled');
  document.getElementById('Time').innerText = 60;

  const wordsEl = document.getElementById('words');
  wordsEl.innerHTML = '';

  words.forEach(word => {
    wordsEl.innerHTML += formatWord(word);
  });

  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  
}


function gameOver() {
    gameEnded = true;

  clearInterval(window.timer);
  window.timer = null;

  const totalTime = (new Date().getTime() - window.gameStart) / 1000;
  minutes = totalTime / 60;

  let totalTyped = right + wrong;
  let accuracy = totalTyped === 0 ? 100 : (right / totalTyped) * 100;

  const wpm = Math.round((right / 5) / minutes);

  Accuracy.innerText = Math.round(accuracy) + '%';
  WPM.innerText = wpm;

 const isNewRecord = wpm > Best;

if (isNewRecord) {
  Best = wpm;
  localStorage.setItem('bestWPM', Best);

  bimg.src = 'assets/images/icon-new-pb.svg';
  finish.innerText = "High Score Smashed";
  finishp.innerText = "You're getting faster. That was incredible typing";
} else {
  finish.innerText = "Test Completed";
  finishp.innerText = "Great job! Keep practicing to improve your speed.";
}

best.innerText = `${Best} WPM`;




  best.innerText = `${Best} WPM`;

finalWPM.innerText=wpm;
finalac.innerText = Math.round(accuracy) + '%';

chars.innerText=right;
r.innerText=wrong;


  document.getElementById('game').classList.add('disabled');
  document.querySelector('.congrats').style.display = 'flex';

}



document.getElementById('game').addEventListener('keyup', ev => {
  if (gameEnded) return;
    const key =ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML||" ";
    const isLetter = key.length ===1 && key!== " "
    const isSpace = key===" "
    const isBackspace = key==='Backspace';
    const isFirstLetter=currentLetter===currentWord.firstChild
console.log(key);

  //لو حرف يزود العداد ويشوف correct or incorrect
    if (isLetter) {
      if (currentLetter) {

            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');

            if (key === expected) {
            right++;
            }
              if (key !== expected) {
            wrong++;
            }

            removeClass(currentLetter,'current')

            if (currentLetter.nextSibling) {
            addClass(currentLetter.nextSibling,'current')
            }




      } 
    }

  //لو مسافه يغير ويودينا الجمله الي بعدها
        if (isSpace&&!currentLetter){

            removeClass(currentWord,'current')
            addClass(currentWord.nextSibling,'current')

        if (currentLetter) {
          removeClass(currentLetter,'current')
        }

        addClass(currentWord.nextSibling.firstChild,'current')

    }

    if (isBackspace) {
      if (currentLetter&&isFirstLetter) {
        removeClass(currentWord,'current')
        addClass(currentWord.previousSibling,'current')
        removeClass(currentLetter,'current')
        addClass(currentWord.previousSibling.lastChild,'current')
        removeClass(currentWord.previousSibling.lastChild,'incorrect')
        removeClass(currentWord.previousSibling.lastChild,'correct')
      }
        if (currentLetter&&!isFirstLetter) {
        removeClass(currentLetter,'current')
        addClass(currentLetter.previousSibling,'current')

        removeClass(currentLetter.previousSibling,'incorrect')
        removeClass(currentLetter.previousSibling,'correct')
      }
      if(!currentLetter){
        addClass(currentWord.lastChild,'current')
        removeClass(currentWord.lastChild,'correct')
        removeClass(currentWord.lastChild,'incorrect')


      }
            

    }

      if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
const sLeft = Math.ceil((gameTime - msPassed) / 1000);

document.getElementById('Time').innerText = sLeft;

if (sLeft <= 1 && !gameEnded) {
  document.getElementById('Time').innerText = 0;
  gameOver();
  return;
}

      document.getElementById('Time').innerHTML = sLeft + '';
    }, 1000);
  }

const nextLetter=document.querySelector('.letter.current')
const nextWord=document.querySelector('.word.current')
const cursor=document.getElementById('cursor')
if (nextLetter) {
  cursor.style.top=nextLetter.getBoundingClientRect().top+2+'px'
  cursor.style.left=nextLetter.getBoundingClientRect().left+'px'
}else{
    cursor.style.top=nextWord.getBoundingClientRect().top + 2 + 'px'
  cursor.style.left=nextWord.getBoundingClientRect().right + 'px'
}


});


document.querySelector('.restart').addEventListener('click', function() {
    restartGame();
});

document.querySelector('.restarting').addEventListener('click', () => {
  restartGame();
  document.querySelector('.congrats').style.display = 'none';
});

function restartGame() {
    gameEnded = false;
    right = 0;
    wrong = 0;
    minutes = 0;
    wordIndex = 0;
    
    clearInterval(window.timer);
    window.timer = null;
    window.gameStart = null;
    
    document.getElementById('Time').innerText = 60;
    
    const selectedRadio = document.querySelector('input[name="difficulty"]:checked');
    if (selectedRadio) {
        const level = selectedRadio.value.toLowerCase();
        loadByDifficulty(level);
    } else {
        newGame();
    }
}

newGame()





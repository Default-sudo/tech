
const challenges = [
  {
    name: "HTML Master",
    reward: 100,
    questions: [
      {
        q: "What does HTML stand for?",
        a: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language"],
        correct: 0
      },
      {
        q: "Which tag creates a paragraph?",
        a: ["<h1>", "<p>", "<div>"],
        correct: 1
      },
      {
        q: "Which tag creates a link?",
        a: ["<a>", "<linker>", "<href>"],
        correct: 0
      }
    ]
  },
  {
    name: "CSS Expert",
    reward: 200,
    questions: [
      {
        q: "What does CSS stand for?",
        a: ["Creative Style System", "Cascading Style Sheets", "Computer Style Setup"],
        correct: 1
      },
      {
        q: "Which property changes text color?",
        a: ["font-size", "background", "color"],
        correct: 2
      },
      {
        q: "Which CSS property creates rounded corners?",
        a: ["border-radius", "round", "corner"],
        correct: 0
      }
    ]
  },
  {
    name: "JavaScript Pro",
    reward: 300,
    questions: [
      {
        q: "Which keyword declares a variable?",
        a: ["var", "define", "style"],
        correct: 0
      },
      {
        q: "Which method displays a message?",
        a: ["show()", "alert()", "display()"],
        correct: 1
      },
      {
        q: "Which symbol is used for strict equality?",
        a: ["=", "==", "==="],
        correct: 2
      }
    ]
  }
];

let currentChallenge = 0;
let questionIndex = 0;
let score = 0;
let points = Number(localStorage.getItem("techPoints")) || 0;
let timer;
let timeLeft = 30;
let answered = false;

document.getElementById("points").textContent = points;
document.getElementById("myScore").textContent = points + " XP";

function startChallenge(index) {
  currentChallenge = index;
  questionIndex = 0;
  score = 0;

  const game = document.getElementById("game");
  game.style.display = "block";
  document.getElementById("gameTitle").textContent =
    challenges[index].name;

  game.scrollIntoView({ behavior: "smooth" });
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  answered = false;
  timeLeft = 30;

  const challenge = challenges[currentChallenge];
  const question = challenge.questions[questionIndex];

  document.getElementById("question").textContent =
    question.q;

  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").hidden = true;
  document.getElementById("timer").textContent = "⏱ 30s";

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  question.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;

    button.onclick = () => checkAnswer(index);
    answers.appendChild(button);
  });

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent =
      "⏱ " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(-1);
    }
  }, 1000);
}

function checkAnswer(index) {
  if (answered) return;

  answered = true;
  clearInterval(timer);

  const question =
    challenges[currentChallenge].questions[questionIndex];

  const buttons = document.querySelectorAll(".answer");

  buttons.forEach((button, i) => {
    button.disabled = true;

    if (i === question.correct) {
      button.style.borderColor = "#00ff99";
    }

    if (i === index && index !== question.correct) {
      button.style.borderColor = "#ff526b";
    }
  });

  if (index === question.correct) {
    score++;
    document.getElementById("feedback").textContent =
      "🎉 Correct! Great job!";
  } else {
    document.getElementById("feedback").textContent =
      "❌ Incorrect! The correct answer is highlighted.";
  }

  const next = document.getElementById("nextBtn");
  next.textContent =
    questionIndex === question.a.length - 1 &&
    questionIndex === challenges[currentChallenge].questions.length - 1
      ? "Finish Challenge"
      : "Next Question →";

  next.hidden = false;
}

function nextQuestion() {
  questionIndex++;

  if (questionIndex >= challenges[currentChallenge].questions.length) {
    finishChallenge();
  } else {
    loadQuestion();
  }
}

function finishChallenge() {
  clearInterval(timer);

  const challenge = challenges[currentChallenge];
  const earned = Math.round(
    (score / challenge.questions.length) * challenge.reward
  );

  points += earned;
  localStorage.setItem("techPoints", points);

  document.getElementById("points").textContent = points;
  document.getElementById("myScore").textContent = points + " XP";

  document.getElementById("gameTitle").textContent = "Challenge Complete!";
  document.getElementById("question").textContent =
    `You scored ${score}/${challenge.questions.length} questions!`;

  document.getElementById("answers").innerHTML =
    `<h2 style="color:#00e5ff">🏆 ${earned} XP Earned!</h2>`;

  document.getElementById("feedback").textContent =
    "Keep practicing and become a champion!";

  document.getElementById("nextBtn").hidden = true;
}

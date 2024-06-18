import ShapeFactory from "./ShapeFactory";
import Shape from "./shapes/shape";
import { firestore } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

let elements: Shape[] = []; // Declare elements in the global scope
let gameRunning = false;
let animationFrameId: number;
let intervalId: number | undefined;
let shapeCount = 0;

function initCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  canvas.width = Math.min(screenWidth * 0.8, 1500);
  canvas.height = Math.min(screenHeight * 0.8, 1100);
  return canvas;
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleInstructions");
  const instructionContent = document.getElementById("instructionContent");

  if (instructionContent) {
    instructionContent.id = "instructionContent";
    instructionContent.innerHTML = `
      <h3>The rules of the game:</h3>
      <ul>
        <li>When you click ‘Start’ in the center of the screen, all the elements appear in random places.</li>
        <li>There is a timer at the top of the screen indicating how much time has elapsed.</li>
        <li>If red shape is clicked, the game is over.</li>
        <li>The game ends in a victory once the player selected all the green shapes .</li>
        </ul>
    `;
  }
  if (toggleButton && instructionContent) {
    toggleButton.addEventListener("click", () => {
      instructionContent.classList.toggle("expanded");
    });
  } else {
    console.error("Toggle button or instruction content not found.");
  }

  const canvas = initCanvas();
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function initializeShapes() {
    elements = [];
    shapeCount = 0;

    for (let i = 0; i < 2; i++) {
      //CHANGE TO 15
      const x = getRandomInt(0, canvas.width);
      const y = getRandomInt(0, canvas.height);
      const maxWidth = Math.min(canvas.width - x, 50);
      const maxHeight = Math.min(canvas.height - y, 50);

      let width = getRandomInt(20, maxWidth);
      let height = getRandomInt(20, maxHeight);
      while (Math.abs(width - height) < 5) {
        height = getRandomInt(20, maxHeight);
      }

      const shapeType = getRandomInt(0, 3);
      let newShape: Shape | undefined = undefined;

      switch (shapeType) {
        case 0:
          newShape = ShapeFactory.createShape(
            "collect",
            x,
            y,
            width,
            height,
            stopGame
          );
          break;
        case 1:
          newShape = ShapeFactory.createShape(
            "avoid",
            x,
            y,
            width,
            height,
            stopGame
          );
          break;
        case 2:
          newShape = ShapeFactory.createShape(
            "change",
            x,
            y,
            width,
            width,
            stopGame
          );
          break;
      }
      if (newShape) {
        elements.push(newShape);
        if (shapeType === 0 || shapeType === 2) {
          shapeCount++;
        }
      }
    }
  }

  function startGame() {
    const toggleButton = document.getElementById("toggleInstructions");
    const instructionContent = document.getElementById("instructionContent");
    if (toggleButton && instructionContent) {
      toggleButton.style.visibility = "hidden";
      instructionContent.style.visibility = "hidden";
    }

    gameRunning = true;
    const timerElement = document.getElementsByClassName(
      "timer"
    )[0] as HTMLElement;
    timerElement.classList.remove("paused", "won");
    timerElement.classList.add("running");
    console.log("Game started");
    initializeShapes();
    gameLoop();
    startTimer();
  }

  // Function to stop the game
  function stopGame() {
    gameRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const timerElement = document.getElementsByClassName(
      "timer"
    )[0] as HTMLElement;
    timerElement.classList.remove("running");
    timerElement.classList.add("paused");
    showGameOverMessage("Game Over", true, "Restart");
  }

  function GameWinner() {
    gameRunning = false; // Set game state to stopped
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const timerElement = document.getElementsByClassName(
      "timer"
    )[0] as HTMLElement;
    timerElement.classList.remove("running", "paused");
    timerElement.classList.add("won");
    showGameOverMessage(
      "Congratulations+You won! Enter your name to see your score:",
      false
    );
  }

  // Game loop function to update and draw elements
  function gameLoop() {
    if (!gameRunning) return; // Exit if game is not running
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    elements.forEach((element) => {
      element.update(canvas); // Update element position or state
      element.draw(ctx); // Draw element on canvas
    });
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  canvas.addEventListener("click", (event) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    elements.forEach((element) => {
      let elementWidth: number;
      let elementHeight: number;
      elementWidth = (element as any).getWidth();
      elementHeight = (element as any).getHeight();
      if (
        x > element.getX() &&
        x < element.getX() + elementWidth &&
        y > element.getY() &&
        y < element.getY() + elementHeight
      ) {
        console.log(`Element clicked: ${element.constructor.name}`);
        const wasClicked = element.onClicked();
        if (wasClicked) {
          shapeCount--;
          console.log(`Shapes remaining: ${shapeCount}`);
        }
      }
    });
    if (shapeCount === 0) {
      GameWinner();
    }
  });

  const startButton = document.getElementById(
    "startButton"
  ) as HTMLButtonElement;
  startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    startGame();
  });

  function startTimer() {
    let seconds = 0;
    const timerElement = document.getElementsByClassName(
      "timer"
    )[0] as HTMLElement;
    timerElement.classList.add("running");
    timerElement.classList.remove("paused", "won");
    timerElement.textContent = formatTime(seconds);
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = window.setInterval(() => {
      if (!gameRunning) {
        clearInterval(intervalId);
        timerElement.classList.remove("running");
        timerElement.classList.add("paused");
        return;
      }
      seconds++;
      timerElement.textContent = formatTime(seconds);
    }, 1000);
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  // Function to show game over message
  function showGameOverMessage(
    message: string,
    isGameOver: boolean,
    buttonText?: string
  ) {
    const gameOverDiv = document.createElement("div");
    gameOverDiv.id = "gameOverDiv";
    gameOverDiv.innerHTML = `<p>${message.replace(/\n/g, "<br>")}</p>`;

    if (isGameOver) {
      gameOverDiv.classList.add("game-over");
    } else {
      gameOverDiv.classList.add("not-game-over");
    }

    if (buttonText) {
      gameOverDiv.innerHTML = `<p class="gameOverText">${message}</p>`;
      const buttonRestart = document.createElement("button");
      buttonRestart.textContent = buttonText;
      buttonRestart.style.marginTop = "20px";
      buttonRestart.addEventListener("click", () => {
        const gameOverDiv = document.getElementById("gameOverDiv");
        if (gameOverDiv && gameOverDiv.parentElement) {
          gameOverDiv.parentElement.removeChild(gameOverDiv);
        }
        startGame();
      });
      gameOverDiv.appendChild(buttonRestart);
    } else {
      gameOverDiv.innerHTML =
        `<p class="congParagraph">${message.split("+")[0]}</p>` +
        `<p class="congText">${message.split("+")[1]}</p>`;

      const inputContainer = document.createElement("div");
      inputContainer.style.marginTop = "20px";
      const inputName = document.createElement("input");
      inputName.className = "inputName";
      inputName.type = "text";
      inputName.placeholder = "Enter your name";

      const buttonSubmit = document.createElement("button");
      buttonSubmit.textContent = "Submit";
      buttonSubmit.addEventListener("click", async () => {
        const playerName = inputName.value;
        const timerElement = document.getElementsByClassName(
          "timer"
        )[0] as HTMLElement;
        const time = timerElement.textContent;
        if (playerName && time) {
          console.log(`Player ${playerName} submitted their score: ${time}`);
          try {
            await submitScore(playerName, time);
            console.log("Score submitted successfully.");
            const gameOverDiv = document.getElementById("gameOverDiv");
            if (gameOverDiv && gameOverDiv.parentElement) {
              gameOverDiv.parentElement.removeChild(gameOverDiv);
            }
          } catch (error) {
            console.error("Error submitting score:", error);
          }
        } else {
          alert("Please enter your name to submit your score.");
        }
      });
      inputContainer.appendChild(inputName);
      inputContainer.appendChild(buttonSubmit);
      gameOverDiv.appendChild(inputContainer);
    }

    const container = document.getElementById("container");
    if (container) {
      container.appendChild(gameOverDiv);
    } else {
      console.error("Container element not found.");
    }
  }

  async function submitScore(playerName: string, time: string) {
    try {
      const docRef = await addDoc(collection(firestore, "users"), {
        name: playerName,
        time: time,
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
      const topScores = await getTopScores();
      showTopScores(topScores);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Create a query to fetch top 3 scores ordered by time
  async function getTopScores(): Promise<{ name: string; time: string }[]> {
    const scoresQuery = query(
      collection(firestore, "users"),
      orderBy("time"),
      limit(3)
    );
    const scoresSnapshot: QuerySnapshot<DocumentData> = await getDocs(
      scoresQuery
    );
    const scores = scoresSnapshot.docs.map((doc) => doc.data());
    scores.sort((a, b) => {
      const timeA = a.time
        .split(":")
        .reduce((acc: number, time: string) => 60 * acc + Number(time), 0);
      const timeB = b.time
        .split(":")
        .reduce((acc: number, time: string) => 60 * acc + Number(time), 0);
      return timeA - timeB;
    });
    return scores
      .slice(0, 3)
      .map((score) => ({ name: score.name, time: score.time }));
  }

  /**
   * Displays the top scores in a dynamically created HTML element.
   * @param topScores Array of objects containing player names and their corresponding times.
   */
  function showTopScores(topScores: { name: string; time: string }[]) {
    const topScoresDiv = document.createElement("div");
    topScoresDiv.id = "topScoresDiv";
    topScoresDiv.innerHTML = `<h2>Top 3 Fastest Times</h2><ol>${topScores
      .map(
        (score, index) =>
          `<li>${getMedalEmoji(index)} ${score.name}: ${score.time}</li>`
      )
      .join("")}</ol>`;
    const closeButton = document.createElement("button");
    closeButton.textContent = "Restart";
    closeButton.style.marginTop = "20px";
    closeButton.addEventListener("click", () => {
      const topScoresDiv = document.getElementById("topScoresDiv");
      if (topScoresDiv) {
        document.body.removeChild(topScoresDiv);
      }
      startGame();
    });

    topScoresDiv.appendChild(closeButton);
    document.body.appendChild(topScoresDiv);
  }
});

addEventListener("resize", (event) => {
  const canvas = initCanvas();

  elements.forEach((element) => {
    element.setX(Math.random() * canvas.width);
    element.setY(Math.random() * canvas.height);
  });
});

function getMedalEmoji(index: number) {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return "🎖️";
  }
}

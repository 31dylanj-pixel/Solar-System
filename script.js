const solarSystem = document.getElementById("solarSystem");

const playPause = document.getElementById("playPause");
const playIcon = document.getElementById("playIcon");
const playText = document.getElementById("playText");

const resetButton = document.getElementById("reset");

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

const zoomSlider = document.getElementById("zoomSlider");
const zoomValue = document.getElementById("zoomValue");

const orbits = document.querySelectorAll(".orbit");


/* =========================
   SIMULATION STATE
========================= */

let paused = false;

const baseSpeeds = [
    6,
    10,
    14,
    18,
    28,
    36,
    45,
    55
];


/* =========================
   SPEED
========================= */

function updateSpeed() {

    const value = Number(speedSlider.value);

    /*
        Convert slider value into a multiplier.

        0   → 0.1x
        25  → 1x
        50  → 2x
        75  → 5x
        100 → 10x
    */

    let multiplier;

    if (value === 0) {
        multiplier = 0.1;
    } else if (value <= 25) {
        multiplier = value / 25;
    } else if (value <= 50) {
        multiplier = 1 + ((value - 25) / 25);
    } else if (value <= 75) {
        multiplier = 2 + ((value - 50) / 25) * 3;
    } else {
        multiplier = 5 + ((value - 75) / 25) * 5;
    }

    speedValue.textContent =
        multiplier < 1
            ? `${multiplier.toFixed(1)}×`
            : `${Math.round(multiplier)}×`;


    orbits.forEach((orbit, index) => {

        const newDuration =
            baseSpeeds[index] / multiplier;

        orbit.style.animationDuration =
            `${newDuration}s`;

    });
}

speedSlider.addEventListener("input", updateSpeed);


/* =========================
   PLAY / PAUSE
========================= */

function toggleSimulation() {

    paused = !paused;

    orbits.forEach(orbit => {

        orbit.style.animationPlayState =
            paused ? "paused" : "running";

    });

    if (paused) {

        playIcon.textContent = "▶";
        playText.textContent = "Play";

    } else {

        playIcon.textContent = "Ⅱ";
        playText.textContent = "Pause";

    }
}

playPause.addEventListener(
    "click",
    toggleSimulation
);


/* =========================
   ZOOM
========================= */

function updateZoom() {

    const zoom = Number(zoomSlider.value);

    solarSystem.style.transform =
        `scale(${zoom / 100})`;

    zoomValue.textContent =
        `${zoom}%`;
}

zoomSlider.addEventListener(
    "input",
    updateZoom
);


/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    () => {

        paused = false;

        speedSlider.value = 25;
        zoomSlider.value = 100;

        updateSpeed();
        updateZoom();

        orbits.forEach(orbit => {

            orbit.style.animationPlayState =
                "running";

        });

        playIcon.textContent = "Ⅱ";
        playText.textContent = "Pause";
    }
);


/* =========================
   PLANET INTERACTION
========================= */

document.querySelectorAll(
    ".planet-wrapper"
).forEach(planet => {

    planet.addEventListener(
        "click",
        () => {

            const name =
                planet.dataset.name;

            const distance =
                planet.dataset.distance;

            console.log(
                `${name} — ${distance}`
            );

        }
    );

});


/* =========================
   INITIALIZE
========================= */

updateSpeed();
updateZoom();

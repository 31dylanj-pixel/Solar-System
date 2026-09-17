/* =========================================================
   ORBIT — Solar System Explorer
   Phase 2
========================================================= */


/* =========================================================
   PLANET DATA
========================================================= */

const planetData = {

    sun: {
        name: "Sun",
        type: "STAR",
        description:
            "The Sun is the star at the center of our Solar System. Its gravity keeps the planets and other objects in orbit.",
        distance: "0 km",
        diameter: "1,392,700 km",
        day: "25–35 days",
        year: "≈ 225–250 million years",
        moons: "0",
        category: "G-type star",
        fact:
            "The Sun contains more than 99% of the total mass of the Solar System."
    },

    mercury: {
        name: "Mercury",
        type: "PLANET",
        description:
            "Mercury is the smallest planet and the closest planet to the Sun. Its surface experiences enormous temperature changes.",
        distance: "57.9 million km",
        diameter: "4,879 km",
        day: "58.6 days",
        year: "88 days",
        moons: "0",
        category: "Terrestrial",
        fact:
            "Mercury has the shortest year of all the planets in the Solar System."
    },

    venus: {
        name: "Venus",
        type: "PLANET",
        description:
            "Venus is the second planet from the Sun. Its thick atmosphere traps heat, making it the hottest planet in the Solar System.",
        distance: "108.2 million km",
        diameter: "12,104 km",
        day: "243 days",
        year: "224.7 days",
        moons: "0",
        category: "Terrestrial",
        fact:
            "A day on Venus is longer than its year."
    },

    earth: {
        name: "Earth",
        type: "PLANET",
        description:
            "Earth is the third planet from the Sun and the only astronomical object currently known to harbor life.",
        distance: "149.6 million km",
        diameter: "12,742 km",
        day: "23.9 hours",
        year: "365.25 days",
        moons: "1",
        category: "Terrestrial",
        fact:
            "Earth is the only planet currently known to support life."
    },

    mars: {
        name: "Mars",
        type: "PLANET",
        description:
            "Mars is the fourth planet from the Sun. Its reddish appearance comes from iron minerals in its rocks and soil.",
        distance: "227.9 million km",
        diameter: "6,779 km",
        day: "24.6 hours",
        year: "687 days",
        moons: "2",
        category: "Terrestrial",
        fact:
            "Mars has the largest volcano in the Solar System: Olympus Mons."
    },

    jupiter: {
        name: "Jupiter",
        type: "PLANET",
        description:
            "Jupiter is the largest planet in the Solar System. It is a gas giant with a powerful magnetic field and many moons.",
        distance: "778.5 million km",
        diameter: "139,820 km",
        day: "9.9 hours",
        year: "11.86 years",
        moons: "95+",
        category: "Gas giant",
        fact:
            "Jupiter is more than twice as massive as all the other planets combined."
    },

    saturn: {
        name: "Saturn",
        type: "PLANET",
        description:
            "Saturn is a gas giant famous for its spectacular ring system, which is made mostly of ice and rocky particles.",
        distance: "1.43 billion km",
        diameter: "116,460 km",
        day: "10.7 hours",
        year: "29.45 years",
        moons: "140+",
        category: "Gas giant",
        fact:
            "Saturn's average density is lower than water."
    },

    uranus: {
        name: "Uranus",
        type: "PLANET",
        description:
            "Uranus is an ice giant with a blue-green appearance caused by methane in its atmosphere.",
        distance: "2.87 billion km",
        diameter: "50,724 km",
        day: "17.2 hours",
        year: "84 years",
        moons: "28",
        category: "Ice giant",
        fact:
            "Uranus rotates on its side, giving it an extreme axial tilt."
    },

    neptune: {
        name: "Neptune",
        type: "PLANET",
        description:
            "Neptune is the eighth and most distant major planet from the Sun. It is an extremely cold and windy ice giant.",
        distance: "4.50 billion km",
        diameter: "49,244 km",
        day: "16.1 hours",
        year: "164.8 years",
        moons: "16",
        category: "Ice giant",
        fact:
            "Neptune has some of the fastest winds measured anywhere in the Solar System."
    }

};


/* =========================================================
   ELEMENTS
========================================================= */

const solarSystem = document.getElementById("solarSystem");

const pauseButton = document.getElementById("pauseButton");
const pauseIcon = document.getElementById("pauseIcon");
const pauseText = document.getElementById("pauseText");

const resetButton = document.getElementById("resetButton");

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

const zoomSlider = document.getElementById("zoomSlider");
const zoomValue = document.getElementById("zoomValue");

const statusText = document.getElementById("statusText");
const modeText = document.getElementById("modeText");

const planetPanel = document.getElementById("planetPanel");
const closePanel = document.getElementById("closePanel");
const backButton = document.getElementById("backButton");

const panelType = document.getElementById("panelType");
const panelName = document.getElementById("panelName");
const panelDescription = document.getElementById("panelDescription");

const panelDistance = document.getElementById("panelDistance");
const panelDiameter = document.getElementById("panelDiameter");
const panelDay = document.getElementById("panelDay");
const panelYear = document.getElementById("panelYear");
const panelMoons = document.getElementById("panelMoons");
const panelCategory = document.getElementById("panelCategory");

const panelFact = document.getElementById("panelFact");


/* =========================================================
   STATE
========================================================= */

let paused = false;

let selectedPlanet = null;

let currentZoom = 100;

let focusAnimation = null;

let lastTime = performance.now();

let planetAngles = {
    mercury: 0,
    venus: 1.2,
    earth: 2.2,
    mars: 3.4,
    jupiter: 4.4,
    saturn: 5.2,
    uranus: 1.8,
    neptune: 3.9
};


/*
    These are deliberately different so the planets
    don't all move at the same speed.
*/
const planetSpeeds = {
    mercury: 1.00,
    venus: 0.72,
    earth: 0.55,
    mars: 0.42,
    jupiter: 0.25,
    saturn: 0.18,
    uranus: 0.12,
    neptune: 0.09
};


/* =========================================================
   UTILITY
========================================================= */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =========================================================
   PLANET POSITIONING
========================================================= */

function updatePlanets(deltaTime) {

    /*
        If paused, NOTHING moves.
        The planets, camera, and simulation all stay frozen.
    */

    if (paused) {
        return;
    }

    const speedMultiplier =
        Number(speedSlider.value) / 50;

    Object.keys(planetAngles).forEach(planet => {

        planetAngles[planet] +=
            planetSpeeds[planet] *
            speedMultiplier *
            deltaTime *
            0.0005;

        if (planetAngles[planet] > Math.PI * 2) {
            planetAngles[planet] -= Math.PI * 2;
        }
    });


    /*
        Position every planet around its orbit.
    */

    document.querySelectorAll(".planet-wrapper").forEach(wrapper => {

        const planet =
            wrapper.dataset.planet;

        const orbitRadius =
            Number(wrapper.dataset.radius);

        const angle =
            planetAngles[planet];


        const x =
            Math.sin(angle) * orbitRadius;

        const y =
            -Math.cos(angle) * orbitRadius;


        wrapper.style.left =
            `calc(50% + ${x}px)`;

        wrapper.style.top =
            `calc(50% + ${y}px)`;

    });
}

/* =========================================================
   ANIMATION LOOP
========================================================= */

function animationLoop(timestamp) {

    const deltaTime =
        timestamp - lastTime;

    lastTime = timestamp;


    /*
        Update planets only when playing.
    */

    updatePlanets(deltaTime);


    /*
        The camera only follows during active
        simulation. Pausing therefore freezes
        EVERYTHING.
    */

    if (!paused && selectedPlanet) {
        updateFocusCamera();
    }


    requestAnimationFrame(animationLoop);
}

requestAnimationFrame(animationLoop);

/* =========================================================
   NORMAL ZOOM
========================================================= */

function updateZoom() {

    currentZoom =
        Number(zoomSlider.value);

    zoomValue.textContent =
        `${currentZoom}%`;


    /*
        Normal Solar System zoom.
    */

    if (!selectedPlanet) {

        solarSystem.style.transform =
            `translate(-50%, -50%) scale(${currentZoom / 100})`;

    }

}

zoomSlider.addEventListener("input", () => {

    updateZoom();

});
/* =========================================================
   SPEED
========================================================= */

function updateSpeed() {

    speedValue.textContent =
        `${speedSlider.value}%`;

}


speedSlider.addEventListener(
    "input",
    updateSpeed
);


/* =========================================================
   PAUSE / PLAY
========================================================= */

function togglePause() {

    paused = !paused;


    if (paused) {

        pauseIcon.textContent = "▶";
        pauseText.textContent = "Play";

        statusText.textContent =
            "SIMULATION PAUSED";

        modeText.textContent =
            selectedPlanet
                ? "FOCUS · PAUSED"
                : "PAUSED";

    } else {

        pauseIcon.textContent = "Ⅱ";
        pauseText.textContent = "Pause";

        statusText.textContent =
            selectedPlanet
                ? "FOLLOWING OBJECT"
                : "SIMULATION ACTIVE";

        modeText.textContent =
            selectedPlanet
                ? "FOCUS"
                : "ORBITAL";

    }

}


pauseButton.addEventListener(
    "click",
    togglePause
);


/* =========================================================
   PLANET INFORMATION
========================================================= */

function updatePanel(planetKey) {

    const data =
        planetData[planetKey];

    if (!data) return;


    panelType.textContent =
        data.type;

    panelName.textContent =
        data.name;

    panelDescription.textContent =
        data.description;

    panelDistance.textContent =
        data.distance;

    panelDiameter.textContent =
        data.diameter;

    panelDay.textContent =
        data.day;

    panelYear.textContent =
        data.year;

    panelMoons.textContent =
        data.moons;

    panelCategory.textContent =
        data.category;

    panelFact.textContent =
        data.fact;

}


/* =========================================================
   ENTER FOCUS MODE
========================================================= */

function focusPlanet(planetKey) {

    if (!planetData[planetKey]) {
        return;
    }


    /*
        If another planet is already selected,
        remove its selected classes first.
    */

    document.querySelectorAll(".selected-object")
        .forEach(element => {

            element.classList.remove(
                "selected-object"
            );

        });


    document.querySelectorAll(".selected-orbit")
        .forEach(element => {

            element.classList.remove(
                "selected-orbit"
            );

        });


    selectedPlanet = planetKey;


    /*
        Find the selected object.
    */

    let selectedElement;


    if (planetKey === "sun") {

        selectedElement =
            document.querySelector(
                ".sun[data-planet='sun']"
            );

    } else {

        selectedElement =
            document.querySelector(
                `.planet-wrapper[data-planet="${planetKey}"]`
            );

    }


    if (!selectedElement) {
        return;
    }


    selectedElement.classList.add(
        "selected-object"
    );


    if (planetKey !== "sun") {

        const orbit =
            selectedElement.closest(".orbit");

        if (orbit) {

            orbit.classList.add(
                "selected-orbit"
            );

        }

    }


    /*
        Update information immediately.
    */

    updatePanel(planetKey);


    /*
        Enter focus mode.
    */

    document.body.classList.add(
        "focus-mode"
    );


    modeText.textContent =
        paused
            ? "FOCUS · PAUSED"
            : "FOCUS";


    statusText.textContent =
        paused
            ? "FOLLOWING · PAUSED"
            : "FOLLOWING OBJECT";


    /*
        The camera needs a moment to see the
        newly selected object.
    */

    if (focusAnimation) {
        cancelAnimationFrame(focusAnimation);
    }

}


/* =========================================================
   CAMERA / FOLLOW SYSTEM
========================================================= */

function updateFocusCamera() {

    if (!selectedPlanet || paused) {
        return;
    }


    const selectedElement =
        selectedPlanet === "sun"
            ? document.querySelector(".sun")
            : document.querySelector(
                `.planet-wrapper[data-planet="${selectedPlanet}"]`
            );


    if (!selectedElement) {
        return;
    }


    const planetRect =
        selectedElement.getBoundingClientRect();


    /*
        Put the selected planet roughly in the
        left-center of the screen so the information
        panel has room on the right.
    */

    const targetX =
        window.innerWidth * 0.35;

    const targetY =
        window.innerHeight * 0.5;


    const planetX =
        planetRect.left +
        planetRect.width / 2;

    const planetY =
        planetRect.top +
        planetRect.height / 2;


    const differenceX =
        targetX - planetX;

    const differenceY =
        targetY - planetY;


    /*
        Determine a cinematic scale.
    */

    const planetSize =
        Math.max(
            planetRect.width,
            planetRect.height
        );


    let focusScale;

    if (selectedPlanet === "sun") {

        focusScale = 2.6;

    } else {

        focusScale =
            clamp(
                180 / planetSize,
                3.5,
                7
            );

    }


    /*
        Don't let normal zoom fight the focus camera.
    */

    const zoomInfluence =
        currentZoom / 100;

    const finalScale =
        focusScale *
        (0.85 + zoomInfluence * 0.15);


    const currentX =
        Number(
            solarSystem.dataset.cameraX || 0
        );

    const currentY =
        Number(
            solarSystem.dataset.cameraY || 0
        );


    const smoothX =
        currentX +
        (
            differenceX -
            currentX
        ) * 0.12;


    const smoothY =
        currentY +
        (
            differenceY -
            currentY
        ) * 0.12;


    solarSystem.dataset.cameraX =
        smoothX;

    solarSystem.dataset.cameraY =
        smoothY;


    solarSystem.style.transform =
        `translate(
            calc(-50% + ${smoothX}px),
            calc(-50% + ${smoothY}px)
        )
        scale(${finalScale})`;
}


/* =========================================================
   EXIT FOCUS MODE
========================================================= */

function closeFocus() {

    selectedPlanet = null;


    document.body.classList.remove(
        "focus-mode"
    );


    document.querySelectorAll(
        ".selected-object"
    ).forEach(element => {

        element.classList.remove(
            "selected-object"
        );

    });


    document.querySelectorAll(
        ".selected-orbit"
    ).forEach(element => {

        element.classList.remove(
            "selected-orbit"
        );

    });


    solarSystem.dataset.cameraX = 0;
    solarSystem.dataset.cameraY = 0;


    /*
        Return to the user's current zoom.
    */

    solarSystem.style.transform =
        `translate(-50%, -50%) scale(${currentZoom / 100})`;


    modeText.textContent =
        paused
            ? "PAUSED"
            : "ORBITAL";


    statusText.textContent =
        paused
            ? "SIMULATION PAUSED"
            : "SIMULATION ACTIVE";
}

/* =========================================================
   PLANET CLICK EVENTS
========================================================= */

document.querySelectorAll(
    ".planet-wrapper"
).forEach(wrapper => {

    wrapper.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            focusPlanet(
                wrapper.dataset.planet
            );

        }
    );

});


/*
    Sun has its own click event.
*/

document.querySelector(".sun")
    .addEventListener("click", event => {

        event.stopPropagation();

        focusPlanet("sun");

    });


/* =========================================================
   CLOSE EVENTS
========================================================= */

closePanel.addEventListener(
    "click",
    closeFocus
);


backButton.addEventListener(
    "click",
    closeFocus
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            selectedPlanet
        ) {

            closeFocus();

        }

    }
);


/* =========================================================
   RESET
========================================================= */

resetButton.addEventListener(
    "click",
    () => {

        /*
            Reset camera.
        */

        closeFocus();


        /*
            Reset zoom.
        */

        zoomSlider.value = 100;

        currentZoom = 100;

        zoomValue.textContent = "100%";


        /*
            Reset speed.
        */

        speedSlider.value = 50;

        speedValue.textContent = "50%";


        /*
            Reset planet positions.
        */

        planetAngles = {
            mercury: 0,
            venus: 1.2,
            earth: 2.2,
            mars: 3.4,
            jupiter: 4.4,
            saturn: 5.2,
            uranus: 1.8,
            neptune: 3.9
        };


        /*
            Reset pause state.
        */

        paused = false;

        pauseIcon.textContent = "Ⅱ";
        pauseText.textContent = "Pause";

        statusText.textContent =
            "SIMULATION ACTIVE";

        modeText.textContent =
            "ORBITAL";

    }
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (!selectedPlanet) {

            solarSystem.style.transform =
                `translate(-50%, -50%) scale(${currentZoom / 100})`;

        }

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

updateSpeed();
updateZoom();

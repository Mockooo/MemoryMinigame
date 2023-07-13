// Mady by Mocko

// All Variables
let Playing = false;
let SkipRowIfWrong = true;
let Highlighted = null;
let HighlightIndex = 0;

let Failed = false;

let rows = 7;
let columns = 7;

let waitbeforeStart = 1000;
let highlightBoxesTime = 1000;
let highlightBoxesSpeed = 300;

let current = 0;
let Playingfield = null;
let Rights = null;

// Message Listener
window.addEventListener("message", (event) => {

    let data = event.data;
    let action = data.action;

    switch(action){
        case "start":
            rounds = data.rounds;
            trys = data.trys;
            trystrys = trys;
            rows = data.rows;
            columns = data.columns;
            waitbeforeStart = data.wait1;
            highlightBoxesTime = data.wait2;
            highlightBoxesSpeed = data.wait3;
            Start();
            break;
        case "stop":
            End(false);
            break;
    }
})

Start();
// Functions
function Start() {
    $("#container").append(`
        <div class="Grid"></div>
    `);
    let RowString = "";
    let ColumnString = "";
    for (let i = 0; i<rows; i++) {
        RowString += " auto";
    }
    for (let i = 0; i<columns; i++) {
        ColumnString += " auto";
    }
    $(".Grid").css("grid-template-rows", RowString);
    $(".Grid").css("grid-template-columns", ColumnString);

    $("body").fadeIn("fast")
    CreatePlayingField();
    setTimeout(() => {
        HighlightIndex = 0;
        $("#Box-"+Rights[HighlightIndex]["i"]+"-"+Rights[HighlightIndex]["j"]).css("background-color", "var(--highlight-color)");
        Highlighted = setInterval(HighlightRightBox, highlightBoxesSpeed);
    }, waitbeforeStart);
}

function CreatePlayingField() {
    Playingfield = {};
    for (let row = 0; row<rows; row++) {
        Playingfield[row] = {};
        for (let column = 0; column<columns; column++) {
            Playingfield[row][column] = 0;
        }
    }

    for (let column = 0; column<columns; column++) {
        let Spot = Math.floor(Math.random()*columns);
        Playingfield[Spot][column] = 1;
    }

    Rights = {};
    for (let i = 0; i<rows; i++) {
        for (let j = 0; j<columns; j++) {
            if (Playingfield[i][j] == 1) {
                Rights[j] = {i, j};
                $(".Grid").append(`
                    <div class="Box" id="${"Box-"+i+"-"+j}" onclick="BoxClicked(true, ${i}, ${j})"></div>
                `);
            } else {
                $(".Grid").append(`
                    <div class="Box" id="${"Box-"+i+"-"+j}" onclick="BoxClicked(false, ${i}, ${j})"></div>
                `);
            }
        }
    }
}

function HighlightRightBox() {
    HighlightIndex++;
    if (HighlightIndex == rows) {
        clearInterval(Highlighted);
        Highlighted = null;
        setTimeout(() => {
            for (let i = 0; i<rows; i++) {
                $("#Box-"+Rights[i]["i"]+"-"+Rights[i]["j"]).css("background-color", "var(--main-color)");
            }
            Playing = true;
        }, highlightBoxesTime);
    } else {
        $("#Box-"+Rights[HighlightIndex]["i"]+"-"+Rights[HighlightIndex]["j"]).css("background-color", "var(--highlight-color)");
    }
}

function BoxClicked(hit, row, column) {
    if (!Playing) {return;}
    if (column != current) {return;}
    if (hit) {
        $("#Box-"+row+"-"+column).css("background-color", "var(--right-color)");
        if (current == columns-1) {
            setTimeout(() => {
                if (Failed) {
                    for (let i = 0; i<rows; i++) {
                        for (let j = 0; j<columns; j++) {
                            $("#Box-"+i+"-"+j).css("background-color", "var(--wrong-color)");
                        }
                    }
                } else {
                    for (let i = 0; i<rows; i++) {
                        for (let j = 0; j<columns; j++) {
                            $("#Box-"+i+"-"+j).css("background-color", "var(--right-color)");
                        }
                    }
                }
                setTimeout(() => {
                    $(".Grid").empty();
                    current = 0;
                    Playing = false;
                    Playingfield = null;
                    Failed = false;
                    CreatePlayingField();
                    setTimeout(() => {
                        HighlightIndex = 0;
                        $("#Box-"+Rights[HighlightIndex]["i"]+"-"+Rights[HighlightIndex]["j"]).css("background-color", "var(--highlight-color)");
                        Highlighted = setInterval(HighlightRightBox, highlightBoxesSpeed);
                    }, waitbeforeStart);
                }, waitbeforeStart);
            }, waitbeforeStart);
        } else {
            current++;
        }
    } else {
        Failed = true;
        $("#Box-"+row+"-"+column).css("background-color", "var(--wrong-color)");
        if (SkipRowIfWrong) {
            if (current == columns-1) {
                setTimeout(() => {
                    for (let i = 0; i<rows; i++) {
                        for (let j = 0; j<columns; j++) {
                            $("#Box-"+i+"-"+j).css("background-color", "var(--wrong-color)");
                        }
                    }
                    setTimeout(() => {
                        $(".Grid").empty();
                        current = 0;
                        Playing = false;
                        Playingfield = null;
                        Failed = false;
                        CreatePlayingField();
                        setTimeout(() => {
                            HighlightIndex = 0;
                            $("#Box-"+Rights[HighlightIndex]["i"]+"-"+Rights[HighlightIndex]["j"]).css("background-color", "var(--highlight-color)");
                            Highlighted = setInterval(HighlightRightBox, highlightBoxesSpeed);
                        }, waitbeforeStart);
                    }, waitbeforeStart);
                }, waitbeforeStart);
            } else {
                current++;
            }
            for (let j = 0; j<rows; j++) {
                if (Playingfield[j][column] == 1) {
                    $("#Box-"+j+"-"+column).css("background-color", "var(--guessed-wrong-color)");
                }
            }

        }
    }
}

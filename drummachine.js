window.onload = function () {
    init();
};

function init() {
    tick = 1; //init position of the tick
    tickinterval = 60000 / 120 / 4; //120bpm
    ticker = false; //set the interval variable
    stopped = true; //if the machine is stopped
    tickCount = 16;
    document.querySelector('#timer').innerHTML = 120 + ' BPM';
    instruments = [
        'kick',
        'hihat',
        'snare',
        'boom',
        'clap',
        'openhat',
        'ride',
        'tink',
        'tom',
    ];
    synthNotes = ["C","D","E","F","G","A","B"];
    synthScaleNum = 2;
    createInstuments();
    createSynth();

    addEventListeners();

    synth = new Tone.Synth({
        oscillator: {
            type: 'sawtooth'
        },
        envelope: {
            attack: 2,
            decay: 1,
            sustain: 0.4,
            release: 4
        }
    }).toMaster();

};

function createInstuments() {
    instruments.map(function (instrumentName) {

        var instrumentsContainer = document.getElementById('instrumentsContainer');

        var instrumentContainer = document.createElement('div');
        instrumentContainer.classList = 'col-xs-12 text-center instrument';
        instrumentContainer.setAttribute('data-name', instrumentName);
        instrumentsContainer.appendChild(instrumentContainer);

        var instrumentNameElement = document.createElement('div');
        instrumentNameElement.classList = 'name';
        instrumentNameElement.innerHTML = instrumentName;
        instrumentContainer.appendChild(instrumentNameElement);

        for (var i = 1; i <= tickCount; i++) {
            var tickElem = document.createElement('div');
            tickElem.classList = 'tick';
            tickElem.setAttribute('data-tick', i);
            instrumentContainer.appendChild(tickElem);
        }


    })
}

function createSynth(){


    var instrumentsContainer = document.getElementById('instrumentsContainer');


    var dividerElem = document.createElement('div');
    dividerElem.classList='col-xs-12';

    var hrElem = document.createElement('hr');
    dividerElem.appendChild(hrElem);
    instrumentsContainer.appendChild(dividerElem);

    instrumentsContainer.appendChild(document.createElement('div.col-xs-12'));

    synthNotes.map(function (instrumentName) {

        var instrumentsContainer = document.getElementById('instrumentsContainer');

        var instrumentContainer = document.createElement('div');
        instrumentContainer.classList = 'col-xs-12 text-center instrument';
        instrumentContainer.setAttribute('data-name', instrumentName+synthScaleNum);
        instrumentsContainer.appendChild(instrumentContainer);

        var instrumentNameElement = document.createElement('div');
        instrumentNameElement.classList = 'name';
        instrumentNameElement.innerHTML = instrumentName + synthScaleNum;
        instrumentContainer.appendChild(instrumentNameElement);

        for (var i = 1; i <= tickCount; i++) {
            var tickElem = document.createElement('div');
            tickElem.classList = 'tick synth';
            tickElem.setAttribute('data-tick', i);
            instrumentContainer.appendChild(tickElem);
        }


    });


    /*knobs*/

    $('#synth_attack').knob({
        'change' : function (v) {
            synth.envelope.attack = v;
        }
    });

    $('#synth_decay').knob({
        'change' : function (v) {
            synth.envelope.sustain = v/100;
        }
    });

    $('#synth_release').knob({
        'change' : function (v) {
            synth.envelope.release = v;
        }
    });




}

function addEventListeners() {
    ticks = document.querySelectorAll('div.tick');
    ticks.forEach(item => item.onclick = function () {
        this.classList.toggle('play')
    });

    labels = document.querySelectorAll('div.name');
    labels.forEach(item => item.onclick = function () {
        this.classList.toggle('mute');
    })
}

function getParents(el, parentSelector /* optional */) {

    if (parentSelector === undefined) {
        parentSelector = document;
    }

    var parents = [];
    var p = el.parentNode;

    while (p !== parentSelector) {
        var o = p;
        parents.push(o);
        p = o.parentNode;
    }
    parents.push(parentSelector);

    return parents;
}

function appendHtml(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
        el.appendChild(div.children[0]);
    }
}

function itemTicked(item) {
    item.classList.add('active');
    if (item.classList.value.indexOf('play') > -1) {

        console.log(item.classList);
        if (item.classList.value.indexOf('synth') > -1){
            var parent = getParents(item)[0];
            var nameElem = parent.children[0];

            var sound_name = parent.dataset.name;
            synth.triggerAttackRelease(sound_name,"8n");
        }else{
            var parent = getParents(item)[0];
            var nameElem = parent.children[0];

            var sound_name = parent.dataset.name;

            var player = new Tone.Player("sounds/"+sound_name+".wav").toMaster();

            //var sound = document.querySelector(`audio[data-name="${sound_name}"]`);
            if (player && nameElem.classList.value.indexOf('mute') == -1) {
                //sound.currentTime = 0;
                //sound.play();
                player.autostart = true;
            }
        }



    }
};

function start() {
    stopped = false;
    ticker = setInterval(function () {
        if (tick > tickCount) {
            tick = 1;
        }
        var setToActive = document.querySelectorAll(`div[data-tick="${tick.toString()}"]`);
        var setToInactive = document.querySelectorAll('div.tick.active');
        setToInactive.forEach(item => item.classList.remove('active'));
        setToActive.forEach(item => itemTicked(item));
        tick++;
    }, tickinterval);
}

function stop(reset) {
    clearInterval(ticker);

    if (reset) {
        tick = 1;
        var setToInactive = document.querySelectorAll('div.tick.active');
        setToInactive.forEach(item => item.classList.remove('active'));
        stopped = true;
    }


}

function pause() {
    stop(false);
}

function tickintervalchange() {
    console.log('change');
    var val = document.querySelector('#tickinterval').value;
    tickinterval = 60000 / val / 4;
    document.querySelector('#timer').innerHTML = val + ' BPM';
    pause();
    if (!stopped) {
        start();
    }
}

function save() {
    pause();
    var patternHtml = document.querySelector('.pattern').innerHTML;
    patternHtml = patternHtml.replace(/ active/g, '');
    localStorage.setItem('pattern', patternHtml);
    if (!stopped) {
        start();
    }

}

function reset() {
    var setToInactive = document.querySelectorAll('div.tick.play');
    setToInactive.forEach(item => item.classList.remove('play'));
    stop(true);
}

function load() {
    var patternHtml = localStorage.getItem('pattern');
    document.querySelector('.pattern').innerHTML = "";
    appendHtml(document.querySelector('.pattern'), patternHtml);
    addEventListeners();
}


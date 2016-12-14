window.onload = function () {
    init();
};

function init() {
    tick = 1; //init position of the tick
    tickinterval = 60000 / 120 / 4; //120bpm
    ticker = false; //set the interval variable
    stopped = true; //if the machine is stopped
    document.querySelector('#timer').innerHTML = 120 +' BPM';

    ticks = document.querySelectorAll('div.tick');
    ticks.forEach(item => item.onclick = function () {
        this.classList.toggle('play')
    });

    labels = document.querySelectorAll('div.name');
    labels.forEach(item => item.onclick = function(){
        this.classList.toggle('mute');
    })

};

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

function itemTicked(item) {
    item.classList.add('active');
    if (item.classList.value.indexOf('play') > -1) {
        var parent = getParents(item)[0];
        var nameElem = parent.children[0];

        var sound_name = parent.dataset.name;
        var sound = document.querySelector(`audio[data-name="${sound_name}"]`);
        if (sound && nameElem.classList.value.indexOf('mute') == -1) {
            sound.currentTime = 0;
            sound.play();
        }
    }
};

function start() {
    stopped = false;
    ticker = setInterval(function () {
        if (tick > 16) {
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

function pause(){
    stop(false);
}

function tickintervalchange() {
    console.log('change');
    var val = document.querySelector('#tickinterval').value;
    tickinterval = 60000 / val / 4;
    document.querySelector('#timer').innerHTML = val +' BPM';
    pause();
    if (!stopped) {
        start();
    }
}


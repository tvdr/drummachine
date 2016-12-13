window.onload = function(){
    tick = 1;
    ticks = document.querySelectorAll('div.tick');
    ticks.forEach(item => item.onclick = function () {
        this.classList.toggle('play')
    });
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
        var sound_name = parent.dataset.name;
        var sound = document.querySelector(`audio[data-name="${sound_name}"]`);
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
};


function start() {
    ticker = setInterval(function () {
        if (tick > 16) {
            tick = 1;
        }
        var setToActive = document.querySelectorAll(`div[data-tick="${tick.toString()}"]`);
        var setToInactive = document.querySelectorAll('div.tick.active');
        setToInactive.forEach(item => item.classList.remove('active'));
        setToActive.forEach(item => itemTicked(item));
        //document.querySelector('#timer').innerHTML = tick;
        tick++;
    }, 125);
}

function stop() {
    clearInterval(ticker);
    var setToInactive = document.querySelectorAll('div.tick.active');
    setToInactive.forEach(item => item.classList.remove('active'));
    tick = 1;
}

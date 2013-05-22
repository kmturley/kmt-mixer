function BackgroundIntensity(buttonElement, rangeElement, context) {
    var ctx = this;
    buttonElement.addEventListener('click', function () {
        ctx.playPause.call(ctx);
    });
    rangeElement.addEventListener('change', function (e) {
        var value = parseInt(e.target.value);
        var max = parseInt(e.target.max);
        ctx.setIntensity(value / max);
    });
    var sources = ['audio/instrumental.mp3', 'audio/Guitar.mp3', 'audio/Crunch.mp3', 'audio/Drum.mp3'];
    var ctx = this;
    loader = new BufferLoader(context, sources, onLoaded);
    loader.load();

    function onLoaded(buffers) {
        ctx.buffers = buffers;
        console.log(ctx);
    }
    this.sources = new Array(sources.length);
    this.gains = new Array(sources.length);
}
BackgroundIntensity.prototype.playPause = function () {
    if (this.playing) {
        for (var i = 0, length = this.sources.length; i < length; i++) {
            var src = this.sources[i];
            src.noteOff(0);
        }
    } else {
        var targetStart = context.currentTime + 0.1;
        
        for (var i = 0, length = this.buffers.length; i < length; i++) {
            this.playSound(i, targetStart);
        }
        this.setIntensity(0);
    }
    this.playing = !this.playing;
}
BackgroundIntensity.prototype.setIntensity = function (normVal) {
    var value = normVal * (this.gains.length - 1);
    for (var i = 0; i < this.gains.length; i++) {
        this.gains[i].gain.value = 0;
    }
    var leftNode = Math.floor(value);
    var x = value - leftNode;
    var gain1 = Math.cos(x * 0.5 * Math.PI);
    var gain2 = Math.cos((1.0 - x) * 0.5 * Math.PI);
    console.log(gain1, gain2);
    this.gains[leftNode].gain.value = gain1;
    if (leftNode < this.gains.length - 1) {
        this.gains[leftNode + 1].gain.value = gain2;
    }
}
BackgroundIntensity.prototype.playSound = function (index, targetTime) {
    var buffer = this.buffers[index];
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    var gainNode = context.createGainNode();
    source.connect(gainNode);
    gainNode.connect(context.destination);
    this.sources[index] = source;
    this.gains[index] = gainNode;
    source.noteOn(targetTime);
}
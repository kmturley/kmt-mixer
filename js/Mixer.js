/*globals console, window, document, XMLHttpRequest*/
/*
*   Mixer
*/

(function () {
    'use strict';
    
    function Mixer(id, options) {
        this.el = document.getElementById(id);
        this.options = options;
        this.init();
    }
    
    Mixer.prototype = {
        tempo: 90,
        loaded: false,
        loadCount: 0,
        audio: [],
        bufferList: [],
        sources: [],
        init: function () {
            var i = 0;
            try { this.context = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext(); } catch (e) { console.log('Web Audio API not supported'); }
            
            // loop through the files and load each url
            for (i = 0; i < this.options.files.length; i += 1) {
                this.preload(this.options.files[i], i, this.options.files.length);
            }
        },
        preload: function (url, index, total) {
            var request = new XMLHttpRequest(),
                me = this;
            console.log('Mixer.preload', url);
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                // get the data and decode as audio data
                me.context.decodeAudioData(request.response, function (buffer) {
                    me.audio[index] = buffer;
                    console.log('Mixer.preload.complete', (me.loadCount + 1) + ' of ' + total);
                    if (me.loadCount === total - 1) {
                        me.loaded = true;
                    }
                    me.loadCount += 1;
                });
            };
            request.send();
        },
        play: function () {
            if (this.loaded === true) {
                var me = this,
                    startTime = this.context.currentTime + 0.100,
                    //tempo = Math.round(60 / (this.audio[1].duration / 16)),
                    eighthNoteTime = (120 / this.tempo),
                    bar = 0,
                    bars = 16,
                    random = 0;
                
                console.log('Mixer.play', this.tempo + 'bpm');
                
                // play the acapella
                this.load(this.audio[0], startTime + bar * (bars * eighthNoteTime));
                
                for (bar = 0; bar < 8; bar += 1) {
                    random = Math.round(Math.random() * (this.audio.length - 1));
                    if (random === 0) { random = 1; }
                    this.load(this.audio[random], startTime + bar * (bars * eighthNoteTime));
                }
            }
        },
        load: function (buffer, time) {
            var source = this.context.createBufferSource(),
                tempo = Math.round(60 / (buffer.duration / 16));
            if (tempo < 60) { tempo *= 2; }
            if (tempo > 160) { tempo /= 2; }
            source.buffer = buffer;
            source.connect(this.context.destination);
            if (!source.start) {
                source.start = source.noteOn;
            }
            console.log('load', tempo, (this.tempo / tempo));
            if (tempo > 60 && tempo < 160) {
                source.playbackRate.value = (this.tempo / tempo);
            }
            source.start(time);
            this.sources.push(source);
        },
        stop: function () {
            var i = 0;
            for (i = 0; i < this.sources.length; i += 1) {
                if (!this.sources[i].stop) {
                    this.sources[i].stop = this.sources[i].noteOff;
                }
                this.sources[i].stop(0);
            }
            this.sources = [];
        }
    };
    
    window.Mixer = Mixer;
}());
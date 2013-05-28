/*globals console, window, document, XMLHttpRequest, alert*/
/*
*   Audio
*/

(function () {
    'use strict';
    
    function Audio(id, options) {
        this.el = document.getElementById(id);
        this.options = options;
        this.init();
    }
    
    Audio.prototype = {
        audio: [],
        bufferList: [],
        sources: [],
        init: function () {
            try { this.context = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext(); } catch (e) { alert('Web Audio API not supported'); }
        },
        load: function (items) {
            var i = 0;
            this.stop();
            this.loaded = false;
            this.loadCount = 0;
            this.items = items;
            for (i = 0; i < items.length; i += 1) {
                this.preload(items[i].url, i, items.length);
            }
        },
        preload: function (url, index, total) {
            var request = new XMLHttpRequest(),
                me = this;
            console.log('Audio.preload', url);
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                // get the data and decode as audio data
                me.context.decodeAudioData(request.response, function (buffer) {
                    me.items[index].buffer = buffer;
                    console.log('Audio.preload.complete', (me.loadCount + 1) + ' of ' + total);
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
                    eighthNoteTime = (120 / this.items[0].bpm),
                    bar = 0,
                    bars = 16,
                    random = 0;
                
                console.log('Audio.play', this.items[0].bpm + 'bpm');
                
                // play the acapella
                this.loadSound(this.items[0], startTime + bar * (bars * eighthNoteTime));
                
                for (bar = 0; bar < 8; bar += 1) {
                    this.loadSound(this.items[1], startTime + bar * (bars * eighthNoteTime));
                }
            }
        },
        loadSound: function (item, time) {
            var source = this.context.createBufferSource(),
                tempo = item.bpm || (60 / (item.buffer.duration / 16));
            if (tempo < 60) { tempo *= 2; }
            if (tempo > 160) { tempo /= 2; }
            source.buffer = item.buffer;
            source.connect(this.context.destination);
            if (!source.start) {
                source.start = source.noteOn;
            }
            //console.log('loadSound', tempo, (this.items[0].bpm / tempo));
            if (tempo > 60 && tempo < 160) {
                source.playbackRate.value = (this.items[0].bpm / tempo);
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
    
    window.Audio = Audio;
}());
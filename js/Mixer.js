/*globals console, window, document, alert, BufferLoader*/
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
        loaded: false,
        audio: [],
        init: function () {
            try { this.context = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext(); } catch (e) { alert('Web Audio API not supported'); }
            this.buffer(this.options.files);
        },
        buffer: function (files) {
            console.log('Mixer.buffer', files);
            var me = this,
                i = 0,
                bufferLoader = new BufferLoader(me.context, files, function (items) {
                    for (i = 0; i < items.length; i += 1) {
                        me.audio.push(items[i]);
                    }
                    me.loaded = true;
                    console.log('Mixer.buffer.complete', me.audio);
                });
            bufferLoader.load();
        },
        play: function () {
            if (this.loaded === true) {
                var me = this,
                    startTime = this.context.currentTime + 0.100,
                    tempo = Math.round(60 / (this.audio[0].duration / 16)),
                    eighthNoteTime = (120 / tempo),
                    bar = 0;
                
                // play the acapella
                this.load(this.audio[2], startTime + bar * (8 * eighthNoteTime));
                
                for (bar = 0; bar < 8; bar += 1) {
                    // every bar switch between instrumentals
                    if (bar % 2 === 0) {
                        this.load(this.audio[0], startTime + bar * (8 * eighthNoteTime));
                    } else {
                        this.load(this.audio[1], startTime + bar * (8 * eighthNoteTime));
                    }
                }
            }
        },
        load: function (buffer, time) {
            var source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            if (!source.start) {
                source.start = source.noteOn;
            }
            source.start(time);
        },
        stop: function () {}
    };
    
    window.Mixer = Mixer;
}());
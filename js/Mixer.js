/*globals console, window, document*/
/*
*   Mixer
*/

(function () {
    
    function Mixer(id, options) {
        this.el = document.getElementById(id);
        this.options = options;
        this.init();
    }
    
    Mixer.prototype = {
        loaded: false,
        urlList: [],
        bufferList: [],
        sources: [],
        BUFFERS: {},
        init: function () {
            var me = this,
                names = [],
                paths = [];
            var BUFFERS_TO_LOAD = {
                    kick: 'audio/instrumental.mp3',
                    kick2: 'audio/improve.mp3',
                    snare: 'audio/acapella.mp3'
                    //hihat: 'audio/hihat.wav'
                };
            console.log('Mixer', this);
            
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();
            } catch (e) {
                alert("Web Audio API is not supported in this browser");
            }
            for (var name in BUFFERS_TO_LOAD) {
                var path = BUFFERS_TO_LOAD[name];
                names.push(name);
                paths.push(path);
            }
            
            console.log(names, paths);
            var bufferLoader = new BufferLoader(me.context, paths, function(bufferList) {
                for (var i = 0; i < bufferList.length; i++) {
                    var buffer = bufferList[i];
                    var name = names[i];
                    me.BUFFERS[name] = buffer;
                    console.log('BufferLoader', name);
                }
                me.loaded = true;
            });
            bufferLoader.load();
        },
        play: function() {
            if (this.loaded === true) {
                console.log('play');
                var me = this;
                this.sources = [];
                function playSound(buffer, time) {
                    var source = me.context.createBufferSource();
                    source.buffer = buffer;
                    source.connect(me.context.destination);
                    if (!source.start) source.start = source.noteOn;
                    source.start(time);
                    me.sources.push(source);
                }
                var kick = this.BUFFERS.kick;
                var kick2 = this.BUFFERS.kick2;
                var snare = this.BUFFERS.snare;
                var hihat = this.BUFFERS.hihat;
                var startTime = this.context.currentTime + 0.100;
                var tempo = Math.round(60/(kick.duration/16));
                var eighthNoteTime = (120 / tempo);

                playSound(snare, startTime + 0 * 8 * eighthNoteTime);
                
                for (var bar = 0; bar < 8; bar++) {
                    var time = startTime + bar * (8 * eighthNoteTime);
                    if (bar % 2 === 0) {
                        playSound(kick, time);
                    } else {
                        playSound(kick2, time);
                    }
                    /*
                    for (var i = 0; i < 8; ++i) {
                      playSound(hihat, time + (i * eighthNoteTime));
                    }*/
                }
            }
        },
        stop: function() {
            if (this.loaded === true) {
                console.log('stop');
                for (var i=0; this.sources.length; i++) {
                    if (this.sources[i]) {
                        this.sources[i].stop(0);
                    }
                }
            }
        }
    };
    
    window.Mixer = Mixer;
}());
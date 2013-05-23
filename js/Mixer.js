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
        init: function () {
            var me = this;
            console.log('Mixer', this);
            
            if ('webkitAudioContext' in window) {
                this.context = new webkitAudioContext();
            }
            
            var BUFFERS_TO_LOAD = {
                kick: 'audio/instrumental.mp3',
                snare: 'audio/acapella.mp3',
                hihat: 'audio/hihat.wav'
            };
            this.BUFFERS = {};
            var names = [];
            var paths = [];
            for (var name in BUFFERS_TO_LOAD) {
                var path = BUFFERS_TO_LOAD[name];
                names.push(name);
                paths.push(path);
            }
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
                var snare = this.BUFFERS.snare;
                var hihat = this.BUFFERS.hihat;
                var startTime = this.context.currentTime + 0.100;
                var tempo = 90;
                var eighthNoteTime = (120 / tempo);
                
                playSound(snare, startTime + 0 * 8 * eighthNoteTime);
                
                for (var bar = 0; bar < 8; bar++) {
                    var time = startTime + bar * 8 * eighthNoteTime;
                    playSound(kick, time);
                    
                    //playSound(snare, time + 2 * eighthNoteTime);
                    //playSound(snare, time + 6 * eighthNoteTime);
                    for (var i = 0; i < 8; ++i) {
                      playSound(hihat, time + i * eighthNoteTime);
                    }
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
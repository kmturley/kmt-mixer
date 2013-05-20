/*globals console, window, document*/
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
        init: function () {
            console.log('Mixer', this);
            this.track1 = this.create();
            this.track2 = this.create();
            this.load(this.track1, this.options.instrumental);
            this.load(this.track2, this.options.acapella);
        },
        create: function () {
            var track = document.createElement('audio');
            track.setAttribute('loop', true);
            track.addEventListener('canplaythrough', function () {
                track.play();
                console.log(track.duration);
                console.log(track.src);
            }, true);
            return track;
        },
        load: function (track, url) {
            console.log('mp3', track.canPlayType('audio/mpeg'));
            track.setAttribute('src', url);
            track.load();
            console.log('load', url);
        }
    };
    
    window.Mixer = Mixer;
}());
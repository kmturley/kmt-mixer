/*globals console, window, document, Audio*/
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
        index1: 0,
        index2: 0,
        init: function () {
            console.log('Mixer.init', this);
            this.audio = new Audio();
            this.load();
        },
        load: function (track, index) {
            if (track === 'track1' && index) { this.index1 = index; }
            if (track === 'track2' && index) { this.index2 = index; }
            this.audio.load([this.options.tracks1[this.index1], this.options.tracks2[this.index2]]);
            this.render();
        },
        render: function () {
            var h1 = this.el.getElementsByTagName('h1'),
                p = this.el.getElementsByTagName('p'),
                ul = this.el.getElementsByTagName('ul'),
                i = 0,
                html = '',
                html2 = '';
            
            h1[0].innerHTML = this.options.tracks1[this.index1].artist;
            h1[2].innerHTML = this.options.tracks2[this.index2].artist;
            p[0].innerHTML = this.options.tracks1[this.index1].title;
            p[2].innerHTML = this.options.tracks2[this.index2].title;

            for (i = 0; i < this.options.tracks1.length; i += 1) {
                html += '<li><a href="#" onclick="mixer.load(\'track1\', ' + i + ');" class="item bg1 c3">' + this.options.tracks1[i].artist + ' - ' + this.options.tracks1[i].title + '</a></li>';
            }
            for (i = 0; i < this.options.tracks2.length; i += 1) {
                html2 += '<li><a href="#" onclick="mixer.load(\'track2\', ' + i + ');" class="item bg1 c3">' + this.options.tracks2[i].artist + ' - ' + this.options.tracks2[i].title + '</a></li>';
            }
            ul[0].innerHTML = html;
            ul[1].innerHTML = html2;
        },
        play: function () {
            this.audio.play();
        },
        stop: function () {
            this.audio.stop();
        }
    };
    
    window.Mixer = Mixer;
}());
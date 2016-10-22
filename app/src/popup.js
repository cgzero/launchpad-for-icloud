/**
 * @file popup js file
 * @author cgzero(cgzero@cgzero.com)
 * @date 2014-09-28
 */
(function () {
    /**
     * 图片地址
     *
     * @const
     * @type {string}
     */
    var URL_IMG =  chrome.i18n.getMessage('calendarIconUrl');

    /**
     * 需要国际化的文字节点
     *
     * @const
     * @type {Array}
     */
    var TEXT_NODES = [
        'mail',
        'contacts',
        'calendar',
        'photos',
        'iclouddrive',
        'find',
        'notes',
        'reminders',
        'pages',
        'numbers',
        'keynote',
        'settings',
        'home',
        'fmf',
        'launchpad'
    ];

    /**
     * 日历对象
     */
    var Calender = {
        canvas: document.getElementById('canvas'),
        ctx: document.getElementById('canvas').getContext('2d'),
        imgSrc: URL_IMG,

        drawDay: function (img, sy) {
            this.ctx.drawImage(img, 230 * 2, sy, 340 * 2, 30 * 2, 10, 10, 160, 15);
        },

        drawSunday: function (img) {
            this.drawDay(img, 120 * 2);
        },

        drawMonday: function (img) {
            this.drawDay(img, 150 * 2);
        },

        drawTuesday: function (img) {
            this.drawDay(img, 180 * 2);
        },

        drawWednesday: function (img) {
            this.drawDay(img, 210 * 2);
        },

        drawThursday: function (img) {
            this.drawDay(img, 240 * 2);
        },

        drawFriday: function (img) {
            this.drawDay(img, 270 * 2);
        },

        drawSaturday: function (img) {
            this.drawDay(img, 300 * 2);
        },

        drawNum: function (img, sx, dx) {
            this.ctx.drawImage(img,sx,0,52 * 2,80 * 2,dx,25,26,40);
        },

        drawDate: function (img, nowDate) {
            if (nowDate < 10) {
                switch(nowDate) {
                    case 1 : this.drawNum(img, 11 * 2, 25); break;
                    case 2 : this.drawNum(img, 60 * 2, 25); break;
                    case 3 : this.drawNum(img, 118 * 2, 25); break;
                    case 4 : this.drawNum(img, 170 * 2, 25); break;
                    case 5 : this.drawNum(img, 225 * 2, 25); break;
                    case 6 : this.drawNum(img, 280 * 2, 25); break;
                    case 7 : this.drawNum(img, 333 * 2, 25); break;
                    case 8 : this.drawNum(img, 385 * 2, 25); break;
                    case 9 : this.drawNum(img, 440 * 2, 25); break;
                }
            }
            else {
                var dateArr = [];
                dateArr.push((nowDate - nowDate%10)/10);
                dateArr.push(nowDate%10);
                var x = 12;
                for(var i=0; i<dateArr.length; i++) {
                    switch(dateArr[i]) {
                        case 1 : this.drawNum(img, 11 * 2, x); x=x+25; break;
                        case 2 : this.drawNum(img, 60 * 2, x); x=x+25; break;
                        case 3 : this.drawNum(img, 118 * 2, x); x=x+25; break;
                        case 4 : this.drawNum(img, 170 * 2, x); x=x+25; break;
                        case 5 : this.drawNum(img, 225 * 2, x); x=x+25; break;
                        case 6 : this.drawNum(img, 280 * 2, x); x=x+25; break;
                        case 7 : this.drawNum(img, 333 * 2, x); x=x+25; break;
                        case 8 : this.drawNum(img, 385 * 2, x); x=x+25; break;
                        case 9 : this.drawNum(img, 440 * 2, x); x=x+25; break;
                        case 0 : this.drawNum(img, 495 * 2, x); x=x+25; break;
                    }
                }
            }
        },

        drawCalender: function (img) {
            this.ctx.drawImage(
                img,
                0,
                100 * 2,
                142 * 2,
                142 * 2,
                0,0,74,74
            );
            var date = new Date();
            var nowDay = date.getDay();
            var nowDate = date.getDate();
            switch(nowDay) {
                case 0 : this.drawSunday(img); break;
                case 1 : this.drawMonday(img); break;
                case 2 : this.drawTuesday(img); break;
                case 3 : this.drawWednesday(img); break;
                case 4 : this.drawThursday(img); break;
                case 5 : this.drawFriday(img); break;
                case 6 : this.drawSaturday(img); break;
            }
            this.drawDate(img, nowDate);
        },

        init: function() {
            var self = this;
            this.canvas.setAttribute('width', 74 * 2);
            this.canvas.setAttribute('height', 74 * 2);
            this.ctx.scale(2, 2);

            var calImg = new Image();
            calImg.src = this.imgSrc;
            calImg.onload = function() {
                self.ctx.beginPath();
                self.drawCalender(this);
            };
        }
    };

    function setTextNodes() {
        $.each(TEXT_NODES, function (i, item) {
            $('#i18n-' + item).text(chrome.i18n.getMessage(item));
        });
    }

    /**
     * 初始化
     */
    (function init() {
        // 初始化日历
        Calender.init();
        setTextNodes();
    })();
})();


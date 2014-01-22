$(document).ready(function() {

    var Calender = {
        canvas      : document.getElementById('canvas'),
        ctx         : document.getElementById('canvas').getContext('2d'),
        imgSrc      : 'images/calendar_icon.png',

        drawSunday  : function(img) {
            this.ctx.drawImage(
                img,
                230 * 2,
                120 * 2,
                340 * 2,
                30 * 2,
                10,10,160,15
            );
        },
        drawMonday  : function(img) {
            this.ctx.drawImage(
                img,
                230 * 2,
                150 * 2,
                340 * 2,
                30 * 2,
                10,10,160,15
            );
        },
        drawTuesday : function(img) {
            this.ctx.drawImage(
                img,
                230 * 2,
                180 * 2,
                340 * 2,
                30 * 2,
                10,10,160,15
            );
        },
        drawWednesday : function(img) {
            this.ctx.drawImage(
                img,
                230 * 2,
                210 * 2,
                340 * 2,
                30 * 2,
                10,10,160,15
            );
        },
        drawThursday : function(img) {
            this.ctx.drawImage(img,
                230 * 2,
                240 * 2,
                340 * 2,
                30 * 2,
                10,10,160,15
            );
        },
        drawFriday : function(img) {
            this.ctx.drawImage(img,
                230 * 2,
                270 * 2,
                340 * 2,
                30 * 2,
                10,10,160,15
            );
        },
        drawSaturday : function(img) {
            this.ctx.drawImage(
                img,
                230 * 2,
                300 * 2,
                340 * 2,
                30 * 2,
                10,10,160,15
            );
        },
        drawNum : function(img, sx, dx) {
            this.ctx.drawImage(img,sx,0,52 * 2,80 * 2,dx,25,26,40);
        },
        drawDate : function(img, nowDate) {
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
            } else {
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
        drawCalender : function(img) {
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
            };
            this.drawDate(img, nowDate);
        },
        init : function() {
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
    }
    Calender.init();
});



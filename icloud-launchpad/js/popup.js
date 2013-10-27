$(document).ready(function() {

    var Calender = {
        ctx : document.getElementById('canvas').getContext('2d'),
        imgSrc : 'images/calendar_icon.png',

        drawSunday : function(img) {
            this.ctx.drawImage(img,230,120,340,30,10,10,160,15);
        },
        drawMonday : function(img) {
            this.ctx.drawImage(img,230,150,340,30,10,10,160,15);
        },
        drawTuesday : function(img) {
            this.ctx.drawImage(img,230,180,340,30,10,10,160,15);
        },
        drawWednesday : function(img) {
            this.ctx.drawImage(img,230,210,340,30,10,10,160,15);
        },
        drawThursday : function(img) {
            this.ctx.drawImage(img,230,240,340,30,10,10,160,15);
        },
        drawFriday : function(img) {
            this.ctx.drawImage(img,230,270,340,30,10,10,160,15);
        },
        drawSaturday : function(img) {
            this.ctx.drawImage(img,230,300,340,30,10,10,160,15);
        },
        drawNum : function(img, sx, dx) {
            this.ctx.drawImage(img,sx,0,52,80,dx,25,26,40);
        },
        drawDate : function(img, nowDate) {
            if (nowDate < 10) {
                switch(nowDate) {
                    case 1 : this.drawNum(img, 11, 25); break;
                    case 2 : this.drawNum(img, 60, 25); break;
                    case 3 : this.drawNum(img, 118, 25); break;
                    case 4 : this.drawNum(img, 170, 25); break;
                    case 5 : this.drawNum(img, 225, 25); break;
                    case 6 : this.drawNum(img, 280, 25); break;
                    case 7 : this.drawNum(img, 333, 25); break;
                    case 8 : this.drawNum(img, 385, 25); break;
                    case 9 : this.drawNum(img, 440, 25); break;
                }
            } else {
                var dateArr = [];
                dateArr.push((nowDate - nowDate%10)/10);
                dateArr.push(nowDate%10);
                var x = 12;
                for(var i=0; i<dateArr.length; i++) {
                    switch(dateArr[i]) {
                        case 1 : this.drawNum(img, 11, x); x=x+25; break;
                        case 2 : this.drawNum(img, 60, x); x=x+25; break;
                        case 3 : this.drawNum(img, 118, x); x=x+25; break;
                        case 4 : this.drawNum(img, 170, x); x=x+25; break;
                        case 5 : this.drawNum(img, 225, x); x=x+25; break;
                        case 6 : this.drawNum(img, 280, x); x=x+25; break;
                        case 7 : this.drawNum(img, 333, x); x=x+25; break;
                        case 8 : this.drawNum(img, 385, x); x=x+25; break;
                        case 9 : this.drawNum(img, 440, x); x=x+25; break;
                        case 0 : this.drawNum(img, 495, x); x=x+25; break;
                    }
                }
            }
        },
        drawCalender : function(img) {
            this.ctx.drawImage(img,0,100,142,142,0,0,74,74);
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



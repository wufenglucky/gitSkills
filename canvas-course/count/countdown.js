var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 800;
var RADIUS = 8;
var MARGIN_TOP = 300;
var MARGIN_LEFT = 20;
const endTime = new Date(2018, 6, 2, 12, 12, 12);
var curShowTimeSeconds = 0;

var balls = [];
var colors = ["#33B5E5", "#0099cc", "#AA66CC", "#9933CC", "#9900CC", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];


window.onload = function () {
    // WINDOW_WIDTH = document.documentElement.clientWidth;
    // WINDOW_HEIGHT = document.documentElement.clientHeight;
    // WINDOW_WIDTH = document.body.clientWidth ;
    // WINDOW_HEIGHT = document.body.clientHeight;
    //
    // MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    // RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
    // MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.width = WINDOW_WIDTH;
    context.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    // render(context);
    //该setInterval需要传入两个参数，一个是匿名函数，表示执行的动作，
    // 另一个是时间，表示没隔多长时间执行一遍这个匿名函数
    setInterval(
        function () {
        render(context);
        update();
        },
        50
    );
}

/**
 *刷新当前的倒计时数，实现时间逐秒递减
 */
function update() {
    var nextTimeSeconds = getCurrentShowTimeSeconds();
    var nextHour = parseInt(nextTimeSeconds/3600);
    var nextMin = parseInt((nextTimeSeconds - nextHour * 3600)/60);
    var nextSce = nextTimeSeconds % 60;

    var curHour = parseInt(curShowTimeSeconds/3600);
    var curMin = parseInt((curShowTimeSeconds - curHour * 3600)/60);
    var curSce = curShowTimeSeconds % 60;

    if(nextSce != curSce){
        //小时数字所代表的球数
        if(parseInt(nextHour/10) != parseInt(curHour/10)){
            addBalls(MARGIN_LEFT+0, MARGIN_TOP, parseInt(curHour/10));
        }
        if(parseInt(nextHour%10) != parseInt(curHour%10)){
            addBalls(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(curHour%10));
        }

        //分钟数字代表的球数
        if(parseInt(nextMin/10) != parseInt(curMin/10)){
            addBalls(MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(curMin/10));
        }
        if(parseInt(nextMin%10) != parseInt(curMin%10)){
            addBalls(MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(curMin%10));
        }

        //秒钟数字代表的球数
        if(parseInt(nextSce/10) != parseInt(curSce/10)){
            addBalls(MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(curSce/10));
        }
        if(parseInt(nextSce%10) != parseInt(curSce%10)){
            addBalls(MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(curSce%10));
        }

        curShowTimeSeconds = nextTimeSeconds;
    }
    updateBalls();
    console.log(balls.length);//在console控制台中显示先小球的个数
}

/**
 * 对小球的状态进行更新
 */
function updateBalls() {
    for(var i = 0; i < balls.length; i ++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy*0.75
        }
    }

    //维持小球的数组在一定的大小内，使得该数组占少量的内存资源，便于长期运行
    var cnt = 0;
    for(var j = 0; j < balls.length; j ++)
        if(balls[j].x+RADIUS > 0 && balls[j].x-RADIUS < WINDOW_WIDTH)
            balls[cnt ++] = balls[j];

    while(balls.length > Math.min(300, cnt)){
        balls.pop();
    }
}

/**
 * 将小球添加到balls数组中
 * @param x
 * @param y
 * @param num
 */
function addBalls(x, y, num) {
    for(var i = 0; i < digit[num].length; i ++){
        for(var j = 0; j < digit[num][i].length; j ++){
            if(digit[num][i][j] == 1){
                var ball = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5 + Math.random(),
                    vx:Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                }
                balls.push(ball);
            }
        }
    }
}

/**
 * 获取倒计时的剩下的秒数
 * @returns {number}
 */
function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret/1000);
    return ret >= 0 ? ret : 0;
}

/**
 * 显示出时间
 * @param cxt
 */
function render(cxt) {
    cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);//刷新画布显示

    var hour = parseInt(curShowTimeSeconds/3600);
    var min = parseInt((curShowTimeSeconds - hour * 3600)/60);
    var sce = curShowTimeSeconds % 60;

    //小时数
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hour/10), cxt);
    renderDigit(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hour%10), cxt);
    renderDigit(MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10, cxt);

    //分钟数
    renderDigit(MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(min/10), cxt);
    renderDigit(MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(min%10), cxt);
    renderDigit(MARGIN_LEFT+69*(RADIUS+1), MARGIN_TOP, 10, cxt);

    //秒钟数
    renderDigit(MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(sce/10), cxt);
    renderDigit(MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(sce%10), cxt);

    //绘制运动的小球
    for(var i = 0; i < balls.length; i ++){
        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
        cxt.closePath();

        cxt.fill();
    }
}

/**
 * 绘制出一个数字
 * @param x
 * @param y
 * @param num
 * @param cxt
 */
function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = "rgb(0, 102, 153)";
    for(var i = 0; i < digit[num].length; i ++){
        for(var j = 0; j < digit[num][i].length; j ++){
            if(digit[num][i][j] == 1){
                cxt.beginPath();
                //绘制出一个圆
                cxt.arc(x + 2*j*(RADIUS+1)+ (RADIUS+1), y + 2*i*(RADIUS+1) + (RADIUS+1), RADIUS, 0, 2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}


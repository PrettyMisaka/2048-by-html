//一个容器margin10 长宽80
let blockColorMap = {
    0: '#ccc0b2',
    2: '#eee4da',
    4: '#ece0c8',
    8: '#f2b079',
    16: '#f49462',
    32: '#f47c5f',
    64: '#f55d3b',
    128: '#ebcc60',
    256: '#ebc74f',
    512: '#edc339',
    1024: '#edc12c',
    2048: '#f0bb15'
}
let actionBearing = {
    'UP': 0,
    'DOWN': 1,
    'LEFT': 2,
    'RIGHT': 3
}
let totalData = new function () {
    this.arr = blockArrInit();
    this.valuearr = ValueArrInit();
    this.ablePlace = 16;
    this.animationShow = (mod) => {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                this.arr[y][x].animationSet(mod);
            }
        }
    }
    this.gameUpdate = () => {
        let gameVacancy = 0, isBreak = false;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (this.valuearr[y][x] === 0) gameVacancy++;
                this.arr[y][x].isNew = false;
            }
        }
        let randomNum = parseInt(getRandomArbitrary(1, gameVacancy + 1));
        console.log(randomNum + '|' + gameVacancy);
        gameVacancy = 0;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (this.valuearr[y][x] === 0) gameVacancy++;
                if (gameVacancy === randomNum) {
                    this.valuearr[y][x] = 2;
                    this.arr[y][x].isNew = true;
                    isBreak = true;
                    break;
                }
            }
            if (isBreak) break;
        }
    };
    this.totalReFlash = function () {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                this.arr[y][x].value = totalData.valuearr[y][x];
                this.arr[y][x].blockColorFlash();
                this.arr[y][x].showValue();
                if (totalData.arr[y][x].isNew) {
                    // this.arr[y][x].el.style.border = 'solid 2px black';
                    this.arr[y][x].updateAnimationSet();
                } else this.arr[y][x].el.style.border = 'none';
            }
        }
    }
}
let ISMobile = isMobile();
if (ISMobile) {
    let gameBg = document.getElementById('gameBg');
    gameBg.style.transform = 'translate(-50%, -50%) scale(80%,80%)';
}
// totalData.valuearr = [[0, 2, 4, 8], [16, 32, 64, 128], [256, 512, 1024, 2048], [0, 0, 0, 0]];
// console.log(totalData.valuearr);
//1
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    //禁止右键菜单
})

document.addEventListener('selectstart', function (e) {
    e.preventDefault();
    //禁止右键选择
})
console.log(isMobile());
totalData.gameUpdate();
totalData.totalReFlash();
eventReg();

function BlockInit(x, y) {
    this.x = x;
    this.y = y;
    this.offsetx = x * 100;
    this.offsety = y * 100;
    this.isNew = false;

    let el = document.getElementById('gameBg');
    this.el = el.children[y].children[x];
    this.el.style.left = this.offsetx + 'px';

    this.value = 0;
    this.blockColorFlash = () => {
        this.el.style.backgroundColor = blockColorMap[this.value];
    }
    this.showValue = () => {
        if (this.value === 0) this.el.innerHTML = ''
        else this.el.innerHTML = this.value;
    }
    this.animationSet = function (mod) {
        this.el.style.transform = 'none';
        this.el.style.transition = 'ease .1s';
        if (this.value !== 0) {
            let animationStrong = '8px';
            let transformBearing = ['0,-' + animationStrong, '0,' + animationStrong, '-' + animationStrong + ',0', animationStrong + ',0'];
            this.el.style.transform = 'translate(' + transformBearing[mod] + ')';
            setTimeout(() => {
                this.el.style.transform = 'translate(0,0)';
            }, 100)
        }
    }
    this.updateAnimationSet = function () {
        this.el.style.transform = 'none';
        this.el.style.transform = 'scale(0,0)';
        this.el.style.transform = 'scale(115%,115%)';
        this.el.style.transition = 'ease 0.4s';
        setTimeout(() => {
            this.el.style.transform = 'scale(100%,100%)';
        }, 400)
    }
}

function isMobile() {
    let userAgentInfo = navigator.userAgent;
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    let getArr = Agents.filter(i => userAgentInfo.includes(i));
    return getArr.length ? true : false;
}

function ValueArrInit() {
    let arrBody = new Array(4);
    for (let i = 0; i < 4; i++)
        arrBody[i] = [0, 0, 0, 0];
    return arrBody;
}

function blockArrInit() {
    let arrBody = new Array(4);
    for (let y = 0; y < 4; y++) {
        let arrRow = new Array(4);
        arrBody[y] = arrRow;
        for (let x = 0; x < 4; x++) {
            arrRow[x] = new BlockInit(x, y);
            arrRow[x].blockColorFlash();
        }
    }
    // console.log(arrBody);
    return arrBody;
}

function eventReg() {
    let isBegin = false;
    let bodyEl = document.getElementsByTagName('body')[0];
    let mouseBeginDistanceX = 0;
    let mouseBeginDistanceY = 0;
    let mouseEndDistanceX = 0;
    let mouseEndDistanceY = 0;
    if (!ISMobile) {
        bodyEl.onmousedown = function (e) {
            isBegin = true;
            bodyEl.style.cursor = 'pointer';
            mouseBeginDistanceX = e.pageX;
            mouseBeginDistanceY = e.pageY;
        }
        bodyEl.onmouseup = function (e) {
            let tmpBearing = '';
            isBegin = false;
            bodyEl.style.cursor = 'default';
            mouseEndDistanceX = e.pageX;
            mouseEndDistanceY = e.pageY;
            let journeyX = {
                value: mouseEndDistanceX - mouseBeginDistanceX,
                abs: Math.abs(mouseEndDistanceX - mouseBeginDistanceX)
            };
            let journeyY = {
                value: mouseEndDistanceY - mouseBeginDistanceY,
                abs: Math.abs(mouseEndDistanceY - mouseBeginDistanceY)
            };
            if (journeyX.abs < 100 && journeyY.abs < 100) return false;
            // console.log(journeyX.value + '|' + journeyY.value);
            if (journeyX.abs > journeyY.abs) {
                if (journeyX.value < 0) tmpBearing = 'LEFT';
                else tmpBearing = 'RIGHT';
            } else {
                if (journeyY.value < 0) tmpBearing = 'UP';
                else tmpBearing = 'DOWN';
            }
            totalData.animationShow(actionBearing[tmpBearing]);
            judgeAndAdd(actionBearing[tmpBearing]);
            // console.log(totalData.valuearr);
            totalData.gameUpdate();
            totalData.totalReFlash();
        }
    } else {
        bodyEl.ontouchstart = function (e) {
            isBegin = true;
            mouseBeginDistanceX = e.targetTouches[0].pageX;
            mouseBeginDistanceY = e.targetTouches[0].pageY;
            console.log(e.targetTouches[0].pageX + '|' + e.targetTouches[0].pageY);
        }
        bodyEl.ontouchend = function (e) {
            let tmpBearing = '';
            isBegin = false;
            mouseEndDistanceX = e.changedTouches[0].pageX;
            mouseEndDistanceY = e.changedTouches[0].pageY;
            let journeyX = {
                value: mouseEndDistanceX - mouseBeginDistanceX,
                abs: Math.abs(mouseEndDistanceX - mouseBeginDistanceX)
            };
            let journeyY = {
                value: mouseEndDistanceY - mouseBeginDistanceY,
                abs: Math.abs(mouseEndDistanceY - mouseBeginDistanceY)
            };
            // if (journeyX.abs < 50 && journeyY.abs < 50) return false;
            // console.log(journeyX.value + '|' + journeyY.value);
            if (journeyX.abs > journeyY.abs) {
                if (journeyX.value < 0) tmpBearing = 'LEFT';
                else tmpBearing = 'RIGHT';
            } else {
                if (journeyY.value < 0) tmpBearing = 'UP';
                else tmpBearing = 'DOWN';
            }
            totalData.animationShow(actionBearing[tmpBearing]);
            judgeAndAdd(actionBearing[tmpBearing]);
            // console.log(totalData.valuearr);
            totalData.gameUpdate();
            totalData.totalReFlash();
        }
    }


}

function getRandomArbitrary(min, max) {// 大于等于 min小于max。
    return Math.random() * (max - min) + min;
}


function judgeAndAdd(mod) {
    if (mod === 0) {//向上 只有y要换
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                for (let i = 1; i < (4 - y); i++) {
                    let el = totalData.valuearr[i - 1][x];
                    let nextEl = totalData.valuearr[i][x];
                    if (el === 0) {//为空 往上移动 互换
                        totalData.valuearr[i][x] = 0;
                        totalData.valuearr[i - 1][x] = nextEl;
                        continue;
                    }
                    if (nextEl === el) {
                        totalData.valuearr[i][x] = 0;
                        totalData.valuearr[i - 1][x] = el + nextEl;
                    }
                }
            }
        }
    } else if (mod === 1) {//向下 只有y要换
        for (let x = 0; x < 4; x++) {
            for (let y = 3; y >= 0; y--) {
                for (let i = 2; i >= 0; i--) {
                    let el = totalData.valuearr[i + 1][x];
                    let nextEl = totalData.valuearr[i][x];
                    if (el === 0) {//为空 拉取上值 互换
                        totalData.valuearr[i + 1][x] = nextEl;
                        totalData.valuearr[i][x] = 0;
                        continue;
                    }
                    if (nextEl === el) {
                        totalData.valuearr[i + 1][x] = el + nextEl;
                        totalData.valuearr[i][x] = 0;
                    }
                }
            }
        }
    } else if (mod === 2) {//向左 只有x要换
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                for (let i = 1; i < 4; i++) {
                    let el = totalData.valuearr[y][i - 1];
                    let nextEl = totalData.valuearr[y][i];
                    if (el === 0) {//为空 往下移动 互换
                        totalData.valuearr[y][i] = el;
                        totalData.valuearr[y][i - 1] = nextEl;
                        continue;
                    }
                    if (nextEl === el) {
                        totalData.valuearr[y][i - 1] = el + nextEl;
                        totalData.valuearr[y][i] = 0;
                    }
                }
            }
        }
    } else if (mod === 3) {//向右 只有x要换
        for (let y = 0; y < 4; y++) {
            for (let x = 3; x >= 0; x--) {
                for (let i = 2; i >= 0; i--) {
                    let el = totalData.valuearr[y][i + 1];
                    let nextEl = totalData.valuearr[y][i];
                    if (el === 0) {//为空 往下移动 互换
                        totalData.valuearr[y][i] = el;
                        totalData.valuearr[y][i + 1] = nextEl;
                        continue;
                    }
                    if (nextEl === el) {
                        totalData.valuearr[y][i + 1] = el + nextEl;
                        totalData.valuearr[y][i] = 0;
                    }
                }
            }
        }
    }
    // console.log(totalData.valuearr);
}


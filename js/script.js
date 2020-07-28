var
    canv = document.getElementById('canvas'),
    ctx = canv.getContext('2d');

canv.width = window.innerHeight;
canv.height = window.innerHeight;

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canv.width, canv.height);

var
    knightIdle = new Image(),
    knightIdleRev = new Image(),
    knightRun = new Image(),
    knightRunRev = new Image(),
    knightJump = new Image(),
    knightAttack = new Image(),
    knightAttackRev = new Image(),
    knightShield = new Image(),
    knightShieldRev = new Image(),
    bg1 = new Image(),
    bg2 = new Image(),
    bg3 = new Image(),
    bg4 = new Image(),
    bg5 = new Image(),
    bg6 = new Image(),
    bg7 = new Image(),
    bg8 = new Image(),
    bg9 = new Image(),
    fg1 = new Image(),
    fg2 = new Image();

knightIdle.src = "img/knight/KnightIdle_strip.png";
knightIdleRev.src = "img/knight/KnightIdleRev_strip.png";
knightRun.src = "img/knight/KnightRun_strip.png";
knightRunRev.src = "img/knight/KnightRunRev_strip.png";
knightJump.src = "img/knight/KnightJumpAndFall_strip.png";
knightAttack.src = "img/knight/KnightAttack_strip.png";
knightAttackRev.src = "img/knight/KnightAttackRev_strip.png";
knightShield.src = "img/knight/KnightShield_strip.png";
knightShieldRev.src = "img/knight/KnightShieldRev_strip.png";
bg1.src = "img/background/Layer_0010_1.png";
bg2.src = "img/background/Layer_0009_2.png";
bg3.src = "img/background/Layer_0008_3.png";
bg4.src = "img/background/Layer_0007_Lights.png";
bg5.src = "img/background/Layer_0006_4.png";
bg6.src = "img/background/Layer_0005_5.png";
bg7.src = "img/background/Layer_0004_Lights.png";
bg8.src = "img/background/Layer_0003_6.png";
bg9.src = "img/background/Layer_0002_7.png";
fg1.src = "img/background/Layer_0001_8.png";
fg2.src = "img/background/Layer_0000_9.png";

var enemies = [];
var bullets = [];

class Enemy {
    constructor(image, imageIdle, xPos, yPos, health, position, currentFrame) {
        this.xPos = xPos;
        this.yPos = yPos;

        this.image = new Image();
        this.image.src = image;

        this.imageIdle = new Image();
        this.imageIdle.src = imageIdle;

        this.health = health;
        this.dead = false;

        this.currentFrame = currentFrame;
        this.tick = 0;

        this.position = position; // 0 - left; 1 - right
    }
}

class Bullet {
    constructor(image, xPos, yPos, rotate) {
        this.xPos = xPos;
        this.yPos = yPos;

        this.image = new Image();
        this.image.src = image;

        this.rotate = rotate;

        this.tick = 0;
        this.currentFrame = 0;
    }
}

var currentframe = 0,
    currentframeRun = 0,
    currentframeAttack = 0,
    currentframeShield = 0,
    tick_count = 0,
    key = -1;

window.addEventListener("resize", Resize); // изменение размеров холста при изменении размеров окна

function Resize() {
    canv.width = window.innerHeight;
    canv.height = window.innerHeight;
}

document.addEventListener("keydown", function(e) { // управление
    key = e.keyCode;
    console.log(key);
});

document.addEventListener("keyup", function(e) {
    key = -1;
    switch(e.keyCode) {
        case 65:
            currentframeAttack = 3024;
            break;
        case 68:
            currentframeAttack = 0;
            break;
        case 87:
            if(rotate == -1)
                currentframeAttack = 3024;
            else if(rotate == 1)
                currentframeAttack = 0;
            break;
    }
});

function RandomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

var
    xPos = 10,
    yPos = canv.height - 130, // Параметры главного героя
    rotate = 1, // -1 = left; 1 - right
    health = 100,
    stamina = 100,
    staminaFlag = 1,
    score = 0,
    animSpeed = 3,
    speed = 7;

var
    x1 = 0,
    x2 = canv.width;

function draw() {
    ctx.clearRect(0, 0, canv.width, canv.height); // очистка холста от предыдущего кадра
    ctx.drawImage(bg1, 0, canv.height - bg1.height);
    ctx.drawImage(bg2, 0, canv.height - bg2.height);
    ctx.drawImage(bg3, 0, canv.height - bg3.height);
    ctx.drawImage(bg4, 0, canv.height - bg4.height);
    ctx.drawImage(bg5, 0, canv.height - bg5.height);
    ctx.drawImage(bg6, 0, canv.height - bg6.height);
    ctx.drawImage(bg7, 0, canv.height - bg7.height);
    ctx.drawImage(bg8, x1, canv.height - bg8.height);
    ctx.drawImage(bg8, x2, canv.height - bg8.height);
    ctx.drawImage(bg9, 0, canv.height - bg9.height);
    ctx.drawImage(fg1, 0, canv.height - fg1.height);


    tick_count += 1;

    if(key == 65) { // передвижение влево
        xPos = xPos < 10 ? xPos : xPos - speed; // левая граница
        rotate = -1;

        if(tick_count > animSpeed) {
            currentframeRun = (currentframeRun === 672 ? 0 : currentframeRun + 96);
            tick_count = 0;
        }
        ctx.drawImage(knightRunRev, currentframeRun, 0, 64, 64, xPos, yPos, 96, 96);

    } else if(key == 68) { // передвижение вправо
        xPos = xPos > canv.width - 180 ? xPos : xPos + speed; // правая граница
        rotate = 1;

        if(tick_count > animSpeed) {
            currentframeRun = (currentframeRun === 672 ? 0 : currentframeRun + 96);
            tick_count = 0;
        }
        ctx.drawImage(knightRun, currentframeRun, 0, 64, 64, xPos, yPos, 96, 96);

    // } else if(key == 87) { // прыжок
    //     yPos += -10;

    //     if(tick_count > 10) {
    //         currentframeJump = (currentframeJump > 2160 ? 0 : currentframeJump + 154);
    //         tick_count = 0;
    //     }
    //     ctx.drawImage(knightJump, currentframeJump, 0, 64, 64, xPos, yPos, 96, 96);

    } else if(key == 87 && staminaFlag == 1 && stamina > 14 && rotate == 1) {
        
        if(tick_count > animSpeed) {
            currentframeAttack = (currentframeAttack === 3024 ? 0 : currentframeAttack + 144);
            tick_count = 0;
        }
        ctx.drawImage(knightAttack, currentframeAttack, 0, 144, 64, xPos - 50, yPos, 216, 96);
        
        if(currentframeAttack == 1008) {
            stamina -= 1;
        } else if(currentframeAttack == 1584) {
            stamina -= 5;
        } else if(currentframeAttack == 2592) {
            stamina -= 10;
        }

    } else if(key == 87 && staminaFlag == 1 && stamina > 14 && rotate == -1) {

        if(tick_count > animSpeed) {
            currentframeAttack = currentframeAttack === 0 ? 3024 : currentframeAttack - 144;
            tick_count = 0;
        }
        ctx.drawImage(knightAttackRev, currentframeAttack, 0, 144, 64, xPos - 70, yPos, 216, 96);
        
        if(currentframeAttack == 2160) {
            stamina -= 1;
        } else if(currentframeAttack == 1584) {
            stamina -= 5;
        } else if(currentframeAttack == 576) {
            stamina -= 10;
        }

    } else if(key == 83 && rotate == 1) {

        if(tick_count > animSpeed) {
            currentframeShield = currentframeShield === 576 ? 0 : currentframeShield + 96;
            tick_count = 0;
            stamina = stamina < 99 ? stamina + 2 : stamina;
        }
        ctx.drawImage(knightShield, currentframeShield, 0, 96, 64, xPos - 30, yPos, 144, 96);

    } else if(key == 83 && rotate == -1) {

        if(tick_count > animSpeed) {
            currentframeShield = currentframeShield === 576 ? 0 : currentframeShield + 96;
            tick_count = 0;
            stamina = stamina < 99 ? stamina + 2 : stamina;
        }
        ctx.drawImage(knightShieldRev, currentframeShield, 0, 96, 64, xPos - 30, yPos, 144, 96);

    } else { // стойка в покое
        if(rotate === 1) {
            if(tick_count > animSpeed) { // анимация
                if(stamina < 15) {
                    staminaFlag = 0;
                    currentframeAttack = 0;
                }
                else if(stamina > 30) staminaFlag = 1;
                stamina = stamina < 99 ? stamina + 2 : stamina;
                currentframe = (currentframe === 896 ? 0 : currentframe + 64);
                tick_count = 0;
            }
            ctx.drawImage(knightIdle, currentframe, 0, 64, 64, xPos, yPos, 96, 96);
        } else {
            if(tick_count > animSpeed) { // анимация
                if(stamina < 15) {
                    staminaFlag = 0;
                    currentframeAttack = 0;
                }
                else if(stamina > 30) staminaFlag = 1;
                stamina = stamina < 100 ? stamina + 2 : stamina;
                currentframe = (currentframe === 896 ? 0 : currentframe + 64);
                tick_count = 0;
            }
            ctx.drawImage(knightIdleRev, currentframe, 0, 64, 64, xPos, yPos, 96, 96);
        }
    }





    if(RandomInteger(0, 10000) > 9975 && enemies.length < 6) { // Случайное время появления врагов
        enemies.push(new Enemy("img/archer/spr_ArcherRunRev_strip_NoBkg.png", "img/archer/spr_ArcherIdleRev_strip_NoBkg.png", canv.width + 100, yPos - 30, 100, 1, 0)); // появление справа
    } else if(RandomInteger(0, 10000) < 25 && enemies.length < 6) {
        enemies.push(new Enemy("img/archer/spr_ArcherRun_strip_NoBkg.png", "img/archer/spr_ArcherIdle_strip_NoBkg.png", -100, yPos - 30, 100, 0, 0)); // появление слева
    }

    for(var i = 0; i < enemies.length; i++) {
        
        ctx.fillStyle = "#c70d00"; // полоса здоровья врага
        if(enemies[i].health < 100) ctx.fillRect(enemies[i].xPos + 55, enemies[i].yPos, enemies[i].health / 2, 3);
        
        if(xPos - 30 < enemies[i].xPos) {
            enemies[i].image.src = "img/archer/spr_ArcherRunRev_strip_NoBkg.png";
            enemies[i].imageIdle.src = "img/archer/spr_ArcherIdleRev_strip_NoBkg.png";
            enemies[i].position = 1;
        }
        else if(xPos + 30 > enemies[i].xPos) {
            enemies[i].image.src = "img/archer/spr_ArcherRun_strip_NoBkg.png";
            enemies[i].imageIdle.src = "img/archer/spr_ArcherIdle_strip_NoBkg.png";
            enemies[i].position = 0;
        }

        if(xPos + 70 < enemies[i].xPos) {
            ctx.drawImage(enemies[i].image, enemies[i].currentFrame, 0, 128, 128, enemies[i].xPos, enemies[i].yPos, 160, 160);
            enemies[i].xPos--;
        } else if(xPos - 130 > enemies[i].xPos) {
            ctx.drawImage(enemies[i].image, enemies[i].currentFrame, 0, 128, 128, enemies[i].xPos, enemies[i].yPos, 160, 160);
            enemies[i].xPos++;
        } else {
            ctx.drawImage(enemies[i].imageIdle, enemies[i].currentFrame, 0, 128, 128, enemies[i].xPos, enemies[i].yPos, 160, 160);
            if(RandomInteger(0, 10000) < 50) {
                    if(enemies[i].position == 0) {
                        bullets.push(new Bullet("img/fire/PoisonballRev_65x9.png", enemies[i].xPos, enemies[i].yPos + 55, -1));
                    } else if(enemies[i].position == 1) {
                        bullets.push(new Bullet("img/fire/Poisonball_65x9.png", enemies[i].xPos + 70, enemies[i].yPos + 55, 1));
                    }
            }
        }

        

        enemies[i].tick++;
        if(enemies[i].tick > animSpeed) {
            enemies[i].currentFrame = (enemies[i].currentFrame === 896 ? 0 : enemies[i].currentFrame + 128);
            enemies[i].tick = 0;
        }

        if(key == 87 && (enemies[i].xPos - xPos <= 40) && (enemies[i].xPos - xPos >= -30) && (rotate == 1)){ // урон по врагу
            if(currentframeAttack == 1008) {
                enemies[i].health -= 5;
            } else if(currentframeAttack == 1584) {
                enemies[i].health -= 10;
            } else if(currentframeAttack == 2592) {
                enemies[i].health -= 15;
            }
        } else if(key == 87 && (xPos - enemies[i].xPos <= 100) && (xPos - enemies[i].xPos >= 0) && (rotate == -1)) {
            if(currentframeAttack == 2160) {
                enemies[i].health -= 5;
            } else if(currentframeAttack == 1584) {
                enemies[i].health -= 10;
            } else if(currentframeAttack == 576) {
                enemies[i].health -= 15;
            }
        }
        
        if(i == 0 && enemies[i].health < 0) { // enemy is die
            enemies.shift();
            score++;
        } else if(enemies[i].health < 0) {
            enemies.splice(i, i);
            score++;
        }
    }

    for(var j = 0; j < bullets.length; j++) {
        ctx.drawImage(bullets[j].image, bullets[j].currentFrame, 0, 65, 9, bullets[j].xPos, bullets[j].yPos, 65, 9);

        bullets[j].tick++;
        if(bullets[j].tick > animSpeed) {
            bullets[j].currentFrame = bullets[j].currentFrame == 585 ? 0 : bullets[j].currentFrame + 65;
            bullets[j].tick = 0;
        }

        if(xPos + 30 < bullets[j].xPos) {
            bullets[j].xPos -= 3;
        } else if(xPos > bullets[j].xPos) {
            bullets[j].xPos += 3;
        } else if((key == 83) && (rotate == bullets[j].rotate) && (j == 0)) {
            bullets.shift();
        } else if((key == 83) && (rotate == bullets[j].rotate)) {
            bullets.splice(j, j);
        } else if(j == 0) {
            bullets.shift();
            health--;
        } else {
            bullets.splice(j, j);
            health--;
        }


    }

    if(health <= 0) return 1;

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(20, 40, health * 2, 25);

    ctx.fillStyle = "#0024a6";
    ctx.fillRect(20, 80, stamina * 2, 25);
    
    document.getElementById("score").innerHTML = score;

    ctx.drawImage(fg2, 0, canv.height - fg2.height);

    if(yPos < (canv.height - 130)) yPos += 7; // гравитация
    requestAnimationFrame(draw);
}

fg2.onload = draw;
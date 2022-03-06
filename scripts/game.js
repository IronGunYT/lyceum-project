function getRandomElement(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

var cells = [];
var inv = [];
var map = [];
var inventory = [];
var end_gameed = false;

var hp = 5;
var score = 0;
var max_hp = 5;
var bonus_attack = 0;

let items = ["enemy1.png", "enemy2.png", "enemy3.png", "enemy4.png", "enemy5.png", "enemy6.png", "enemy1.png", "enemy2.png", "enemy3.png", "enemy4.png", "enemy5.png", "enemy6.png", "boat.png", "bomb.png", "bullets.png", "canon.png", "chest_b.png", "chest_y.png", "compass.png", "key_b.png", "key_y.png", "key_b.png", "key_y.png", "map.png", "mineral1.png", "mineral2.png", "mineral3.png", "mineral4.png", "mineral5.png", "mineral6.png", "mineral7.png", "mineral8.png", "money.png", "potion1.png", "potion2.png", "potion3.png", "potion4.png", "potion5.png", "rum.png", "shotgun.png", "sword1.png", "sword2.png"];
let hero = "hero.png";
let neighbors = {
    0: [1, 4],
    1: [0, 2, 5],
    2: [1, 3, 6],
    3: [2, 7],
    4: [0, 5, 8],
    5: [1, 4, 6, 9],
    6: [2, 5, 7, 10],
    7: [3, 6, 11],
    8: [4, 9, 12],
    9: [5, 8, 10, 13],
    10: [6, 9, 11, 14],
    11: [7, 10, 15],
    12: [8, 13],
    13: [9, 12, 14],
    14: [10, 13, 15],
    15: [11, 14]
};

function main() {
    console.log('loaded');
	console.log('firefox fix');
	let rect = document.getElementsByClassName("game")[0].getBoundingClientRect();
	document.getElementById("end_game").style.top = `${rect.top+10}px`;
	document.getElementById("end_game").style.left = `${rect.left+10}px`;
    if (document.cookie.split(';').filter(function(item) {
        return item.trim().indexOf('cross_used=') == 0
    }).length) {
        console.log('The cookie "cross_used" exists (ES5)');
        document.getElementById("tip").style.display = "none";
    }

    for(let i = 0; i < 16; i++){
        cells.push(document.getElementById(`c${i}`));
    }
    for(let i = 0; i < 6; i++){
        inv.push(document.getElementById(`i${i}`));
    }
    for(let i = 0; i < 16; i++){
        map[i] = getRandomElement(items);
    }
    map[Math.floor(Math.random()*map.length)] = hero;
    update_frame();
}

function update_frame() {
    for(let i = 0; i < 16; i++){
        cells[i].querySelector("img").src = `images/items/${map[i]}`;
        if(map[i] === hero) {
            cells[i].classList.add("selected");
        }else{
            cells[i].classList.remove("selected");
        }
    }
    for(let i = 0; i < 6; i++){
        inv[i].querySelector("img").src = "images/items/void.png";
    }
    for(let i = 0; i < inventory.length; i++){
        inv[i].querySelector("img").src = `images/items/${inventory[i]}`;
    }
    update_bars();
}

function cross_clicked(){
    document.getElementById("tip").style.display = "none";
    document.cookie = "cross_used=true";
}

function add_to_inventory(item){
    if(inventory.length < 6)
        inventory.push(item);
    update_frame();
}

function regen_hp(amount){
    hp += amount;
    if(hp > max_hp) hp = max_hp;
}

// TODO: f
function remove_hp(amount){
    hp -= amount;
    hp = Math.max(hp, 0);
    if(hp === 0)
        end_game();
    update_bars();
}

function open_chest(){
    switch(Math.floor(Math.random()*7)+1){
        case 1:{
            max_hp += 1;
            break;
        }
        case 2:{
            add_to_inventory("sword.png");
            break;
        }
        case 3:{
            score += 5;
            break;
        }
        case 4:{
            remove_hp(2);
            break;
        }
        case 5:{
            add_to_inventory("bullets.png");
            break;
        }
        case 6:{
            bonus_attack += 4;
            break;
        }
        case 7:{
            regen_hp(3);
            break;
        }
    }
    update_bars();
}

function update_bars(){
    document.getElementById("hp").innerText = `${hp}/${max_hp}`;
    document.getElementById("attack").innerText = `${bonus_attack}`;
    document.getElementById("score").innerText = `${score}`;
}

function is_in_inventory(item){
    return(inventory.findIndex(function(i){return i===item;}) !== -1);
}

function del_from_inventory(item){
    del_from_inventory_with_id(inventory.findIndex(function(i){return i===item;}));
    update_frame();
}

function del_from_inventory_with_id(id){
    if(id > -1) {
        inventory.splice(id, 1);
    }
    update_frame();
}

function end_game(){
    document.getElementById("end_game").style.display = "inline";
    document.getElementById("result").innerHTML =  `Результат: ${score}`;
	end_gameed = true;
}

var used_attack = 0;
function cell_clicked(cell){
	if(end_gameed) return;
    console.log(`clicked cell ${cell}`);
    let nb = neighbors[cell];
    let correct_cell = false;
    for(let i = 0; i < nb.length; i++) {
        if(map[nb[i]] === "hero.png") {
            correct_cell = true;
        }
    }
    if(correct_cell){
        console.log('correct');
        switch(map[cell]){
            case "enemy1.png":{
                if(is_in_inventory("map.png") && is_in_inventory("compass.png")){
                    del_from_inventory("map.png");
                    del_from_inventory("compass.png");
                }else {
                    remove_hp(1);
                    score -= 5;
                }
                break;
            }
            case "enemy2.png":{
                if(is_in_inventory("enemy4.png")){
                    del_from_inventory("enemy4.png");
                    score += 15;
                }else{
                    remove_hp(1);
                }
                break;
            }
            case "enemy3.png": {
                if (is_in_inventory("sword1.png")) {
                    del_from_inventory("sword1.png");
                    score += 3;
                } else if (is_in_inventory("sword2.png")) {
                    del_from_inventory("sword2.png");
                    score += 3;
                }else if(bonus_attack > used_attack){
                    used_attack += 1;
                    score += 3;
                }else{
                    remove_hp(3);
                }
                break;
            }
            case "enemy4.png":{
                if(is_in_inventory("sword1.png")){
                    del_from_inventory("sword1.png");
                }else if(is_in_inventory("sword2.png")){
                    del_from_inventory("sword2.png");
                }else if(is_in_inventory("shotgun.png")){
                    del_from_inventory("shotgun.png");
                }else if(is_in_inventory("canon.png") && is_in_inventory("bullets.png")){
                    del_from_inventory("bullets.png");
                }else if(is_in_inventory("canon.png")){
                    del_from_inventory("canon.png");
                }else{
                    inventory = [];
                    add_to_inventory("enemy4.png");
                }
                score += 2;
                break;
            }
            case "enemy5.png":{
                if(bonus_attack > 2){
                    bonus_attack = 0;
                    score += 10;
                }else{
                    max_hp -= 1;
                    if(hp > max_hp) hp = max_hp;
                    remove_hp(0);
                }
                break;
            }
            case "enemy6.png":{
                if (is_in_inventory("sword1.png")) {
                    del_from_inventory("sword1.png");
                    score += 5;
                } else if (is_in_inventory("sword2.png")) {
                    del_from_inventory("sword2.png");
                    score += 5;
                }else{
                    remove_hp(2);
                }
                break;
            }
            case "boat.png":{
                if(is_in_inventory("canon.png") && is_in_inventory("bullets.png")){
                    del_from_inventory("bullets.png");
                    score += 3;
                }else if(is_in_inventory("shotgun.png")){
                    del_from_inventory("shotgun.png");
                    score += 3;
                }else if(is_in_inventory("rum.png")){
                    del_from_inventory("rum.png");
                    score += 3;
                }else{
                    end_game();
                }
                break;
            }
            case "bomb.png":{
                remove_hp(2);
                break;
            }
            case "bullets.png":{
                add_to_inventory("bullets.png");
                break;
            }
            case "canon.png":{
                add_to_inventory("canon.png");
                break;
            }
            case "chest_b.png":{
                if(is_in_inventory("key_b.png")){
                    del_from_inventory("key_b.png");
                    open_chest();
                }
                break;
            }
            case "chest_y.png":{
                if(is_in_inventory("key_y.png")){
                    del_from_inventory("key_y.png");
                    open_chest();
                }
                break;
            }
            case "compass.png":{
                add_to_inventory("compass.png");
                break;
            }
            case "key_b.png":{
                add_to_inventory("key_b.png");
                break;
            }
            case "key_y.png":{
                add_to_inventory("key_y.png");
                break;
            }
            case "map.png":{
                add_to_inventory("map.png");
                break;
            }
            case "mineral1.png":{
                add_to_inventory("mineral1.png");
                break;
            }
            case "mineral2.png":{
                add_to_inventory("mineral2.png");
                break;
            }
            case "mineral3.png":{
                add_to_inventory("mineral3.png");
                break;
            }
            case "mineral4.png":{
                add_to_inventory("mineral4.png");
                break;
            }
            case "mineral5.png":{
                add_to_inventory("mineral5.png");
                break;
            }
            case "mineral6.png":{
                add_to_inventory("mineral6.png");
                break;
            }
            case "mineral7.png":{
                add_to_inventory("mineral7.png");
                break;
            }
            case "mineral8.png":{
                add_to_inventory("mineral8.png");
                break;
            }
            case "money.png":{
                score += Math.floor(Math.random()*5)+5;
                break;
            }
            case "potion1.png":{
                regen_hp(3);
                break;
            }
            case "potion2.png":{
                remove_hp(2);
                break;
            }
            case "potion3.png":{
                bonus_attack += 1;
                break;
            }
            case "potion4.png":{
                remove_hp(4);
                break;
            }
            case "potion5.png":{
                max_hp += 1;
                break;
            }
            case "rum.png":{
                if(hp < 4)
                    regen_hp(2);
                else
                    add_to_inventory("rum.png");
                break;
            }
            case "shotgun.png":{
                add_to_inventory("shotgun.png");
                break;
            }
            case "sword1.png":{
                add_to_inventory("sword1.png");
                break;
            }
            case "sword2.png":{
                add_to_inventory("sword2.png");
                break;
            }
        }
        map[map.findIndex(function(i){return i===hero;})] = getRandomElement(items);
        map[cell] = hero;
        let all_minerals = new Set();
        for(let m = 0; m < inventory.length; m++) {
            if(inventory[m].slice(0, 7) === "mineral")
                all_minerals.add(inventory[m]);
        }
        if(all_minerals.size >= 3){
            for(let tmp = 0; tmp < 6; tmp++){
                del_from_inventory("mineral1.png");
                del_from_inventory("mineral2.png");
                del_from_inventory("mineral3.png");
                del_from_inventory("mineral4.png");
                del_from_inventory("mineral5.png");
                del_from_inventory("mineral6.png");
                del_from_inventory("mineral7.png");
                del_from_inventory("mineral8.png");
            }
            add_to_inventory(getRandomElement(["sword1.png", "sword2.png"]));
        }
    }else{
        console.log('incorrect');
    }
    update_bars();
    update_frame();
}

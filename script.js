let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterNameText");
const monsterHealthText = document.querySelector("#monsterHealthText");
const notEnoughGold = "You do not have enough gold";
const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"store\""
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight Slime", "Fight Fanged Beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters"
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold."
    },
    {
        name: "lose",
        "button text": ["REPLAY!", "REPLAY!", "REPLAY!"],
        "button functions": [restart, restart, restart],
        text: "You die! Try again."
    },
    {
        name: "win",
        "button text": ["REPLAY!", "REPLAY!", "REPLAY!"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon, you win the game!"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square"],
        "button functions": [pick2, pick8, goTown],
        text: "You found the easter egg! Pick 2 or 8 and win the game!"
    }
];
const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "clawHammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    },
    {
        name: "excalibur",
        power: 500
    },
    {
        name: "Staff of Ainz Ool Gown",
        power: 1000
    }
];
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

// Initialize buttons
goTown();
text.innerText="Welcome to Dragon Repeller. You must defeat the dragon that is preventing people from leaving the town. You are in the town square. Where do you want to go? Use the buttons above.";

function update(location){
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goTown(){
    console.log("Going to town");
    update(locations[0]);
}

function goStore(){
    console.log("Going to store");
    update(locations[1]);
}

function goCave(){
    console.log("Going to Cave");
    update(locations[2]);
}

function buyHealth(){
    console.log("buying Health");
    if (gold>=10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else{
        console.log("Not enough gold!");
        text.innerText=notEnoughGold;
    }        
}

function buyWeapon(){
    if (currentWeapon < weapons.length-1){
        if (gold>=30){
            console.log("buying Weapon");
            gold -= 30;
            currentWeapon += 1;
            let newWeapon = weapons[currentWeapon].name;
            goldText.innerText = gold;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        }
        else{
            console.log("Not enough gold to buy weapons");
            text.innerText = notEnoughGold;
        }
    }else{
        text.innerText = "You already have the most powerful weapon";
        button2.innerText = "Sell Weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon(){
    if (inventory.length>1){
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = " You sold a " + currentWeapon + " .";
        text.innerText += " In your inventory you have: " + inventory;
    }else{
        text.innerText = " Can't sell your only weapon";
    }    
}

function fightSlime(){
    console.log("Fighting Slime");
    fighting = 0;
    goFight();
}

function fightBeast(){
    console.log("Fighting Beast");
    fighting = 1;
    goFight();
}

function fightDragon(){
    console.log("Fighting Dragon");
    fighting = 2;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack(){
    let userHitValue = 0;
    let monsterHitValue = 0;
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    monsterHitValue = getMonsterAttackvalue(monsters[fighting].level);
    health -= monsterHitValue;
    if (isMonsterHit()){
        userHitValue = getPlayerAttackValue(currentWeapon);
        monsterHealth -= userHitValue;
    }
    else{
        text.innerText = "You swing and miss!";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth
    if (health <= 0){
        lose(monsterHitValue);
    }else if (monsterHealth <=0) {
        (fighting === 2) ? winGame(userHitValue):defeatMonster(userHitValue);
    }
    if ((Math.random() <= 0.1) && (inventory.length !== 1) && (currentWeapon != 4)){
        text.innerText = "Your weapon is broken. You lost " + inventory[currentWeapon] + ". ";
        inventory.pop(); currentWeapon--;
    }
}

function dodge(){
    text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
}

function lose(monsterHitValue){    
    update(locations[5]);
    text.innerText += " The monster hit you for " + monsterHitValue + " attack.";
}

function defeatMonster(userHitValue){
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;    
    update(locations[4]);
    text.innerText += " You hit the monster for " + userHitValue + " attack points.";
}

function restart(){
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    fighting;
    monsterHealth;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    update(locations[0]);
}

function winGame(userHitValue){
    update(locations[6]);
    text.innerText += " You hit the monster for " + userHitValue + " attack.";
}

function getMonsterAttackvalue(level){
    console.log("level & xp are: ", level, xp);
    let hit = (level * 2) - (Math.floor(Math.random() * xp));
    console.log("hit point is ",hit);
    text.innerText += " The monster hits you for " + hit + " hit points.";
    return hit;
}

function getPlayerAttackValue(current_weapon){
    let hitPoints = weapons[current_weapon].power + Math.floor(Math.random() * (xp/100)) + 1;
    if (current_weapon === 5){
        hitPoints += (Math.random()>0.8)? 8000 : 0;
    }
    console.log("Hit monster for ", hitPoints, " attack.");
    text.innerText += "You hit the monster for " + hitPoints + " attack.";
    return hitPoints;
}

function isMonsterHit(){
    let isAHit = (Math.random()>0.2) || (health<20);
    console.log(isAHit);
    return isAHit;
}

function easterEgg(){
    update(locations[7]);
}

function pick2(){
    pick(2);
}

function pick8(){
    pick(8);
}

function pick(guess){
    let numbers=[];
    while(numbers.length < 10){
        numbers.push(Math.floor(Math.random()*11));
    }
    text.innerText = "You picked " + guess +". Here are the random numbers:\n";
    for(let i = 0; i<10; i++){
        text.innerText += numbers[i] +"\n";
    }

    if (numbers.indexOf(guess) != -1){
        text.innerText += " Right you win 200 Gold and 100 xp!";
        gold += 200;
        xp += 100;
        goldText.innerText = gold;
        xpText.innerText = xp;
    }else{
        text.innerText += " Whoops! You aren't lucky at this moment. You lose 2 health";
        health -= 2;
        health = (health < 0)? 0:health;
        healthText.innerText = health;
        if (health <= 0){
            lose();
        }
    }
}
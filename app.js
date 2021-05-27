function getRandomValue(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            monsterHealth: 100,
            playerHealth: 100,
            lastSpecialAttack: 0,
            currentRound: 0,
            winner : null,
            battleLogs : []
        }
    },
    computed: {
        monsterBarStyles() {
            if(this.monsterHealth == 0){
                return {backgroundColor:"red"}
            }
            return {width: this.monsterHealth +'%'};
        },
        playerBarStyles() {
            if(this.playerHealth == 0){
                return {backgroundColor:"red"}
            }
            return {width: this.playerHealth +'%'};
        },
        mayUseSpecialAttack() {
            if (this.lastSpecialAttack == 0){
                return false;
            } else if(this.currentRound <= this.lastSpecialAttack+1) {
                return true;
            } else {
                return false;
            }
        }
    },
    watch: {
        monsterHealth(value) {
            if(value <= 0 && this.playerHealth <= 0){
                //a draw
                this.winner = "draw";
            } else if (value <= 0){
                // Player lost
                this.winner = 'player';
            }
        },
        playerHealth(value) {
            if(value <= 0 && this.monsterHealth <= 0){
                //a draw
                this.winner = "draw";
            } else if (value <= 0){
                // Player lost
                this.winner = 'monster';
            }
        }
    },
    methods: {
        startGame() {
            //reset all parameters
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.lastSpecialAttack = 0;
            this.battleLogs = [];
        },
        attackMonster() {
            const attackValue = getRandomValue(12, 5);
            if((this.monsterHealth - attackValue) <= 0){
                this.monsterHealth=0;
                this.logAttacks('player','monster', attackValue, 'attack');
            }
            else {
                this.monsterHealth -= attackValue;
                this.logAttacks('player','monster', attackValue, 'attack');
                this.currentRound++;
                //* Now the monster should attack back
                this.attackPlayer();
            }
        },
        attackPlayer() {
            const attackValue = getRandomValue(12, 5);
            if((this.playerHealth - attackValue) <= 0){
                this.playerHealth=0;
                this.logAttacks('monster','player', attackValue, 'attack');
            }
            else {
                this.playerHealth -= attackValue;
                this.logAttacks('monster','player', attackValue, 'attack');
            }
        },
        specialAttackMonster() {
                const attackValue = getRandomValue(10,25);
                if((this.monsterHealth - attackValue) <= 0){
                    this.monsterHealth=0;
                    this.logAttacks('player','monster', attackValue, 'special attack');
                }
                else {
                    this.currentRound++;
                    this.lastSpecialAttack = this.currentRound;
                    this.monsterHealth -= attackValue;
                    this.logAttacks('player','monster', attackValue, 'special attack');
                    console.log("Monster health remaining: " + this.monsterHealth)
                    //* Now the monster should attack back
                    this.attackPlayer();
                }
            },
            healPlayer() {
                this.currentRound++;
                const healValue = getRandomValue(8,20);
                if(this.playerHealth + healValue > 100){
                    this.playerHealth = 100;
                } else {
                    this.playerHealth += healValue;
                }
                this.logAttacks('player','monster', healValue, 'heal');
                this.attackPlayer();
            },
            surrender() {
                this.winner = 'monster';
            },
            logAttacks(attacker, victim, damage, attackType) {
                if(attackType == 'attack'){
                    this.battleLogs.unshift(attacker + ' hit '+ victim + ' for '+damage+ " health")
                }else if (attackType == 'special attack'){
                    this.battleLogs.unshift(attacker + ' critical hit '+ victim + ' for '+damage+ " health")
                } else if (attackType == 'heal'){
                    this.battleLogs.unshift(attacker + ' healed for '+damage+ " health")
                }
            }
    }
})


app.mount("#game");
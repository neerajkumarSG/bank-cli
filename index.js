const T = require('./common/logger');
const UC =  require('./blueprints/utilClasses');
const BC = require('./blueprints/bankClasses');
const readline = require("readline");
const rl = readline.createInterface({
    
    input: process.stdin,
    output: process.stdout
});
rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    // process.exit(0);
});


T.log('Welcome to Banking Console');
const bank = new BC.Bank();
T.log('Enter Command:');

function readCommand() {
    rl.question("$> ", function(line) {
        let cmd = new UC.Command(line, bank, readCommand);
        cmd.execute();
    });
}

readCommand();




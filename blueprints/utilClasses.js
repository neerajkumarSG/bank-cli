const T = require('../common/logger');
const constant =  require('../common/constants');

class Command {
    constructor(cmd, bank, onDone) {
        this.cmd = cmd == null ? '' : cmd;
        this.bank = bank;
        this.onDone =  onDone;
    }

    tokenize() {
        return this.cmd.split(/\s+/)
    }


    createUserCommand(user) {
        T.debug(`Command: Creating user ${user}`);
        if(this.bank.isUserLoggedIn()) {
            T.error(`Logged user ${this.bank.currentUser()} can't create new user. Please logout and retry`);
            return;
        }
        this.bank.createUser(user);
        T.log(`User ${user} created.`);   
    }

    loginCommand(user) {
        this.bank.login(user);
        T.log(`User ${user} logged in successfully`);
    }

    logoutCommand() {
        const usr = this.bank.logout();
        T.log(`User ${usr.name} logged out successfully`);
    }

    assignAccount(user, name, amt) {
        this.bank.assignAccount(user, name, parseFloat(amt));
         T.log(`User ${user} is assigned with Account ${name} and Balance ${amt}.`);
    }

    topupCommand(amt) {
        this.bank.topup(parseFloat(amt));
        T.log(`Topup to amout ${amt} is done`)
    }

    showBalance() {
        const bal = this.bank.balance();
        T.log(`Your balance is ${bal}`);
    }

    payCommand(user, amount) {
        this.bank.pay(user, parseFloat(amount) );
        T.log('Payment is done');
    }

    showHelp() {
        const help = `
Help
----------------------------------------------------
1. To Create user [Need to be admin user]
    create_user[cu] <user name> 
2. To Show User [Need to be admin user]
    show_user[su]
3. To assign account to user [Need to be admin user]
     assign_account[aa] <user name> <account name> <amount>
4. Login [Need to be login user]
     login <user name>
5. logout [Need to be login user]
      logout
6. To see the current login user
      whoami
7. To see login user balance [Need to be login user]
      show_bal[sb]
8. To Deposit to login suer [Need to be login user]
      topup <amount>
9. To transfer money to other users [Need to be login user]
      pay <to user name> <amount>
10. For help
      help
11. To Quite Console
      exit
--------------------------------------------------------
        `;
        T.log(help);
    }

    execute() {
        try {
            this.executeCommand();
        } catch (err) {
            this.handleError(err);
        }
        this.onDone();
    }

    executeCommand() {
        const tokens =  this.tokenize();
        T.debug('Command is ', tokens);
        
        switch (tokens[0].toLowerCase()) {
            case constant.CMD_CREATE_USER:
            case constant.CMD_CU:
                if(tokens.length != 2)  throw new Error(constant.ERR_CMD_INVALID);
                this.createUserCommand(tokens[1].toLowerCase());
                break;
            case constant.CMD_SHOW_USERS:
            case constant.CMD_SU:
                this.bank.showUsers();
                break;
            case constant.CMD_ASSIGN_ACCOUNT:
            case constant.CMD_AA:
                if(tokens.length != 4)  throw new Error(constant.ERR_CMD_INVALID);
                this.assignAccount(tokens[1].toLowerCase(), tokens[2], tokens[3]);
                break;
            case constant.CMD_LOGIN:
                if(tokens.length != 2)  throw new Error(constant.ERR_CMD_INVALID);
                this.loginCommand(tokens[1].toLowerCase());
                break;
            case constant.CMD_LOGOUT:
                this.logoutCommand();
                break;
            case constant.CMD_TOP_UP:
                if(tokens.length != 2)  throw new Error(constant.ERR_CMD_INVALID);
                this.topupCommand(tokens[1]);
                break;
            case constant.CMD_SHOW_BALANCE:
            case constant.CMD_SB:    
                if(tokens.length != 1)  throw new Error(constant.ERR_CMD_INVALID);
                this.showBalance();
                break;
            case constant.CMD_PAY:    
                if(tokens.length != 3)  throw new Error(constant.ERR_CMD_INVALID);
                this.payCommand(tokens[1].toLowerCase(), tokens[2]);
                break;                
            case constant.CMD_WHO:
                this.bank.whoami();
                break;
            case constant.CMD_EXIT:
                process.exit(0);
            case constant.CMD_HELP:
                this.showHelp();
                break;
            default:
                T.log('Invalid Command Please retry')
                this.showHelp();
                break;
        }

    }

    handleError(err) {
        T.trace(err);
        switch (err.message) {
            case constant.ERR_USER_EXIST:
                T.log(constant.MSG_USER_EXIST);
                break;
            case constant.ERR_USER_NOT_FOUND:
                T.log(constant.MSG_USER_NOT_FOUND);
                break;
            case constant.ERR_CODE_LESS_BAL:
                T.log(constant.MSG_LESS_BAL);
                break;
            case constant.ERR_CMD_INVALID:
                T.log(constant.MSG_CMD_INVALID);
                break;
            case constant.ERR_USR_LOGGED_IN:
                T.log(constant.MSG_USR_LOGGED_IN);
                break;         
             case constant.ERR_NEED_LOGIN:
                T.log(constant.MSS_NEED_LOGIN);
                break;   
             case constant.ERR_USER_NOT_ALLOWED:
                T.log(constant.MSG_USER_NOT_ALLOWED);
                break;                               
            default:
                T.error(err);
                break;
        }
    }
}

module.exports = {
    Command: Command
}
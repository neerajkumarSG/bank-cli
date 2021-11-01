const constant =  require('../common/constants');
const T = require('../common/logger')


class Account {
    constructor(name, balance) {
        T.debug(`Account: Creating account = ${name} and balance ${balance}`)
        this.name = name;
        this.name = name == null ? 'Saving Account' : name;
        this.balance =  balance == null ? 0.00 : balance;
    }

    deposit(amt) {
        this.balance =  this.balance + amt;
        T.debug(`Account: deposited ${amt}`, ' balance is ', this.balance);
    }

    withdraw(amt) {
        if(amt > this.balance) {
            const err = new Error(constant.ERR_CODE_LESS_BAL);
            T.error(err);
            throw err;
        }
    
        this.balance = this.balance - amt; 
        T.debug(`Account: withdrawn ${amt}`, ' balance is ', this.balance)
    }
}

class User {

    constructor(name, account) {
        T.debug(`User: Creating user = ${name} and account ${account}`)
        this.name = name;
        this.account =  account == null ? new Account() : account;
    }

    balance() {
        T.debug('User:', 'checking balance for the user', this.name)
        return this.account.balance;
    }

    deposit(amt) {
        T.debug('User:', 'Depositing amount ',  amt, ' for the user ', this.name)
        return this.amt.deposit(amt);
    }

    withdraw(amt) {
        T.debug('User:', 'Withdrawing amount ',  amt, ' for the user ', this.name)
        return this.amt.withdraw(amt);
    }

    setAccount(account) {
        T.debug('User:', 'setting Account ',  JSON.stringify(account), ' for the user ', this.name)
        this.account = account;
    }
}

class Bank {
    constructor() {
        this.users = new Map();
        this.loggedInUser =  null;
    }

    login(user) {
        this.checkLoginSession();
        this.checkUser(user);

        this.loggedInUser =  this.users.get(user);
        T.debug(`Bank: user ${this.loggedInUser} logged in`);
    }

    whoami() {
        T.log(`${this.loggedInUser == null ? 'I am admin': `Logged in user : ${this.loggedInUser.name}` }`);
    }

    currentUser() {
        return this.loggedInUser == null ? 'admin': this.loggedInUser.name;
    }

    isUserLoggedIn() {
        T.debug(`Bank: is user logged in : ${this.loggedInUser != null}`)
        return this.loggedInUser != null;
    }

    logout() {
         T.debug(`Bank: user ${this.loggedInUser} logged out`);
         const usr = this.loggedInUser;
        this.loggedInUser =  null;
        return usr;
    }

    topup(amt) {
        this.needLogin();
        this.loggedInUser.account.deposit(amt);
        T.debug(`Bank: user ${this.loggedInUser} is topped up to ${amt}`);
    }

    balance() {
        T.debug('Bank:', 'checking balance for the user')
        this.needLogin();
        return this.loggedInUser.balance();
    }

    pay(user, amt) {
        T.debug(`Bank: Paying  ${amt} from ${this.loggedInUser}  to ${user}`);
        this.needLogin();
        this.checkUser(user);

        const toUser = this.users.get(user);      
        this.loggedInUser.account.withdraw(amt);
        toUser.account.deposit(amt);
        T.debug(`Bank: Payment Done`);
    }

    createUser(name) {
        this.checkPermission();
        if(this.users.has(name)) {
            const err =  new Error(constant.ERR_USER_EXIST);
            T.trace(err);
            throw err;
        }

        this.users.set(name,  new User(name))
    }

    showUsers() {
        T.debug('Bank: Calling showUsers');
        this.checkPermission();
        this.users
        .forEach( u => T.log(`User ${u.name} Account ${u.account.name} Balance ${u.account.balance}`));
    }

    assignAccount(user, accountName, amt) {
        T.debug(`Banking: assign Account ${accountName} for ${user.name} with balance ${amt}`);
        this.checkPermission();
        this.checkUser(user);
        const account =  new Account(accountName, amt);
        this.users.get(user).setAccount(account);
    }


    checkUser(user) {
        if(user == null || !this.users.has(user)) {
            const err = new Error(constant.ERR_USER_NOT_FOUND);
            throw err;
        }
    }

    needLogin() {
        if(this.loggedInUser == null) throw new Error(constant.ERR_NEED_LOGIN)
    }

    checkLoginSession() {
        if(this.isUserLoggedIn()) {
            const err = new Error(constant.ERR_USR_LOGGED_IN);
            throw err;
        }
    }

    checkPermission() {
        if(this.isUserLoggedIn()) {
            const err = new Error(constant.ERR_USER_NOT_ALLOWED);
            throw err;
        }
    }
}


module.exports = {
    Account: Account,
    User: User,
    Bank: Bank
}

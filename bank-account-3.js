var accounts = [];

var account = {
    balance: 0,
    username: ''
};

// Create a new account
function createAccount(account) {
    accounts.push(account);

    return account;
}

// Retrieve an account
function getAccount(username) {
    var matchedAccount;

    for(var x = 0; x < accounts.length; x++) {
        if(accounts[x].username === username)
            matchedAccount = accounts[x];
        }
    }

    return matchedAccount;
}

// Deposit money into an account
function deposit(account, amount) {
    if(typeof amount === 'number') {
        account.balance += amount;
    } else {
        console.log('Deposit failed, amount is not a number!');
    }
}

// Withdraw money from account
function withdraw(account, amount) {
    if(typeof amount === 'number') {
        account.balance -= amount;
    } else {
        console.log('Withdraw failed, amount is not a number!');
    }
}

// Get account balance
function getBalance(account) {
    return account.balance;
}

function createBalanceGetter(account) {
    return function() {
        return account.balance;
    }
}

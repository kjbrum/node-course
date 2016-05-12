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

    accounts.forEach(function(a) {
        if(a.username === username) {
            matchedAccount = a;
        }
    });

    return matchedAccount;
}

// Deposit money into an account
function deposit(account, amount) {
    account.balance += amount;
}

// Withdraw money from account
function withdraw(account, amount) {
    account.balance -= amount;
}

// Get account balance
function getBalance(account) {
    return account.balance;
}

var kylesAccount = createAccount({
    username: 'Kyle',
    balance: 0
});

deposit(kylesAccount, 100);
console.log(getBalance(kylesAccount));
withdraw(kylesAccount, 25);
console.log(getBalance(kylesAccount));
console.log(getAccount('Kyle'));

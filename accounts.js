var crypto = require('crypto-js');
var storage = require('node-persist');
var Table = require('cli-table');

storage.initSync();

var Accounts = {
    get: function(accountName, masterPassword) {
        var accounts = this.getAll(masterPassword);
        var matchedAccount;

        // Loop through the accounts
        accounts.forEach(function(account) {
            if(account.name === accountName) {
                matchedAccount = account;
            }
        });

        return matchedAccount;
    },
    getAll: function(masterPassword) {
        var encryptedAccounts = storage.getItemSync('accounts');
        var accounts = [];

        // Check if accounts already exist
        if(typeof encryptedAccounts !== 'undefined') {
            var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
            accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
        }

        return accounts;
    },
    save: function(accounts, masterPassword) {
        var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
        storage.setItemSync('accounts', encryptedAccounts.toString());

        return accounts;
    },
    create: function(account, masterPassword) {
        var accounts = this.getAll(masterPassword);

        // Push the new account
        accounts.push(account);

        // Store the new accounts object
        this.save(accounts, masterPassword);

        return account;
    },
    list: function(masterPassword) {
        var accounts = this.getAll(masterPassword);

        // Initialize the accounts table
        var table = new Table({
            head: ['Account', 'Username/Email', 'Password']
        });

        // Loop through the accounts
        accounts.forEach(function(account) {
            // Add the account to the table
            table.push(
                [account.name, account.username, account.password]
            );
        });

        console.log(table.toString());
    }
};

module.exports = Accounts;

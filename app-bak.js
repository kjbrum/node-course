console.log('Starting PswdMngr...');

var crypto = require('crypto-js');
var storage = require('node-persist');
var Table = require('cli-table');

storage.initSync();

var argv = require('yargs')
    .command('create', 'Create a new account', function(yargs) {
        return yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Account name (ex. Twitter, Facebook, etc...)',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'Account username or email address',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'Account password',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master password',
                type: 'string'
            }
        });
    })
    .command('get', 'Retrieve an existing account', function(yargs) {
        return yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Account name to retrieve (ex. Twitter, Facebook, etc...)',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master password',
                type: 'string'
            }
        });
    })
    .command('list', 'List all of the accounts', function(yargs) {
        return yargs.options({
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master password',
                type: 'string'
            }
        });
    })
    .help('help')
    .alias('help', 'h')
    .argv;

var command = argv._[0];

function getAccounts(masterPassword) {
    var encryptedAccounts = storage.getItemSync('accounts');
    var accounts = [];

    // Check if accounts already exist
    if(typeof encryptedAccounts !== 'undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
        accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    return accounts;
}

function saveAccounts(accounts, masterPassword) {
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
    storage.setItemSync('accounts', encryptedAccounts.toString());

    return accounts;
}

function createAccount(account, masterPassword) {
    var accounts = getAccounts(masterPassword);

    // Push the new account
    accounts.push(account);

    // Store the new accounts object
    saveAccounts(accounts, masterPassword);

    return account;
}

function getAccount(accountName, masterPassword) {
    var accounts = getAccounts(masterPassword);
    var matchedAccount;

    // Loop through the accounts
    accounts.forEach(function(account) {
        if(account.name === accountName) {
            matchedAccount = account;
        }
    });

    return matchedAccount;
}

function listAccounts(masterPassword) {
    var accounts = getAccounts(masterPassword);

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

// Check what command is being ran
if(command === 'create') {
    try {
        var newAccount = createAccount({
            name: argv.name,
            username: argv.username,
            password: argv.password
        }, argv.masterPassword);

        console.log('Account created!');
        console.log(newAccount);
    } catch(e) {
        console.log('Error: Unable to create account.');
    }
} else if(command === 'get') {
    try {
        var foundAccount = getAccount(argv.name, argv.masterPassword);

        if(typeof foundAccount === 'undefined') {
            console.log('Error: Account not found.');
        } else {

            // Initialize the accounts table
            var table = new Table({
                head: ['Account', 'Username/Email', 'Password']
            });

            table.push(
                [foundAccount.name, foundAccount.username, foundAccount.password]
            );

            console.log(table.toString());
        }
    } catch(e) {
        console.log('Error: Unable to retrieve account.')
    }
} else if(command === 'list') {
    try {
        listAccounts(argv.masterPassword);
    } catch(e) {
        console.log('Error: Unable to list accounts.')
    }
}

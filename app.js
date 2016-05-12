console.log('Starting PswdMngr...');

var Accounts = require('./accounts.js');

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

// Check what command is being ran
if(command === 'create') {
    try {
        var newAccount = Accounts.create({
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
        var foundAccount = Accounts.get(argv.name, argv.masterPassword);

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
        Accounts.list(argv.masterPassword);
    } catch(e) {
        console.log(e);
        console.log('Error: Unable to list accounts.')
    }
}

var argv = require('yargs')
    .command('create', 'Create a new account.', function(yargs) {
        return yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Name of the account.',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'Username for the account.',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'Password for the account.',
                type: 'string'
            }
        })
    })
    .command('get', 'Retrieve an account.', function(yargs) {
        return yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Name of the account to retrieve.',
                type: 'string'
            }
        })
    })
    .help('help')
    .alias('help', 'h')
    .argv;

var command = argv._[0];

console.log(argv);

if(command === 'hello') {
    if(typeof argv.name !== 'undefined' && typeof argv.lastname !== 'undefined') {
        console.log('Hello ' + argv.name + ' ' + argv.lastname + '!');
    } else if(typeof argv.name !== 'undefined') {
        console.log('Hello ' + argv.name +'!');
    } else {
        console.log('Hello World!');
    }
}

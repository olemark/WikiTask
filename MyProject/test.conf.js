require('dotenv');
require('@babel/register')({
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime']
});

const { generate } = require('multiple-cucumber-html-reporter');
const { removeSync } = require('fs-extra');
const fs = require('fs');
const path = require('path');
const cucumberJson = require('wdio-cucumberjs-json-reporter').default;
// global.featurefile = "test.feature";
let featurefile = process.argv[3].toString().substring(0);
console.log("feature file -->"+featurefile);

let timestampStart = global.timestampStart;

// Store the directory path in a global, which allows us to access this path inside our tests
global.downloadDir = path.join(__dirname, 'tempDownload');

exports.config = {

    runner: 'local',
    restartBrowserBetweenTests: true,

    path: '/',

    services: ['chromedriver'],
    specs: [
        // './features/test.feature'
        "./features/"+featurefile
    ],
    // Patterns to exclude.
    exclude: [

    ],

    maxInstances: 10,

    capabilities: [

        {
            maxInstances: 5,
            browserName: 'chrome',
            'goog:chromeOptions': {

                // args: ['--no-sandbox','--headless', '--disable-gpu', '--disable-extensions', '--disable-dev-shm-usage','--window-size=1920,1080', '--start-maximized'],
                args: ['--no-sandbox', '--disable-gpu', '--disable-extensions', '--disable-dev-shm-usage','--window-size=1920,1080', '--start-maximized'],
                // this overrides the default chrome download directory with our temporary one
                prefs: {
                    'directory_upgrade': true,
                    'prompt_for_download': false,
                    'download.default_directory': downloadDir
                }
            }
        }],

    logLevel: 'info',
    logDir: './logs',

    bail: 0,

    baseUrl: '',

    waitforTimeout: 10000,

    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    framework: 'cucumber',
    reporters: [
        'cucumberjs-json',

        [ 'cucumberjs-json', {
            jsonFolder: '.tmp/new/',
            language: 'en',
        },
        ],
    ],
    // reporters: [FailedSuiteReporter],


    cucumberOpts: {
        require: ['./stepDefinitions/*.js'],        // <string[]> (file/dir) require files before executing features
        backtrace: false,   // <boolean> show full backtrace for errors
        requireModule: ['@babel/register'],  // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        dryRun: false,      // <boolean> invoke formatters without executing steps
        failFast: false,    // <boolean> abort the run on first failure
        format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        colors: true,       // <boolean> disable colors in formatter output
        snippets: true,     // <boolean> hide step definition snippets for pending steps
        source: true,       // <boolean> hide source uris
        profile: [],        // <string[]> (name) specify the profile to use
        strict: false,      // <boolean> fail if there are any undefined or pending steps
        tagExpression: '',  // <string> (expression) only execute the features or scenarios with tags matching the expression
        timeout: 100000,     // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
    },

    onPrepare: function (config, capabilities) {
        // make sure download directory exists
        if (!fs.existsSync(downloadDir)){
            // if it doesn't exist, create it
            fs.mkdirSync(downloadDir);
        }

        // featurefile = process.argv.slice(process.argv.length-1);
        featurefile = process.argv[3].toString().substring(0);
        console.log("feature file -->"+featurefile);
        removeSync('allure-results/');
        removeSync('allure-report/');

        timestampStart = new Date(Date.now());
        console.log("timestampStart="+timestampStart);
        global.timestampStart = timestampStart;
    },

    beforeSession: function (config, capabilities, specs) {
    },

    before: function (capabilities, specs) {
        require('@babel/register');
        console.log("environment="+process.argv[4].toString().substring(2));
        let env = process.argv[4].toString().substring(2);
        if(env === 'undefined')
        {
            env='qa'
        }
        global.env = env;
        const configData = fs.readFileSync('./configs/config_'+global.env+'.json');
        const jsonConfigObj  =  JSON.parse(configData);
        global.jsonConfigObj = jsonConfigObj;
        global.configData = jsonConfigObj;
        global.env = env;
        if(global.env === "dev"){
            global.urlLength = 80;
        }
        else if(global.env === "qa" || global.env === "qadc" ){
            global.urlLength = 78;
        }
        console.log("=======Environment======="+global.env);
        console.log("=======URLLength======="+global.urlLength);

    },

    beforeScenario: function (uri, feature, scenario, sourceLocation) {

    },

    afterScenario: function (uri, feature, scenario, result, sourceLocation) {
        console.log("I am after scenario!!!!!!!!!!!!!!!!!!!!!!!");
        if(result.status.toString() === "failed")
        {
            cucumberJson.attach(browser.takeScreenshot(), 'image/png');
        }
        // browser.reloadSession();
    },

    afterCommand: function (commandName, args, result, error) {
    },

    after: function (result, capabilities, specs) {

    },

    afterSession: function (config, capabilities, specs) {
        console.log("I am after session!!!!!!!!!!!!!!!!!!!!!!!");
        // browser.reloadSession();
    },

    rmdir(dir) {
        const list = fs.readdirSync(dir);
        for(let i = 0; i < list.length; i++) {
            let filename = path.join(dir, list[i]);
            fs.unlinkSync(filename);
            console.log("===========================FILE:", filename, "DELETED ======================================");
        }
        fs.rmdirSync(dir);
        console.log("===========================DIRECTORY:", dir, "DELETED ==========================================");
    },

    onComplete: function(config, capabilities, results) {
        // remove the download directory, deleting any files inside of it
        this.rmdir(downloadDir);

        global.timestampStart = timestampStart;
        console.log("timestampStart="+global.timestampStart);
        const timestampEnd = new Date(Date.now());
        console.log("timestampEnd="+timestampEnd);
        global.timestampEnd = timestampEnd;
        generate({

            jsonDir: '.tmp/json/',
            reportPath: '.tmp/report/',

            customData: {
                title: 'Run info',
                data: [
                    {label: 'Project', value: 'my-project'},
                    {label: 'Release', value: 'N/A'},
                    {label: 'Cycle', value: 'N/A'},
                    {label: 'Execution Start Time', value: global.timestampStart},
                    {label: 'Execution End Time', value: global.timestampEnd}
                ],
            },

        });
    },

}

# Webdriver IO : Next-gen WebDriver test framework for Node.js

- Ref: https://webdriver.io/
- The wdio runner currently supports Mocha and Jasmine and Cucumber
- add https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete to vscode for cucucumer test code formatting

# Commands to run
- to run a specific tag:
    -  yarn wdio wdio.conf.js --qa --cucumberOpts.tagExpression=‘@tagname’
- to run the entire wdio.conf.js
    - yarn e2e
- to run test.conf.js for developing tests
    - yarn feature
- to run one common config file by passing the feature file to be targeted
    ./node_modules/.bin/wdio test.conf.js test.feature
  


# Commands to install any npm node module

- yarn install [modulename] --save -dev
- For example: yarn install frisby --save -dev

# Useful Commands

- kill -9 $(lsof -t -i:4444)
  - if you see ECONNREFUSED when running tests you need to kill port 4444.
- allure generate allure-results && allure open
- allure generate allure-results --clean -o allure-report || true

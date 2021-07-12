
const yaml = require("js-yaml");
const fs = require("fs");
const moment = require("moment");
const child_process = require("child_process");
const AWS = require("aws-sdk");
const path = require("path");
const zlib = require("zlib");
const papa = require('papaparse');
const assert = require('assert');
const nodemailer = require('nodemailer');

require('dotenv').config()
require('dotenv');
require('@babel/register')({
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime']
});



class commonMethods {
    get randomPhoneNumber()                         {return $('(//*[@id=\'content\']//h4[contains(text(),\'International\')]/..//h4//a)[1]');}

    generateString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    generateCustomerEmail() {
        const t = Math.floor(Math.random() * 9999) + 100;
        const str = "enteryouremail" + t + "@gmail.com";
        global.randomEmail = str;
        return str;
    }

    generateDOB(market) {
        var date = Math.floor(Math.random() * (28 - 1)) + 1;
        var month = Math.floor(Math.random() * (12 - 1)) + 1;
        var year = Math.floor(Math.random() * (2000 - 1960)) + 1960;

        if (market == 'de' || market=='nl'|| market=='gb') {
            const dob = date + '/' + month + '/' + year;
            return dob;
        }
        if (market == 'us') {
            const dob = month + '/' + date + '/' + year;
            return dob;
        }
        if (market === 'no') {
            if(month<10){
                month= "0"+month;
            }
            if(date<10){
                date= "0"+date;
            }
            var dob = date + '.' + month + '.' + year;
            return dob;
        }
        if (market == 'se') {
            const dob = year + '/' + month + '/' + date;
            return dob;
        }
    }


    clickElement(eleSelector) {
        browser.pause(1000);
        eleSelector.waitForExist(20000);
        eleSelector.click();
    }

    fetchText(eleSelector) {
        browser.pause(1000);
        eleSelector.waitForEnabled(90000);
        return eleSelector.getText();
    }

    fetchValue(eleSelector) {
        browser.pause(1000);
        eleSelector.waitForEnabled(30000);
        return eleSelector.getValue();
    }

    checkIfElementExist(eleSelector,time) {
        if(time === undefined){
            time = 5000;
        }
        browser.pause(time);
        //console.log("element isexisting========="+eleSelector.isExisting())
        return eleSelector.isDisplayed();
    }


    checkIfElementEnabled(eleSelector) {
        browser.pause(500);
        return eleSelector.waitForEnabled(70000);
    }

    waitForElementExisting(eleSelector, time) {
        browser.pause(500);
        return eleSelector.waitForExist(time);
    }


    clickElementWithJavaScript(selector) {
        var runInBrowser = function (argument) {
            argument.click();
        };
        var elementToClickOn = browser.$(selector)
        browser.execute(runInBrowser, elementToClickOn);
    }

    scrollElementToEndWithJavascript(elementToScroll) {
        var scrollInBrowser = function (elem, scrollAmount){
            elem.scrollTop += scrollAmount;
        }
        browser.execute(scrollInBrowser, elementToScroll, 500000);
    }

    getYmlData(key, filename) {
        const config = yaml.safeLoad(fs.readFileSync(`./testdata/${filename}`, 'utf8'));
        const indentedJson = JSON.stringify(config, null, 4);
        // console.log(`Printing Payment data from yml file: ${indentedJson}`);
        let obj = JSON.parse(indentedJson);
        // console.log(`Printing ${key} value from yml file: ${obj[key]}`);
        return obj[key];
    }

    // Filestream to unlink (delete) the file using NodeJS.
    deleteFile(fileName) {
        fs.unlink(`./testdata/${fileName}`, function (err) {
            //Do whatever else you need to do here
            console.log("===========================FILE:", fileName, "DELETED ======================================");
        });
    }

    // Filestream to copy the file using NodeJS.
    copyFile(fileName) {
        fs.copyFile(`/Users/omarkov/Downloads/${fileName}`, `./testdata/${fileName}`, (err) => {
            if (err) throw err;

            console.log(`${fileName} FILE HAS BEEN COPIED TO DESTINATION: ./testdata/`);
        });
    }

    // Filestream to move the file using NodeJS.
    moveFile(fileName) {
        fs.rename(`/Users/omarkov/Downloads/${fileName}`, `./testdata/${fileName}`, (err) => {
            if (err) throw err;

            console.log(`${fileName} FILE HAS BEEN MOVED TO DESTINATION: ./testdata/`);
        });
    }

    parseCsvData(fileName, rowNumber) {
        let data;
        let dataRecord;
        const file = fs.createReadStream(`./tempDownload/${fileName}`);
        const count = 0; // cache the running count
        papa.parse(file, {
            // header: true,
            download: true,
            dynamicTyping: true,
            complete: function (results) {
                // console.log("===========================All results======================================");
                // console.log(results);
                // data = results.data;
                // console.log("===========================Data======================================");
                // console.log(data);
                // console.log("==========================First record=======================================");
                // dataRecord = results.data[1];     //getting the first record
                // console.log(dataRecord);

                if ((results.data.length - 1) !== parseInt(rowNumber)) {
                    return Promise.reject(
                        new Error(`Number of rows doesn't match ${results.data.length}`)
                    );
                }
                // console.log(results.data[1][1]);
                // if (results.data[1][1] !== "US-0000147230-QA") {
                //     return Promise.reject(
                //         new Error(`Failed to find expected text ${dresults.data[1][1]}`)
                //     );
                // }
                let y;
                for (y = 0; y <= rowNumber - 1; y++) {
                    dataRecord = results.data[y]; //getting the first record
                    console.log("==========================Record #", y + 1, " =======================================");
                    console.log(dataRecord);
                    let i;
                    for (i in dataRecord) {
                        if (dataRecord.hasOwnProperty(i)) {
                            // console.log('Key is: ' + i + ' ; Value is: ' + dataRecord[i]);
                        }
                    }
                    // console.log(dataRecord['Order number']);
                    // assert(!dataRecord['Order number'].isEmpty(), "\n!!!!!!!!!Field is Empty!!!!!!!!");
                }
                console.log('============================ PARSING COMPLETE: READ', y, 'RECORDS ================================');
            }
        });
    }


    parseAndSaveHeaderFromCsvFile(fileName) {
        let dataRecord;
        const file = fs.createReadStream(`./tempDownload/${fileName}`);
        const count = 0; // cache the running count
        console.log('============================ PARSING STARTED ================================');
        papa.parse(file, {
            // header: true,
            download: true,
            dynamicTyping: true,
            complete: function (results) {
                console.log("==========================Table header text=======================================");
                dataRecord = results.data[0];     //getting the table header
                console.log(dataRecord);
                console.log("==================================================================================");
                console.log('============================ PARSING ENDED ================================');
                global.actualColumnName1 = results.data[0][0];
                global.actualColumnName2 = results.data[0][1];
                global.actualColumnName3 = results.data[0][2];
                global.actualColumnName4 = results.data[0][3];
                global.actualColumnName5 = results.data[0][4];
                global.actualColumnName6 = results.data[0][5];
                global.actualColumnName7 = results.data[0][6];
                global.actualColumnName8 = results.data[0][7];
                global.actualColumnName9 = results.data[0][8];
            }
        });
    }


    waitElementUntilDisplayed(element, timeout) {
        browser.waitUntil(function () {
                return element.isDisplayed()
            }, timeout, `Element: ${element} is not displayed on the page!`
        );
    }

    retryUntilCanvasAvailable(canvasElement){
        let retryCanvasAvailableCount=0,canvasNotAvailableCheck=false;
        const canvasExistEle = $('//*[@id=\'ctid_pdfScrollingDiv\']//canvas')

        do{
            try{
                console.log('Checking canvas height for '+retryCanvasAvailableCount+' time');
                let isCanvasExist = canvasExistEle.isExisting()
                console.log('Checking canvas exists '+isCanvasExist);
                let canvasHeight = ($$('//*[@id=\'ctid_pdfScrollingDiv\']//canvas')).length;
                console.log('canvasHeight '+canvasHeight)
                const scrollele = $('//*[@id=\'ctid_pdfScrollingDiv\']//canvas['+canvasHeight+']');
                scrollele.scrollIntoView();
                canvasNotAvailableCheck=false;
            }catch(err){
                console.log("Element not available with canvas, so waiting and checking")
                canvasNotAvailableCheck=true;
                retryCanvasAvailableCount++;
            }
            browser.pause(3000);
        }while(canvasNotAvailableCheck&&retryCanvasAvailableCount<4)
    }

    retryElementClick(elementToBeRetried){
        let retryElementClickCount=0;
        do{
            try{
                elementToBeRetried.click();
                console.log('Clicked element for '+retryElementClickCount+' time');
            }catch(err){
                console.log("Element has been clicked, no retry required")
            }
            browser.pause(3000)
            retryElementClickCount++;
        }while(elementToBeRetried.isDisplayed()&&retryElementClickCount<5)
    }

    isEmpty(eleSelector) {
        var existingString = eleSelector.getValue();
        if (existingString != null && existingString.length != 0) {
            return false
        }
        return true
    }

    backspaceSeleniumWDAction(element){
        element.click();
        browser.pause(2000);
        let x = element.getValue();
        for (let i = 0; i < x.length; i++) {
            element.setValue("\uE003");
            browser.pause(10);
        };
    }

    takeScreenshot(path) {
        child_process.execSync(`mkdir -p ./${path}`);
        browser.pause(1000);
        const timestamp = moment().format('MMDDYYYY-HHmmss.SSS');
        browser.saveScreenshot(`./${path}` + timestamp + `.png`);
    }


    enterText(element,value){
        browser.pause(1000);
        element.waitForEnabled(1800000);
        element.setValue(value)
    }



    sendTextData(element, number) {
        let data = Array.from(number);
        for(let i=0; i<data.length; i++){
            this.checkIfElementExist(element,true);
            element.addValue(data[i]);
            browser.pause(2000);
        }
    }

    removeAllExceptNumbersAndPeriodInString(value) {
        // return value.replace(/\D/g, '');
        return value.replace(/[^0-9.]/g, '');
    }

    removeAllExceptNumbersPeriodComaInString(value) {
        return value.replace(/[^0-9.,]/g, '');
    }

    sendMail(){
        return new Promise((resolve,reject)=>{
            // let transporter = nodemailer.createTransport({
            //     //settings
            // });
            // var mailOptions = {
            //     //mailoptions
            // };
            // let resp=false;

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log("error is "+error);
                    resolve(false); // or use rejcet(false) but then you will have to handle errors
                }
                else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                }
            });
        })
    }

    generateRandomPhoneNumber(market){
        browser.url("https://fakenumber.org/"+market);
        global.randomPhoneNumber = this.fetchText(this.randomPhoneNumber);
        console.log("=========New randomPhoneNumber for "+market+"========="+global.randomPhoneNumber);

    }

    generateRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


}

export default new commonMethods();

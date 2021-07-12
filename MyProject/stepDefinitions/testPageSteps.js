import testpage_po from "../pageObjects/TestPage_po";
import nikepage_po from "../pageObjects/TestNikePage_po";
import commonMethods from "../utils/commonMethods";
const assert = require('assert');
var {When} = require('cucumber');

var {Then} = require('cucumber');

var {Given} = require('cucumber');
Given(/^User should be able to navigate to "([^"]*)" page$/, function (url) {
    switch (url) {
        case "wiki_metis":
            browser.navigateTo('https://en.wikipedia.org/wiki/Metis_(mythology)');
            break;
        case "":
            break;
    }
});
Then(/^User verify headings listed in the Content box$/, function () {
    testpage_po.verifyHeadings();
});
Then(/^User verify headings have functioning hyperlinks$/, function () {
    testpage_po.verifyHeadingsHyperlink();
});
Then(/^User verify Nike personified concept popup contains the text$/, function () {
    testpage_po.navigateToPopupText();
    let nikePopupExpectedText = "In ancient Greek civilization, Nike was a goddess who personified victory. Her Roman equivalent was Victoria.";
    let nikePopupActualText = testpage_po.nikePopup.getText();
    console.log(`nikePopupExpectedText: ` + nikePopupExpectedText);
    console.log(`nikePopupActualText: ` + nikePopupActualText);
    assert.strictEqual(nikePopupActualText,nikePopupExpectedText, "Nike personified concept popup text does not match");
});
When(/^User clicks on "([^"]*)"$/, function (link) {
    switch (link) {
        case "Nike":
            commonMethods.clickElement(testpage_po.nike);
            browser.pause(500);
            break;
        case "":
            break;
    }
});
Then(/^User verify a family tree is displayed on the page$/, function () {
    nikepage_po.familyTreeHeading.scrollIntoView();
    assert(nikepage_po.familyTreeHeading.isDisplayed(), "\nThe Family Tree heading is not displayed on the Nike page");
    assert(nikepage_po.familyTreeTable.isDisplayed(), "\nThe Family Tree table is not displayed on the Nike page");
});
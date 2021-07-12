import commonMethods from "../utils/commonMethods";

const assert = require('assert');

class Wiki_po {

    // Locators for the Test Page

    get nike()                              {return $('//td[@class=\'sidebar-content\']/div[@class=\'div-col\']/ul//li/a[contains(@href,\'Nike\')]');}
    get nikePopup()                         {return $('//div[contains(@class,\'mwe-popups\')]');}


    verifyHeadings(){
        let i;
        let anchorsArray = [];
        for (i = 1; i < 9; i++) {
            let anchorActual = $(`(//div[@id='toc']/ul/li/a/span[2])[${i}]`);
            if (anchorActual.isExisting()) {
                let anchorActualText = anchorActual.getText();
                anchorsArray.push(anchorActualText);
            }
        }
        let y;
        let headingsArray = [];
        for (y = 1; y < 9; y++) {
            let headingActual = $(`(//div[@class='mw-parser-output']//h2/span[1])[${y}]`);
            if (!headingActual.isExisting()){
                break
            }
            headingsArray.push(headingActual.getText());
        }

        console.log(`anchorsArray: ` + anchorsArray);
        console.log(`headingsArray: ` + headingsArray);

        assert.strictEqual(anchorsArray.toString(),headingsArray.toString(), "Headings do not match Contents box on the Page");

    }

    verifyHeadingsHyperlink(){
        let i;
        for (i = 1; i < 9; i++) {
            let anchorActual = $(`(//div[@id='toc']/ul/li/a/span[2])[${i}]`);
            // let anchorActualLink = $(`(//div[@id='toc']/ul/li/a)[${i}]`);
            let anchorActualText = anchorActual.getText();
            commonMethods.clickElement(anchorActual);
            let headingActual = $(`//div[@class='mw-parser-output']//h2/span[text()='${anchorActualText}']`);

            assert(headingActual.isDisplayed(), "\nThe link does not work for element " + anchorActualText);
            browser.pause(3000);
            var scrollele = $('(//div[@id=\'toc\']/ul/li/a/span[2])[1]');
            scrollele.scrollIntoView();
            browser.pause(3000);
        }
    }

    navigateToPopupText(){
        this.nike.scrollIntoView();
        this.nike.moveTo();
        browser.pause(1000);
    }

}

export default new Wiki_po();
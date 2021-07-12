import commonMethods from "../utils/commonMethods";

const assert = require('assert');

class Nike_po {

    // Locators for the Nike Page

    get familyTreeHeading()                  {return $('//h2/span[@id=\'Family_tree\']');}
    get familyTreeTable()                    {return $('//table[@class=\'toccolours\']');}



}

export default new Nike_po();
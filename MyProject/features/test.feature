Feature: WIKI page scenarios

  @wiki
  Scenario: User navigates to wiki page and validate the content
    Given User should be able to navigate to "wiki_metis" page
    Then User verify headings listed in the Content box
    Then User verify headings have functioning hyperlinks
    Then User verify Nike personified concept popup contains the text
    When User clicks on "Nike"
    Then User verify a family tree is displayed on the page
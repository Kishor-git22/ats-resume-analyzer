Feature: Result Page
  As a user
  I want to upload a resume text
  So that I can see the analysis results

  Scenario: Uploading a resume and viewing results
    Given I navigate to the home page
    When I mock the API to return a successful review
    And I click the "Paste text" button
    And I enter "This is a very long test resume content. I am writing this to make sure that the character count exceeds the minimum required length of 100 characters so that the review button becomes enabled and I can click it successfully." into the text area
    And I click "Review Resume"
    Then I should see the result view with a score

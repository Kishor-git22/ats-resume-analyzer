Feature: History Page
  As a user with cookies
  I want to see my past resumes in the history tab
  So that I can review past feedback

  Scenario: Navigating to the History tab
    Given I navigate to the home page
    When I click on the "My History" tab
    Then I should see the history view displayed

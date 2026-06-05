Feature: Home Page
  As a visitor
  I want to see the home page with global statistics and upload zone
  So that I can analyze my resume

  Scenario: Viewing the home page
    Given I navigate to the home page
    Then I should see the "Resume reviewer" heading
    And I should see the global stats banner
    And I should see the "Analyze Resume" tab is active

Feature: Review API Endpoint
  In order to get my resume analyzed
  As a user
  I want to submit my resume via the /api/review endpoint

  @reviewAPI
  Scenario: Deny request without resume text
    When I make a POST request to the review endpoint "/api/review" with an empty body
    Then the review response status code should be 400
    And the review response body should contain an error about missing text

  @reviewAPI
  Scenario: Successfully review a resume
    When I make a POST request to the review endpoint "/api/review" with a valid resume text
    Then the review response status code should be 200
    And the review response body should contain the overall score
    And the database should have saved the review record

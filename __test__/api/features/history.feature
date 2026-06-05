Feature: History API Endpoint
  In order to see my past reviews
  As a logged-in user
  I want to fetch my history via the /api/history endpoint

  @historyAPI
  Scenario: Deny access when not authenticated
    When I make a GET request to the history endpoint "/api/history" without a cookie
    Then the history response status code should be 401

  @historyAPI
  Scenario: Successfully fetching history for an authenticated user
    Given the user "user-123" has past reviews in the database
    When I make a GET request to the history endpoint "/api/history" with the cookie for "user-123"
    Then the history response status code should be 200
    And the history response body should contain the past reviews

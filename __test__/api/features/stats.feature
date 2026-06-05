Feature: Stats API Endpoint
  In order to display global platform statistics
  As a visitor
  I want to fetch the global stats via the /api/stats endpoint

  @statsAPI
  Scenario: Successfully fetching stats when the database is empty
    Given the stats collection is empty
    When I make a GET request to the stats endpoint "/api/stats"
    Then the stats response status code should be 200
    And the response body should have totalReviews 0

  @statsAPI
  Scenario: Successfully fetching stats when the database is populated
    Given the stats collection has some existing data
    When I make a GET request to the stats endpoint "/api/stats"
    Then the stats response status code should be 200
    And the response body should reflect the existing data

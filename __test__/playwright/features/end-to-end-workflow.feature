Feature: End-to-End Application Workflow
  As a user
  I want to upload my resume, see a loading state, and view the final results
  So that I know the application handles my full journey correctly

  @e2eWorkflow
  Scenario: Uploading a resume to see all 3 states
    # 0 State
    Given I navigate to the home page
    Then I should see the initial upload zone and global stats

    # 1st State (Loading)
    When I submit a valid resume
    Then I should see the loading state

    # After Result State
    And the API responds with a successful review
    Then I should see the overall score and category scores
    And I should see the summary, strengths, weaknesses, and rewrites

Feature: The register page
    Background:
        Given I am on the '/register' page

    Scenario Outline: The username field should reject invalid input
        When I enter username: '<Username>'
        And I click the register button
        Then the username error '<Validation Message>' should display
        Examples:
            | Username | Validation Message                                                         |
            | Inv@l!d  | Usernames must only use the characters a-z, 0-9, _ and -                   |
            | ab       | Username must be at least 3 characters and no more than 15 characters long |
            |          | You must specify a username                                                |

    Scenario Outline: The email address field should reject invalid input
        When I enter email address: '<Email>'
        And I click the register button
        Then the email address error '<Validation Message>' should display
        Examples:
            | Email                         | Validation Message                 |
            | plainaddress                  | Please enter a valid email address |
            | #@%^%#$@#$@#.com              | Please enter a valid email address |
            | @example.com                  | Please enter a valid email address |
            | Joe Smith <email@example.com> | Please enter a valid email address |
            | email.example.com             | Please enter a valid email address |
            | email@example@example.com     | Please enter a valid email address |
            | .email@example.com            | Please enter a valid email address |
            | email.@example.com            | Please enter a valid email address |
            | email..email@example.com      | Please enter a valid email address |
            |                               | You must specify an email address  |

const { When, Then } = require('cucumber');
const { By } = require('selenium-webdriver');
const { assert } = require('chai');

When('I enter username: {string}', async function(username) {
    await this.driver.findElement(By.id('username')).sendKeys(username);
});

When('I enter email address: {string}', async function(username) {
    await this.driver.findElement(By.id('email')).sendKeys(username);
});

When('I click the register button', async function() {
    await this.driver.findElement(By.css('form button')).click();
});

Then('the username error {string} should display', async function(expectedMessage) {
    let error = await this.driver.findElement(By.id('username-error')).getText();

    assert.equal(error, expectedMessage);
});

Then('the email address error {string} should display', async function(expectedMessage) {
    let error = await this.driver.findElement(By.id('email-error')).getText();

    assert.equal(error, expectedMessage);
});

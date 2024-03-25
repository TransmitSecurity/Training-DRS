import { Builder, By, Browser, until } from "selenium-webdriver";

const email = "erwan.dano@transmitsecurity.com";
const password = "mlkjmlkj";

async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    // Navigate to URL
    await driver.get("http://localhost:4000");

    // Find the element with ID 'login-button' and click it
    await driver.findElement(By.id("email")).click();

    // Add more actions here
  } finally {
    // Close the browser after finishing
    await driver.quit();
  }
}

async function loginAction() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    // Navigate to the login page
    await driver.get("http://localhost:4000/login");

    // Find the email input by ID and enter the email address
    const emailInput = await driver.wait(
      until.elementLocated(By.id("email")),
      5000
    );

    await emailInput.sendKeys(email);

    // Find the password input by ID and enter the password
    await driver.findElement(By.id("password")).sendKeys(password);

    // Find the submit button by ID and click it
    await driver.findElement(By.id("passwordLoginSubmit")).click();
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  } finally {
    // Uncomment the next line if you want the browser to close automatically
    // await driver.quit();
  }
}

loginAction();

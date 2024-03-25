import { Builder, By, Browser, until } from "selenium-webdriver";

const email = "erwan.dano@transmitsecurity.com";
const password = "mlkjmlkj";

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

    // Wait
    const transferButton = await driver.wait(
      until.elementLocated(By.id("bankTransfer")),
      5000
    );
    transferButton.click();

    await driver.sleep(1000); // Pause for 1000 milliseconds (1 second)
    await driver.findElement(By.css("#accountSelection > input")).click();

    await driver.sleep(1200);
    await driver.findElement(By.css("#\\34 0021194485 .uppercase")).click();

    await driver.sleep(800);
    await driver.findElement(By.css("#selectBeneficiary > input")).click();

    await driver.sleep(1200);
    await driver.findElement(By.id("Aeklys")).click();

    await driver.sleep(900);
    await driver.findElement(By.id("transferAmount")).click();

    await driver.sleep(500);
    await driver.findElement(By.id("transferAmount")).sendKeys("400");

    await driver.sleep(1200);
    await driver.findElement(By.id("validateForm")).click();

    await driver.sleep(2000);
    await driver.findElement(By.id("validateTransfer")).click();
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  } finally {
    // Uncomment the next line if you want the browser to close automatically
    // await driver.quit();
  }
}

loginAction();

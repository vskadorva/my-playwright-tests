// @ts-check
const { test, expect } = require('@playwright/test');
let apiContext;
test.describe('my-weather-app', () => {
  test.beforeAll(async ({playwright}) => {
    apiContext = await playwright.request.newContext({
      // All requests we send go to this API endpoint.
      baseURL: 'https://pure-sea-84829.herokuapp.com'
    });
  })
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-weather-app');
  });

  test('application can be open', async ({ page }) => {
    await expect(page).toHaveURL('https://vskadorva.github.io/my-weather-app/');
  });

  test('title', async ({ page }) => {
    await expect(page).toHaveTitle('City Weather');
  });

  test('input field', async ({ page }) => {
    await page.type('#city-input', 'Montreal');
    await expect(page.locator('input#city-input')).toHaveValue('Montreal');
  });

  test('selected value', async ({page}) => {
    await page.type('#city-input', 'Montreal');
    await  page.locator('#city-select').selectOption({ index: 1 });
    await expect(page.locator('h2')).toHaveText('Montreal');
  });

  test('should be able to get data from api', async ({ request }) => {
    const response = await apiContext.get("/search?q=Montreal");
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    expect(responseBody[0]).toHaveProperty("name", "Montreal");
});
});
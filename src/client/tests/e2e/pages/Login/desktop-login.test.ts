import { test, expect } from '@tests/e2e/setup';
import { login, getErrorMessage } from '@tests/e2e/fixtures/login';
import dotenv from 'dotenv';
import { Routes } from '@interfaces';
import { LoginSelectors } from './selectors';

dotenv.config();
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = process.env;

test('should disable login button when fields are empty', async ({ page }) => {
  await test.step('Navigate to login page', async () => {
    await page.goto(Routes.Login);
  });

  await test.step('Clear input fields', async () => {
    await page.getByTestId(LoginSelectors.EmailInput).fill('');
    await page.getByTestId(LoginSelectors.PasswordInput).fill('');
  });

  await test.step('Verify submit button is disabled', async () => {
    const submitButton = page.getByTestId(LoginSelectors.SubmitButton);
    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });
});

test('should enable login button when fields are filled', async ({ page }) => {
  await test.step('Navigate to login page', async () => {
    await page.goto(Routes.Login);
  });

  await test.step('Fill input fields', async () => {
    await page.getByTestId(LoginSelectors.EmailInput).fill('test@example.com');
    await page.getByTestId(LoginSelectors.PasswordInput).fill('password123');
  });

  await test.step('Verify submit button is enabled', async () => {
    const submitButton = page.getByTestId(LoginSelectors.SubmitButton);
    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBeFalsy();
  });
});

test('should display login form elements correctly', async ({ page }) => {
  await test.step('Navigate to login page', async () => {
    await page.goto(Routes.Login);
  });

  await test.step('Verify all form elements are visible', async () => {
    await expect(page.getByTestId(LoginSelectors.Container)).toBeVisible();
    await expect(page.getByTestId(LoginSelectors.Title)).toBeVisible();
    await expect(page.getByTestId(LoginSelectors.EmailInput)).toBeVisible();
    await expect(page.getByTestId(LoginSelectors.PasswordInput)).toBeVisible();
    await expect(page.getByTestId(LoginSelectors.SubmitButton)).toBeVisible();
  });
});

test('should show error with invalid credentials', async ({ page }) => {
  await login({
    page,
    email: 'wrong@example.com',
    password: 'WrongPassword123!'
  });

  await page.waitForTimeout(3000);
  const errorMessage = await getErrorMessage(page);
  console.log({errorMessage});
  expect(errorMessage).toBeTruthy();
});

test('should login with valid credentials ', async ({ page }) => {
  await login({
    page,
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD
  });

  await page.waitForTimeout(3000);
  const currentUrl = page.url();
  console.log({currentUrl});
  expect(currentUrl).toContain(Routes.Home);
});
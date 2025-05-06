import dotenv from 'dotenv';
import { Page } from '@playwright/test';
import { Routes } from '@interfaces';
import { LoginSelectors } from '@tests/e2e/pages/Login';

dotenv.config();
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = process.env;

export const login = async ({
  page,
  email = TEST_USER_EMAIL || '',
  password = TEST_USER_PASSWORD || ''
}: {
  page: Page;
  email?: string;
  password?: string;
}) => {
  await page.goto(Routes.Login);
  
  await page.getByTestId(LoginSelectors.EmailInput).fill(email);
  await page.getByTestId(LoginSelectors.PasswordInput).fill(password);
  await page.getByTestId(LoginSelectors.SubmitButton).click();
};


export const getErrorMessage = async (page: Page): Promise<string | null> => {
  const errorElement = page.getByTestId(LoginSelectors.Error);
  const isVisible = await errorElement.isVisible();
  return isVisible ? await errorElement.textContent() : null;
}; 
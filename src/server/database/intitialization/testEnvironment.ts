import { UserModel } from "@models/user";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "@config/env";

export async function initializeTestEnvironment(): Promise<void> {
  try {
    await UserModel.create(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    const user = await UserModel.findByEmail(TEST_USER_EMAIL);

    if (user) {
      await UserModel.update(user.id, { isEmailVerified: true });
    }

    console.log('Test environment initialized');
  } catch (error) {
    console.error('Error initializing test environment:', error);
    throw error;
  }
}


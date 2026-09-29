import { test as setup } from '@fixtures';
import { requireEnv } from '@utils/env';
import { STORAGE_STATE } from '@utils/auth';

setup('autenticar usuario', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(requireEnv('TEST_USERNAME'), requireEnv('TEST_PASSWORD'));
    await loginPage.expectLoggedIn();

    await page.context().storageState({ path: STORAGE_STATE });
});

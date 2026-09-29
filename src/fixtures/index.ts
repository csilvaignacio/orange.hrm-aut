import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { InventoryPage } from '@pages/inventory.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutPage } from '@pages/checkout.page';
import { OverviwePage } from '@pages/overview.page';

type Pages = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    overviewPage: OverviwePage;
}

export const test = base.extend<Pages>({
    loginPage: async ({page},use) => {await use(new LoginPage(page));},
    inventoryPage: async ({page}, use) => {await use(new InventoryPage(page));},
    cartPage: async ({page}, use) => {await use(new CartPage(page))},
    checkoutPage: async ({page}, use) => {await use(new CheckoutPage(page))},
    overviewPage: async ({page}, use) => {await use(new OverviwePage(page))},
})

export { expect } from '@playwright/test';
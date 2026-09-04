import { test, expect } from '@playwright/test';

// Тест бүр дууссаны дараа автоматаар ажиллах хэсэг
test.afterEach(async ({ page }) => {
  // Хэрэв нэвтэрсэн байвал гарах үйлдэл хийнэ
  if (page.url().includes('inventory.html')) {
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
  }
});

// 1. Амжилттай нэвтрэх тест
test('Амжилттай нэвтрэх', async ({ page }) => {
  // Веб хуудас руу үсрэх
  await page.goto('https://www.saucedemo.com');

  // Хэрэглэгчийн нэр, нууц үг оруулж Нэвтрэх товч дээр дарах
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Нэвтэрсний дараа "Products" гэсэн текст харагдаж байгааг баталгаажуулах
  await expect(page.getByText('Products')).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
});

// 2. Сөрөг тест: Буруу нууц үгээр нэвтрэх
test('Амжилтгүй нэвтрэх - Буруу нууц үг', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  // Алдааны мессеж гарч ирж байгааг шалгах
  await expect(page.getByRole('heading', { name: /Epic sadface/ })).toBeVisible();
});

// 3. Нэвтэрсний дараах үйлдэл: Бараа сагслах
test('Бараа сагсанд нэмэх', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Эхний барааг сагслах товчийг дарах — тухайн бүтээгдэхүүний
  // картыг нэрээр нь олоод, дотор нь байгаа "Add to cart" товчийг role-оор нь хайна 
  await page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' })
    .getByRole('button', { name: 'Add to cart' })
    .click();

  // Сагсны badge (тоо харуулагч) барааны тоогоор шалгах
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
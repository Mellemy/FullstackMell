const { test, expect, beforeEach, describe } = require('@playwright/test')
test.describe.configure({ mode: 'serial' })
describe('Blog app', () => {
 beforeEach(async ({ page, request }) => {
  await request.post('http://localhost:3003/api/testing/reset')

  await request.post('http://localhost:3003/api/users', {
    data: {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
  })
  await request.post('http://localhost:3003/api/users', {
    data: {
      name: 'John Testman',
      username: 'Johnny',
      password: 'secret!'
    }
  })

  await page.goto('http://localhost:5173')
})
  test('Login form is shown', async ({ page }) => {

     const locator = await page.getByText('Log in to application')
  await expect(locator).toBeVisible()
  })

    test('succeeds with correct credentials', async ({ page }) => {

    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
     
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('uuh')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await page.getByRole('button', { name: 'add blog' }).click()

    await page.getByTestId('Title').fill('Amazing')
    await page.getByTestId('Author').fill('Robert')
    await page.getByTestId('URL').fill('http://testblog.com')

    await page.getByRole('button', { name: 'Create' }).click()
   await expect(page.getByText('Amazing Robert')).toBeVisible()

  })

test('Liking a blog', async ({ page }) => {
  await page.getByRole('textbox').first().fill('mluukkai')
  await page.getByRole('textbox').last().fill('salainen')
  await page.getByRole('button', { name: 'login' }).click()

  await page.getByRole('button', { name: 'add blog' }).click()
  await page.getByTestId('Title').fill('Good Blog')
  await page.getByTestId('Author').fill('narcissus')
  await page.getByTestId('URL').fill('http://something.com')
  await page.getByRole('button', { name: 'Create' }).click()

  await page.getByText('Good Blog narcissus').getByRole('button', { name: 'view' }).click()

  const likes = page.getByTestId('likes')
  await expect(likes).toContainText('Likes: 0')

  await page.getByRole('button', { name: 'like' }).click()

  await expect(likes).toContainText('Likes: 1')
})


test('Creator deletes their blog', async ({ page }) => {
  await page.getByRole('textbox').first().fill('mluukkai')
  await page.getByRole('textbox').last().fill('salainen')
  await page.getByRole('button', { name: 'login' }).click()

  await page.getByRole('button', { name: 'add blog' }).click()
  await page.getByTestId('Title').fill('DeleteThis')
  await page.getByTestId('Author').fill('Rulebreaker!')
  await page.getByTestId('URL').fill('http://delete.com')
  await page.getByRole('button', { name: 'Create' }).click()

  await page.getByText('DeleteThis Rulebreaker!').getByRole('button', { name: 'view' }).click()

  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Delete "DeleteThis"')
    await dialog.accept()
  })

  await page.getByRole('button', { name: 'Remove' }).click()

  await expect(page.getByText('DeleteThis Rulebreaker!')).not.toBeVisible()
})


test('Blog maker sees delete', async ({ page, request }) => {
 
  await page.getByRole('textbox').first().fill('mluukkai')
  await page.getByRole('textbox').last().fill('salainen')
  await page.getByRole('button', { name: 'login' }).click()

  await page.getByRole('button', { name: 'add blog' }).click()
  await page.getByTestId('Title').fill('My Blog')
  await page.getByTestId('Author').fill('mluukkai')
  await page.getByTestId('URL').fill('http://ehm.com')
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByRole('button', { name: 'Logout' }).click()

  await page.getByRole('textbox').first().fill('Johnny')
  await page.getByRole('textbox').last().fill('secret!')
  await page.getByRole('button', { name: 'login' }).click()
  await expect(page.getByText('My Blog mluukkai')).toBeVisible()
  await page.getByText('My Blog mluukkai').getByRole('button', { name: 'view' }).click()

  await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0)
})
  })
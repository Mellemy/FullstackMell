const { test, expect, beforeEach, describe } = require('@playwright/test')

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

    await page.goto('http://localhost:5173')
  })
  test('Login form is shown', async ({ page }) => {

     const locator = await page.getByText('Log in to application')
  await expect(locator).toBeVisible()
  })
 })


   describe('Login', () => {
    beforeEach(async ({ page, request }) => {
   
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
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


 })
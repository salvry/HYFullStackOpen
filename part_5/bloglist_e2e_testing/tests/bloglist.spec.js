const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, logout, createBlog } = require('./helper')

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

   describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await login(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Blogs')).toBeVisible()
        await expect(page.getByText('Welcome, mluukkai')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await login(page, 'mluukkai', 'wrongpassword')
        await expect(page.getByText('Wrong username or password')).toBeVisible()    
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await login(page, 'mluukkai', 'salainen')
  })
    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'Blog title', 'Blog author', 'https://blogurl.com')
        await expect(page.getByText('Added Blog title by Blog author')).toBeVisible()
        await expect(page.getByRole('link', {name: 'Blog title'})).toBeVisible()
    })

    describe('When a blog exists', () => {
        beforeEach(async ({ page }) => {
            await createBlog(page, 'Blog title', 'Blog author', 'https://blogurl.com')
        })
        test('blog can be liked', async ({ page }) => {
            await page.getByRole('link', {name: 'Blog title'}).click()
            await page.getByRole('button', {name: 'Like'}).click()
            await expect(page.getByText('Likes: 1')).toBeVisible()
        })
        test('user can remove blog', async ({ page }) => {
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.getByRole('link', {name: 'Blog title'}).click()
            await page.getByRole('button', {name: 'Remove'}).click()
            await expect(page.getByText('Blog author: Blog title')).not.toBeVisible()
        })
        test('user cannot remove blog added by another user', async ({ page, request }) => {
            await request.post('http://localhost:3003/api/users', {
                data: {
                name: 'Matti Tuominen',
                username: 'masa',
                password: 'salasana'
            }
            })
            await logout(page)
            await login(page, 'masa', 'salasana')
            await page.getByRole('link', {name: 'Blog title'}).click()
            await expect(page.getByRole('button', {name:'Remove'})).not.toBeVisible()
        })
         test('blogs are sorted by likes in descending order', async ({ page }) => {
            await page.getByRole('link', {name: 'Blog title'}).waitFor()
            await createBlog(page, 'Blog title 2', 'Blog author 2', 'https://blogurl2.com')
            await expect(page.locator('li').first()).toContainText('Blog title')
            await expect(page.locator('li').last()).toContainText('Blog title 2')
            await page.getByRole('link', {name: 'Blog title 2'}).click()
            await page.getByRole('button', {name: 'Like'}).click()
            await page.getByRole('link', {name: 'Blogs'}).click()
            await expect(page.locator('li').first()).toContainText('Blog title 2')
            await expect(page.locator('li').last()).toContainText('Blog title')
        })        
    })
  })
})
  
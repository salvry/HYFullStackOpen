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

  test('Login form is shown', async ({ page }) => {
     const heading = page.getByRole('heading', { name: 'Log in' })
     const usernameField = page.getByLabel('username')
     const passwordField = page.getByLabel('password')
     const button = page.getByRole('button', { name: 'Log in' })
     await expect(heading).toBeVisible()
     await expect(usernameField).toBeVisible()
     await expect(passwordField).toBeVisible()
     await expect(button).toBeVisible()
  })

   describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await login(page, 'mluukkai', 'salainen')
        await expect(page.getByText('blogs')).toBeVisible()
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
        await expect(page.getByText('Blog author: Blog title')).toBeVisible()    
    })

    describe('When a blog exists', () => {
        beforeEach(async ({ page }) => {
            await createBlog(page, 'Blog title', 'Blog author', 'https://blogurl.com')
        })
        test('blog can be liked', async ({ page }) => {
            await expect(page.getByText('Blog author: Blog title')).toBeVisible()    
            await page.getByRole('button', {name: 'view'}).click()
            await page.getByRole('button', {name: 'like'}).click()
            await expect(page.getByText('Likes: 1')).toBeVisible()
        })
        test('user can remove blog', async ({ page }) => {
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.getByRole('button', {name: 'view'}).click()
            await page.getByRole('button', {name: 'remove'}).click()
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
            await page.getByRole('button', {name: 'view'}).click()
            await expect(page.getByRole('button', {name:'remove'})).not.toBeVisible()
        })
         test('blogs are sorted by likes in descending order', async ({ page }) => {
            await createBlog(page, 'Blog title 2', 'Blog author 2', 'https://blogurl2.com')
            const blog2 = page.getByText('Blog author 2: Blog title 2')
            await expect(page.locator('.blog').first()).toContainText('Blog author: Blog title')
            await blog2.getByRole('button', { name: 'view' }).click()
            await blog2.getByRole('button', { name: 'like' }).click()
            const blogs = page.locator('.blog')
            await expect(page.locator('.blog').first()).toContainText('Blog author 2: Blog title 2')
            
        })        
    })
  })
})
  
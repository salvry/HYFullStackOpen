const login = async (page, username, password)  => {
  await page.getByRole('link', { name: 'Log in' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
}

const logout = async (page)  => {
  await page.getByRole('button', { name: 'Log out' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('link', { name: 'Add new blog' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByLabel('Author').fill(author)
    await page.getByLabel('URL').fill(url)
    await page.getByRole('button', { name: 'Add' }).click()   
}

export { login, logout, createBlog }
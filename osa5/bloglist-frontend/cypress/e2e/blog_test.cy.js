describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const testUser = {
      name: 'End to End testaus',
      username: 'testi',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', testUser)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Login to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Login to application')
      cy.get('#username').type('testi')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()
      cy.contains('User End to End testaus is sign in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('Login to application')
      cy.get('#username').type('testi1')
      cy.get('#password').type('Salainen')
      cy.get('#loginButton').click()
      cy.contains('Wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()
    })

    it('A blog can be created', function() {
      cy.get('#createNewBlogButton').click()
      cy.get('#title').type('Test. Automate. Accelerate.')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('https://www.cypress.io/')
      cy.get('#createBlogButton').click()
      cy.contains('Test. Automate. Accelerate. Cypress')
    })

    it('Can like blog', function() {
      cy.get('#createNewBlogButton').click()
      cy.get('#title').type('Test. Automate. Accelerate.')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('https://www.cypress.io/')
      cy.get('#createBlogButton').click()
      cy.contains('Test. Automate. Accelerate. Cypress')

      cy.get('#viewBlogButton').click()
      cy.contains('likes 0')
      cy.get('#likeBlogButton').click()
      cy.contains('likes 1')
    })

    it('Can removed blog', function() {
      cy.get('#createNewBlogButton').click()
      cy.get('#title').type('Test. Automate. Accelerate.')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('https://www.cypress.io/')
      cy.get('#createBlogButton').click()
      cy.contains('Test. Automate. Accelerate. Cypress')

      cy.get('#viewBlogButton').click()
      cy.get('#likeBlogButton').click()
      cy.get('#removeBlogButton').click()
    })

    it('Can removed blog only my added blog', function() {
      cy.get('#createNewBlogButton').click()
      cy.get('#title').type('Test. Automate. Accelerate.')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('https://www.cypress.io/')
      cy.get('#createBlogButton').click()
      cy.contains('Test. Automate. Accelerate. Cypress')

      cy.get('#viewBlogButton').click()
      cy.get('#likeBlogButton').click()
      cy.get('#logoutButton').click()

      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const testUser2 = {
        name: 'End to End testaus 2',
        username: 'testi2',
        password: 'salainen2'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', testUser2)

      cy.get('#username').type('testi2')
      cy.get('#password').type('salainen2')
      cy.get('#loginButton').click()
      cy.contains('User End to End testaus 2 is sign in')

      cy.contains('Test. Automate. Accelerate. Cypress')
      cy.get('#viewBlogButton', { timeout: 10000 }).click()
      cy.get('#removeBlogButton').should('not.exist')
      cy.contains('Test. Automate. Accelerate. Cypress')
      cy.contains('End to End testaus')
    })

  })
})
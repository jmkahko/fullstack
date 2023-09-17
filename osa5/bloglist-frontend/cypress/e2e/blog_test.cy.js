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
})
import { PageObject, StateClass, Endpoint, Text } from './profile.data'

describe(`Раздел "Profile"`, () => {
  beforeEach(() => {
    cy.log(`Шаг 1 - Перейти на https://telerik.github.io/kendo-angular/coffee-warehouse/`)
    cy.visit(Endpoint.HttpsTelerikGithubIoKendoAngularCoffeeWarehouse)

    cy.log(`Шаг 2 - Кликнуть на элемент с текстом "Profile"`)
    cy.contains(Text.Profile)
      .click()
  })

  it('Валидация', () => {
    cy.log(`Шаг 3 - Проверить, что не виден элемент с текстом "Error: First Name is required"`)
    cy.contains(Text.ErrorFirstNameIsRequired)
      .should('not.be.exist')

    cy.log(`Шаг 4 - Очистить текст в поле с именем`)
    cy.get(PageObject.FirstName)
      .clear()

    cy.log(`Шаг 5 - Проверить, что виден элемент с текстом "Error: First Name is required"`)
    cy.contains(Text.ErrorFirstNameIsRequired)
      .should('be.exist')

    cy.log(`Шаг 6 - Проверить, что не виден элемент с текстом "Error: Last Name is required"`)
    cy.contains(Text.ErrorLastNameIsRequired)
      .should('not.be.exist')

    cy.log(`Шаг 7 - Очистить текст в поле с фамилией`)
    cy.get(PageObject.LastName)
      .clear()

    cy.log(`Шаг 8 - Проверить, что виден элемент с текстом "Error: Last Name is required"`)
    cy.contains(Text.ErrorLastNameIsRequired)
      .should('be.exist')

    cy.log(`Шаг 9 - Проверить, что не виден элемент с текстом "Error: Email is required"`)
    cy.contains(Text.ErrorEmailIsRequired)
      .should('not.be.exist')

    cy.log(`Шаг 10 - Очистить текст в поле с эл. почтой`)
    cy.get(PageObject.Email)
      .clear()

    cy.log(`Шаг 11 - Проверить, что виден элемент с текстом "Error: Email is required"`)
    cy.contains(Text.ErrorEmailIsRequired)
      .should('be.exist')

    cy.log(`Шаг 12 - В поле с эл. почтой ввести "Invalid email"`)
    cy.get(PageObject.Email)
      .type(Text.InvalidEmail)

    cy.log(`Шаг 13 - Проверить, что виден элемент с текстом "Error: Not valid email format"`)
    cy.contains(Text.ErrorNotValidEmailFormat)
      .should('be.exist')

    cy.log(`Шаг 14 - Очистить текст в поле с телефоном`)
    cy.get(PageObject.Phone)
      .clear()

    cy.log(`Шаг 15 - Проверить, что виден элемент с текстом "Error: Phone number is required"`)
    cy.contains(Text.ErrorPhoneNumberIsRequired)
      .should('be.exist')

    cy.log(`Шаг 16 - В поле с эл. почтой ввести "123"`)
    cy.get(PageObject.Email)
      .type(Text.Number)

    cy.log(`Шаг 17 - Проверить, что виден элемент с текстом "Error: Not a valid phone number"`)
    cy.contains(Text.ErrorNotAValidPhoneNumber)
      .should('be.exist')

    cy.log(`Шаг 18 - Проверить, что элемент с текстом "Save Changes" заблокирован`)
    cy.contains(Text.SaveChanges)
      .should('have.class', StateClass.Disabled)
  })

  it('Изменение данных', () => {
    cy.log(`Шаг 3 - Очистить текст в поле с именем`)
    cy.get(PageObject.FirstName)
      .clear()

    cy.log(`Шаг 4 - В поле с именем ввести "Anzhela"`)
    cy.get(PageObject.FirstName)
      .type(Text.Anzhela)

    cy.log(`Шаг 5 - Проверить, что элемент с текстом "Save Changes" не заблокирован`)
    cy.contains(Text.SaveChanges)
      .should('not.have.class', StateClass.Disabled)

    cy.log(`Шаг 6 - Кликнуть на элемент с текстом "Save Changes"`)
    cy.contains(Text.SaveChanges)
      .click()

    cy.log(`Шаг 7 - Проверить, что виден элемент с текстом "Profile changes have been saved."`)
    cy.contains(Text.ProfileChangesHaveBeenSaved)
      .should('be.exist')
  })
})
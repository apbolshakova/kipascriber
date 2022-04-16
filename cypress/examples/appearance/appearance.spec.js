import { PageObject, StateClass, Endpoint, Text } from './appearance.data'

describe(`Настройки отображения`, () => {
  beforeEach(() => {
    cy.log(`Шаг 1 - Перейти на https://telerik.github.io/kendo-angular/coffee-warehouse/`)
    cy.visit(Endpoint.HttpsTelerikGithubIoKendoAngularCoffeeWarehouse)
  })

  it('Язык и стиль внешнего вида по умолчанию', () => {
    cy.log(`Шаг 2 - Проверить, что главный заголовок содержит текст " Coffee Warehouse "`)
    cy.get(PageObject.MainHeader)
      .should('have.text', Text.CoffeeWarehouse)

    cy.log(`Шаг 3 - Проверить, что меню выбора языка не material-элемент`)
    cy.get(PageObject.LocaleOptions)
      .should('not.have.class', StateClass.Material)
  })

  it('Переключение языка', () => {
    cy.log(`Шаг 2 - Кликнуть на меню выбора языка`)
    cy.get(PageObject.LocaleOptions)
      .click()

    cy.log(`Шаг 3 - Кликнуть на элемент с текстом "French"`)
    cy.contains(Text.French)
      .click()

    cy.log(`Шаг 4 - Проверить, что главный заголовок содержит текст " Entrepôt De Café "`)
    cy.get(PageObject.MainHeader)
      .should('have.text', Text.EntrepTDeCaf)
  })

  it('Переключение стиля внешнего вида', () => {
    cy.log(`Шаг 2 - Кликнуть на меню выбора внешнего вида`)
    cy.get(PageObject.ThemeOptions)
      .click()

    cy.log(`Шаг 3 - Кликнуть на элемент с текстом "Material"`)
    cy.contains(Text.Material)
      .click()

    cy.log(`Шаг 4 - Проверить, что меню выбора языка отображается как material-элемент`)
    cy.get(PageObject.LocaleOptions)
      .should('have.class', StateClass.Material)
  })
})
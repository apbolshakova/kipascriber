import { PageObject, StateClass, Endpoint, Text } from './team.data'

describe(`Раздел "Team"`, () => {
  beforeEach(() => {
    cy.log(`Шаг 1 - Перейти на https://telerik.github.io/kendo-angular/coffee-warehouse/`)
    cy.visit(Endpoint.HttpsTelerikGithubIoKendoAngularCoffeeWarehouse)
  })

  it('Базовая навигация', () => {
    cy.log(`Шаг 2 - Проверить, что записей в таблице 10 штук`)
    cy.get(PageObject.TableItem)
      .should('have.length', 10)

    cy.log(`Шаг 3 - Проверить, что состояние навигации содержит текст "1 - 10 of 25 items"`)
    cy.get(PageObject.NavigationState)
      .should('have.text', Text.OfItems)

    cy.log(`Шаг 4 - Кликнуть переход на вторую страницу`)
    cy.get(PageObject.SecondPageButton)
      .click()

    cy.log(`Шаг 5 - Проверить, что записей в таблице 10 штук`)
    cy.get(PageObject.TableItem)
      .should('have.length', 10)

    cy.log(`Шаг 6 - Проверить, что состояние навигации содержит текст "11 - 20 of 25 items"`)
    cy.get(PageObject.NavigationState)
      .should('have.text', Text.OfItems1)

    cy.log(`Шаг 7 - Кликнуть переход на третью страницу`)
    cy.get(PageObject.ThirdPageButton)
      .click()

    cy.log(`Шаг 8 - Проверить, что записей в таблице 5 штук`)
    cy.get(PageObject.TableItem)
      .should('have.length', 5)

    cy.log(`Шаг 9 - Проверить, что состояние навигации содержит текст "21 - 25 of 25 items"`)
    cy.get(PageObject.NavigationState)
      .should('have.text', Text.OfItems2)
  })

  it('Поиск', () => {
    cy.log(`Шаг 2 - В строке поиска ввести "Boy"`)
    cy.get(PageObject.Search)
      .type(Text.Boy)

    cy.log(`Шаг 3 - Проверить, что записей в таблице 1 штука`)
    cy.get(PageObject.TableItem)
      .should('have.length', 1)

    cy.log(`Шаг 4 - Проверить, что первое имя в таблице содержит текст " Boy Antoszewski "`)
    cy.get(PageObject.Name)
      .first()
      .should('have.text', Text.BoyAntoszewski)

    cy.log(`Шаг 5 - Очистить текст в строке поиска`)
    cy.get(PageObject.Search)
      .clear()

    cy.log(`Шаг 6 - Проверить, что состояние навигации содержит текст "1 - 10 of 100 items"`)
    cy.get(PageObject.NavigationState)
      .should('have.text', Text.OfItems3)

    cy.log(`Шаг 7 - В строке поиска ввести "Programmer"`)
    cy.get(PageObject.Search)
      .type(Text.Programmer)

    cy.log(`Шаг 8 - Проверить, что записей в таблице 2 штуки`)
    cy.get(PageObject.TableItem)
      .should('have.length', 2)

    cy.log(`Шаг 9 - Проверить, что первая должность в таблице содержит текст "Analyst Programmer"`)
    cy.get(PageObject.JobTitle)
      .first()
      .should('have.text', Text.AnalystProgrammer)

    cy.log(`Шаг 10 - В строке поиска ввести "Something random"`)
    cy.get(PageObject.Search)
      .type(Text.SomethingRandom)

    cy.log(`Шаг 11 - Проверить, что записей в таблице 0 штуки`)
    cy.get(PageObject.TableItem)
      .should('have.length', 0)

    cy.log(`Шаг 12 - Кликнуть на элемент с текстом "My Team"`)
    cy.contains(Text.MyTeam)
      .click()

    cy.log(`Шаг 13 - Проверить, что состояние навигации содержит текст "1 - 10 of 25 items"`)
    cy.get(PageObject.NavigationState)
      .should('have.text', Text.OfItems)
  })

  it('Сортировка', () => {
    cy.log(`Шаг 2 - Кликнуть на элемент с текстом "Contact Name"`)
    cy.contains(Text.ContactName)
      .click()

    cy.log(`Шаг 3 - Проверить, что первое имя в таблице содержит текст " Adrianne Peery "`)
    cy.get(PageObject.Name)
      .first()
      .should('have.text', Text.AdriannePeery)

    cy.log(`Шаг 4 - Кликнуть на элемент с текстом "Contact Name"`)
    cy.contains(Text.ContactName)
      .click()

    cy.log(`Шаг 5 - Проверить, что первое имя в таблице содержит текст " Wait Peperell "`)
    cy.get(PageObject.Name)
      .first()
      .should('have.text', Text.WaitPeperell)

    cy.log(`Шаг 6 - Пролистать таблицу сотрудников вправо`)
    cy.get(PageObject.Table)
      .scrollTo('right')

    cy.log(`Шаг 7 - Кликнуть на элемент с текстом "Address"`)
    cy.contains(Text.Address)
      .click()

    cy.log(`Шаг 8 - Проверить, что первый адрес в таблице содержит текст "0 Lunder Crossing"`)
    cy.get(PageObject.Address)
      .first()
      .should('have.text', Text.LunderCrossing)
  })
})
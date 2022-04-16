# Kipascriber

Kipascriber - это инструмент, позволяющий генерировать функциональные тесты для фреймворка Cypress из тест-кейсов на
русском языке.

## Быстрый старт

Для того чтобы сгенерировать код автоматического теста на Cypress необходимо создать файл с расширением .suite.txt,
имеющий следующую структуру:

```sh
Объекты:
TodoList: .todo-list li // задач|задачи|задача
TodoInput: [data-test=new-todo] // поле ввода

Состояния:
Completed: completed // завершена

Тест-сьют:
TODO приложение

Перед каждым тестом:
Шаг 1 - Перейти на https://example.cypress.io/todo

Тест:
Добавление новых задач
Шаг 2 - В поле ввода ввести "Feed the cat{enter}"
Шаг 3 - Проверить, что задач 3 штуки
Шаг 4 - Проверить, что последняя задача имеет текст "Feed the cat"

Тест:
Отметка задачи выполненной
Шаг 2 - Отметить чекбокс первой задачи
Шаг 3 - Проверить, что первая задача завершена
```

Затем нужно выполнить команду:

```sh
npx kipascriber
```

После чего в той же директории, где находился сьют-файл будут созданы два файла:

- .spec.js - файл с кодом автоматических тестов из сьюта

```sh
import { PageObject, StateClass, Endpoint, Text } from 'todo.data'

describe('TODO приложение', () => {
  beforeEach(() => {
    cy.log(`Шаг 1 - Перейти на https://example.cypress.io/todo`)
    cy.visit(Endpoint.HttpsExampleCypressIoTodo)
  })

  it('Добавление новых задач', () => {
    cy.log(`Шаг 2 - В поле ввода ввести "Feed the cat{enter}"`)
    cy.get(PageObject.TodoInput)
      .type(Text.FeedTheCatEnter)

    cy.log(`Шаг 3 - Проверить, что задач 3 штуки`)
    cy.get(PageObject.TodoList)
      .should('have.length', 3)

    cy.log(`Шаг 4 - Проверить, что последняя задача имеет текст "Feed the cat"`)
    cy.get(PageObject.TodoList)
      .last()
      .should('have.text', Text.FeedTheCat)
  })

  it('Отметка задачи выполненной', () => {
    cy.log(`Шаг 2 - Отметить чекбокс первой задачи`)
    cy.get(PageObject.TodoList)
      .first()
      .check()

    cy.log(`Шаг 3 - Проверить, что первая задача завершена`)
    cy.get(PageObject.TodoList)
      .first()
      .should('have.class', StateClass.Completed)
  })
})
```

- .data.js - файл с конфигурационными объектами для созданных тестов

```sh
export const PageObject = {
  TodoList: '.todo-list li', // задач|задачи|задача
  TodoInput: '[data-test=new-todo]', // поле ввода
}

export const StateClass = {
  Completed: 'completed', // завершена
}

export const Endpoint = {
  HttpsExampleCypressIoTodo: 'https://example.cypress.io/todo',
}

export const Text = {
  FeedTheCatEnter: 'Feed the cat{enter}',
  FeedTheCat: 'Feed the cat',
}
```

Полученный spec-файл является готовым автоматическим тестом на Cypress.

## Правила написания .suite.txt файлов

### Общие принципы

- В проекте может быть неограниченное количество suite.txt файлов. При запуске kipascriber будет осуществлена генерация
  кода автотестов для каждого из spec.txt файлов в проекте.
- Наличие в suite.txt каждого из разделов обязательно. Если для тестов не нужны объекты, состояния или предварительные
  действия, то содержимое раздела оставляется пустым.
- Разделы отделяются друг от друга пустой строкой.
- Порядок разделов фиксирован. При необходимости заголовок раздела может быть изменён (например, "Объекты:" на "Элементы
  страницы:").

### Раздел "Объекты"

- Каждая строка раздела описывает один объект на странице. Может быть указано любое количество объектов.
- Строка начинается с идентификатора (названия переменной) для объекта. Рекомендуется использовать PascalCase нотацию.
  Название должно быть валидным идентификатором для JavaScript. Может быть указано любое название, однако рекомендуется
  использовать осознанное словосочетание, описывающее элемент.
- Идентификатор отделяется от остальной части символом ":" и пробелом. После идентификатора указывается локатор объекта.
  В качестве локатора может выступать любой валидный XPath.
- После локатора указываются ключевые слова, упоминание которых сигнализирует о необходимости использования данного
  объекта в коде автотеста. Ключевые слова отделяются от локатора двойным слэшем и пробелом.
- Для объекта может быть указано любое количество ключевых слов. Ключевые слова отделяются друг от друга символом "|".

### Раздел "Состояния"

- Каждая строка раздела описывает CSS-класс, характеризующий состояние объекта. Может быть указано любое количество
  классов.
- Строка начинается с идентификатора (названия переменной) для состояния. Рекомендуется использовать PascalCase нотацию.
  Название должно быть валидным идентификатором для JavaScript. Может быть указано любое название, однако рекомендуется
  использовать осознанное словосочетание, описывающее состояние.
- Идентификатор отделяется от остальной части символом ":" и пробелом. После идентификатора указывается CSS-класс.
- После CSS-класса указываются ключевые слова, упоминание которых сигнализирует о необходимости проверки данного
  состояния в коде автотеста. Ключевые слова отделяются от CSS-класса двойным слэшем и пробелом.
- Для состояния может быть указано любое количество ключевых слов. Ключевые слова отделяются друг от друга символом "|".

### Раздел "Тест-сьют"

- Содержит одну строку: название, которое будет указано в describe-блоке кода.
- При попытке добавить несколько строк они все будут добавлены в заголовок describe-блока, но рекомендуется оставлять
  название в одной строке.

### Раздел "Перед каждым тестом"

- Для раздела справедливы те же замечания, что для разделов "Тест", за исключением наличия строчки - названия теста.
- В данном разделе указываются предварительные шаги, которые будут выполняться перед каждым тестом из последующих
  разделов. Например, здесь может осуществляться переход на нужную страницу, авторизация в системе и т.п.

### Разделы "Тест"

- В одном входном файле тест-сьюта может быть несколько разделов "Тест", из каждого будет сгенерирован свой тест в
  рамках одного тест-сьюта.
- Первая строчка после объявления раздела - название теста.
- Каждая из последующих строк раздела описывает шаг теста. Может быть указано любое количество шагов.
- Каждый шаг состоит из двух частей: комментарий и действие, на основе которого будет сгенерирован код. Комментарий
  отделяется от действия первым встреченным символом "-".
- Комментарий служит для ориентирования в описании теста и не влияет на генерируемый код. В примере из "Быстрого старта"
  комментарием является указание шага ("Шаг N").
- Для каждого шага из раздела на основе действия генерируется соответствующий код. Примеры описания действий указаны в
  таблице доступных действий (ниже).

## Таблица доступных действий

Действия, для которых может быть сгенерирован код делится на 2 категории:

### Навигация между страницами и глобальная прокрутка страницы

| Действие | Пример входного описания | Пример выходного кода |
| ------ | ------ | ------ |
| Переход на страницу | Перейти на https://example.cypress.io/todo | cy.visit(Endpoint.HttpsExampleCypressIoTodo) |
| Прокрутка страницы (наверх, вниз, влево, вправо, в центр) | Пролистать страницу вниз | cy.scrollTo('bottom') |

### Указание элемента и выполнение действия над ним

Из описания шага должно быть понятно и какой выбрать элемент, и какое действие (проверку) необходимо выполнить.

#### 1. Выбор элемента (пример: требуется кликнуть на разные элементы. Замечание: допустимо использование различных предлогов)

| Действие | Пример входного описания | Пример выходного кода |
| ------ | ------ | ------ |
| Выбор элемента по ключевому слову из PageObject | Кликнуть по задаче | cy.get(PageObject.TodoList)<br>.click() |
| Выбор элемента по содержимому тексту | Кликнуть элемент с текстом "Click me!" | cy.contains(Text.ClickMe)<br>.click() |
| Выбор чекбокса | Кликнуть по чекбоксу | cy.find('[type="checkbox"]')<br>.click() |
| Выбор радиокнопки | Кликнуть радиокнопку | cy.find('[type="radio"]')<br>.click() |
| Выбор поля ввода | Кликнуть на текстовое поле | cy.find('[type="text"]')<br>.click() |

Для выбора элемента также доступны модификаторы (пример: выбор элемента относительно чекбокса):

| Действие | Пример входного описания | Пример выходного кода |
| ------ | ------ | ------ |
| Выбор первого элемента | Кликнуть на первый чекбокс | cy.find('[type="checkbox"]')<br>.first()<br>.click() |
| Выбор последнего элемента | Кликнуть на последний чекбокс | cy.find('[type="checkbox"]')<br>.last()<br>.click() |
| Выбор элемента перед указанным | Кликнуть на элемент перед чекбоксом | cy.find('[type="checkbox"]')<br>.prev()<br>.click() |
| Выбор элемента после указанного | Кликнуть на элемент после чекбокса | cy.find('[type="checkbox"]')<br>.next()<br>.click() |

#### 2. Действия над элементом - проверки

Описание для любой проверки должно начинаться со слова "Проверить". Для каждой из проверок существует обратный вариант,
используемый с помощью добавления частицы "не".

| Действие | Пример входного описания | Пример выходного кода |
| ------ | ------ | ------ |
| Проверка состояния по CSS-классу из StateClass | Проверить, что задача завершена<br><br>Проверить, что задача не завершена | cy.get(PageObject.TodoList)<br>.should('have.class', StateClass.Completed)<br><br>cy.get(PageObject.TodoList)<br>.should('not.have.class', StateClass.Completed) |
| Проверка цвета (CSS-атрибута color) | Проверить, что элемент с текстом "Hello" цвета #CCCCCC<br><br>Проверить, что элемент с текстом "Hello" не цвета orange| cy.contains(Text.Hello)<br>.should('have.attr', 'style', 'color: #CCCCCC;')<br><br>cy.contains(Text.Hello)<br>.should('not.have.attr', 'style', 'color: orange;') |
| Проверка значения | Проверить, что поле ввода содержит значение "Hello"<br><br>Проверить, что поле ввода содержит не значение "Hello" | cy.get(PageObject.TodoInput)<br>.should('have.value', Text.Hello)<br><br>cy.get(PageObject.TodoInput)<br>.should('not.have.value', Text.Hello) |
| Проверка текста | Проверить, что поле ввода содержит текст "Hello"<br><br>Проверить, что поле ввода содержит не текст "Hello" | cy.get(PageObject.TodoInput)<br>.should('have.text', Text.Hello)<br><br>cy.get(PageObject.TodoInput)<br>.should('not.have.text', Text.Hello) |
| Проверка количества элементов | Проверить, что задач 3 штуки<br><br>Проверить, что задач не 1 штука | cy.get(PageObject.TodoList)<br>.should('have.length', 3)<br><br>cy.get(PageObject.TodoList)<br>.should('not.have.length', 1) |
| Проверка отмечен ли элемент (например, чекбокс) | Проверить, что чекбокс отмечен<br><br>Проверить, что чекбокс не отмечен | cy.find('[type="checkbox"]')<br>.should('be.checked')<br><br>cy.find('[type="checkbox"]')<br>.should('not.be.checked') |
| Проверка наличия (видимости) элемента | Проверить, что видно поле ввода<br><br>Проверить, что не виден чекбокс | cy.get(PageObject.TodoInput)<br>.should('be.visible')<br><br>cy.find('[type="checkbox"]')<br>.should('not.be.visible')|

#### 3. Остальные действия над элементом

| Действие | Пример входного описания | Пример выходного кода |
| ------ | ------ | ------ |
| Прокрутка элемента (наверх, вниз, влево, вправо, в центр) | Пролистать поле ввода в центр | cy.get(PageObject.TodoInput)<br>.scrollTo('center') |
| Прокрутка страницы к элементу | Пролистать страницу к полю ввода | cy.get(PageObject.TodoInput)<br>.scrollIntoView() |
| Двойной клик по элементу | Дважды кликнуть по чекбоксу | cy.find('[type="checkbox"]')<br>.dblclick() |
| Клик по элементу правой кнопкой мыши | Кликнуть правой кнопкой мыши по чекбоксу | cy.find('[type="checkbox"]')<br>.rightclick() |
| Клик по элементу | Кликнуть элемент с текстом "Click me!" | cy.contains(Text.ClickMe)<br>.click() |
| Отметить элемент (например, чекбокс) | Отметить чекбокс | cy.find('[type="checkbox"]')<br>.check() |
| Снять отметку с элемента (например, чекбокса) | Снять отметку с чекбокса | cy.find('[type="checkbox"]')<br>.uncheck() |
| Удалить введённый в элементе текст | Очистить текст в поле ввода | cy.get(PageObject.TodoInput)<br>.clear() |
| Установить фокус (выделить) элемент | Установить фокус на поле ввода | cy.get(PageObject.TodoInput)<br>.focus() |
| Снять фокус с элемента | Снять фокус с поля ввода | cy.get(PageObject.TodoInput)<br>.blur() |
| Отправить элемент (создать событие submit, например, для формы) | Отправить форму регистрации | cy.get(PageObject.RegistrationForm)<br>.submit() |
| Выбрать опцию в выпадающем списке (для элементов select) | Выбрать опцию "apples" в списке фруктов | cy.get(PageObject.FruitSelectList)<br>.select(Text.Apples) |
| Ввести текст в элемент (кнопки клавиатуры указываются в фигурных скобках) | В поле ввода ввести "Feed the cat{enter}" | cy.get(PageObject.TodoInput)<br>.type(Text.FeedTheCatEnter) |

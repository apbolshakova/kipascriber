export const PageObject = {
  FirstName: '[formcontrolname="firstName"]>input', // поле с именем
  LastName: '[formcontrolname="lastName"]>input', // поле с фамилией
  Email: '[formcontrolname="email"]>input', // поле с эл. почтой
  Phone: '[formcontrolname="phoneNumber"]>input', // поле с телефоном
  Country: '[formcontrolname="country"]>kendo-searchbar>input', // поле со страной
}

export const StateClass = {
  Disabled: 'k-state-disabled', // заблокирован
}

export const Endpoint = {
  HttpsTelerikGithubIoKendoAngularCoffeeWarehouse: 'https://telerik.github.io/kendo-angular/coffee-warehouse/',
}

export const Text = {
  Profile: 'Profile',
  ErrorFirstNameIsRequired: 'Error: First Name is required',
  ErrorLastNameIsRequired: 'Error: Last Name is required',
  ErrorEmailIsRequired: 'Error: Email is required',
  InvalidEmail: 'Invalid email',
  ErrorNotValidEmailFormat: 'Error: Not valid email format',
  ErrorPhoneNumberIsRequired: 'Error: Phone number is required',
  Number: '123',
  ErrorNotAValidPhoneNumber: 'Error: Not a valid phone number',
  SaveChanges: 'Save Changes',
  Anzhela: 'Anzhela',
  ProfileChangesHaveBeenSaved: 'Profile changes have been saved.',
}


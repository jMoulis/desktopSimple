export default {
  fullName: {
    type: 'text',
    label: 'Full Name',
    placeholder: 'Full Name',
    name: 'fullName',
    required: true,
  },
  email: {
    type: 'text',
    label: 'Email',
    placeholder: 'Email',
    name: 'email',
    required: true,
  },
  typeUser: {
    label: 'Type Account',
    name: 'typeUser',
    defaultOption: 'Select type account',
    required: true,
  },
  password: {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    required: true,
  },
};

export default {
  title: {
    type: 'text',
    label: 'Title',
    placeholder: 'Project Title',
    name: 'title',
  },
  description: {
    type: 'text',
    label: 'Description',
    placeholder: 'Project description',
    name: 'description',
  },
  dueDate: {
    type: 'text',
    label: 'Due Date',
    placeholder: 'Due date',
    name: 'dueDate',
  },
  isContest: {
    type: 'checkbox',
    label: 'Contest',
    name: 'isContest',
  },
  isPrice: {
    type: 'checkbox',
    label: 'Price',
    name: 'isPrice',
  },
  price: {
    type: 'text',
    label: 'Price',
    placeholder: 'Price',
    name: 'price',
  },
  maxTeam: {
    type: 'number',
    label: 'Number of team',
    placeholder: 'How many teams do you want',
    name: 'maxTeam',
  },
  status: {
    type: 'checkbox',
    label: 'Active',
    placeholder: 'Is Active',
    name: 'status',
  },
  tags: {
    type: 'text',
    label: 'Tags',
    placeholder: 'Tags',
    name: 'tags',
  },
};

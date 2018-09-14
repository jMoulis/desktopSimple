export default {
  title: {
    type: 'text',
    label: 'Title',
    placeholder: 'Title',
    name: 'title',
  },
  description: {
    type: 'text',
    label: 'Description',
    name: 'description',
  },
  status: {
    type: 'text',
    defaultOption: 'Select a status',
    name: 'status',
  },
  priority: {
    type: 'text',
    defaultOption: 'Select a priority',
    name: 'priority',
  },
  tags: {
    name: 'tags',
    placeholder: 'Select tags',
    isArray: true,
  },
  files: {
    label: 'Files',
    name: 'files',
    isArray: true,
  },
  assign: {
    type: 'select',
    name: 'assign',
    label: 'Assign',
  },
  dueDate: {
    type: 'text',
    name: 'dueDate',
  },
  team: {
    type: 'select',
    name: 'team',
    defaultOption: 'Select a team',
  },
};

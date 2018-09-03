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
    label: 'Status',
    defaultOption: 'Select a status',
    name: 'status',
  },
  priority: {
    type: 'text',
    label: 'Priority',
    defaultOption: 'Priority',
    name: 'priority',
  },
  labels: {
    label: 'Labels',
    name: 'labels',
    isArray: true,
  },
  documents: {
    label: 'Documents',
    name: 'documents',
    isArray: true,
  },
  type: {
    type: 'text',
    label: 'Type',
    name: 'type',
    placeholder: 'Type',
  },
  assign: {
    type: 'select',
    name: 'assign',
    label: 'Assign',
  },
};

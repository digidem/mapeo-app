// @flow

export const createCategory = (category?: any) => ({
  id: 'categoryID',
  icon: require('../images/categories/category_18.png'),
  name: 'categoryName',
  fields: [],

  ...category
});

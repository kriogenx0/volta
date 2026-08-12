import DropdownList from '../../components/DropdownList/DropdownList';

export default {
  name: 'DropdownList',
  description: 'A dropdown with a list of items',
  examples: [
    {
      name: 'DropdownList',
      code: (
        '<DropdownList items={[{ label: "First Item" }, { label: "Second Item" }]}/>'
      ),
      output: (
        <DropdownList items={[{ label: "First Item" }, { label: "Second Item" }]}/>
      )
    }
  ]
};

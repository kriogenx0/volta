import Card from '../../components/Card/Card';

export default {
  name: 'Card',
  description: 'A contained surface for grouping related content.',
  examples: [
    {
      name: 'Basic card',
      code: '<Card>Card content goes here.</Card>',
      output: <Card>Card content goes here.</Card>
    },
    {
      name: 'Selectable card',
      code: '<Card selectable>Click to select this card</Card>',
      output: <Card selectable>Click to select this card</Card>
    },
    {
      name: 'Selected card',
      code: '<Card selectable selected>This card is selected</Card>',
      output: <Card selectable selected>This card is selected</Card>
    },
  ]
};

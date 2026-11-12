import { Avatar, Badge, Button, Card, List, ListRow, ProgressBar } from '../../../components';

import { ACTIVITY, GOALS, STATS } from './examples-data';

// An overview: the headline numbers, progress towards goals and what happened lately.
const Dashboard = () => (
  <div className="sample-dashboard">
    <div className="sample-heading">
      <div>
        <h2>Overview</h2>
        <p className="sample-muted">How the business did in the last 30 days.</p>
      </div>
      <Button variant="primary">Download report</Button>
    </div>

    <div className="sample-stats">
      {STATS.map((stat) => (
        <Card key={stat.label}>
          <p className="sample-muted">{stat.label}</p>
          <p className="sample-stat">{stat.value}</p>
          <Badge tone={stat.tone}>{stat.change}</Badge>
        </Card>
      ))}
    </div>

    <div className="sample-columns">
      <Card>
        <h3>Goals</h3>
        {GOALS.map((goal) => (
          <div key={goal.label} className="sample-goal">
            <div className="sample-row sample-row--between">
              <span>{goal.label}</span>
              <span className="sample-muted">{goal.percent}%</span>
            </div>
            <ProgressBar percent={goal.percent} />
          </div>
        ))}
      </Card>

      <Card>
        <h3>Recent activity</h3>
        <List>
          {ACTIVITY.map((item) => (
            <ListRow as="div" key={item.text}>
              <div className="sample-person">
                <Avatar name={item.name} size="sm" />
                <span><strong>{item.name}</strong> {item.text}<br /><small className="sample-muted">{item.when}</small></span>
              </div>
            </ListRow>
          ))}
        </List>
      </Card>
    </div>
  </div>
);

export default Dashboard;

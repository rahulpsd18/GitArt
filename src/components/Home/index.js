import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { subMonths, startOfMonth, eachDay, format } from "date-fns";

import "react-calendar-heatmap/dist/styles.css";

import withAuthorization from "../Session/withAuthorization";

const seedInitial = () => {
  const initial = [];
  for (let day of eachDay(
    startOfMonth(subMonths(new Date(), 12)),
    new Date()
  )) {
    initial.push({ date: format(day, "YYYY-MM-DD"), count: 0 });
  }
  return initial;
};

class HomePage extends React.Component {
  state = { calendarData: seedInitial() };

  // FIXME: bruteforcing to find and update correct date in state here.
  // Will be fixed when state structure is optimized
  incrementValue = val => {
    const oldState = this.state.calendarData;
    for (var i in oldState) {
      if (oldState[i].date == val.date) {
        oldState[i].count = val.count + 1;
        if (oldState[i].count > 4) {
          oldState[i].count = 0;
        }
        break;
      }
    }
    this.setState({ calendarData: oldState });
  };

  render() {
    console.log('From render in homePage', this.props.authUser);
    return (
      <CalendarHeatmap
        startDate={startOfMonth(subMonths(new Date(), 12))}
        endDate={new Date()}
        values={this.state.calendarData}
        showWeekdayLabels={true}
        showWeekdayLabels={true}
        onClick={val => this.incrementValue(val)}
        titleForValue={value => `${value.count} contributions on ${value.date}`}
        classForValue={value =>
          value.count ? `color-scale-${value.count}` : "color-empty"
        }
      />
    );
  }
}

export default withAuthorization(HomePage);

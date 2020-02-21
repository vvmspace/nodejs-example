const moment = require('moment');

const dayOfWeek = dayIsNeed => {
    const today = moment().isoWeekday();
    if (today <= dayIsNeed) {
        // then just give me this week's instance of that day
        return moment().isoWeekday(dayIsNeed);
    } else {
        // otherwise, give me *next week's* instance of that same day
        return moment().add(1, 'weeks').isoWeekday(dayIsNeed);
    }
}

const tomorrow = () => {
    const today = moment().isoWeekday();
    return moment().isoWeekday(today)/*.add(1, 'days')*/;
}

module.exports = {
    dayOfWeek,
    tomorrow,
};
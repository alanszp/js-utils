# 📆 business-days-date-fns

An wrapper of some functionalities of <a href='https://date-fns.org/'>date-fns</a> with a custom non business days calendar.

<img src="header.png" />

## 🙋 Why?

`date-fns` is great, but maybe you want to control dates using a your self calendar. This library allow you to do this.

## ⌚ TD;LR

This library is like isWeekend that excludes Saturday and Sunday but excluding the dates of your calendar too

## 🕹️ Features

- <a href="https://date-fns.org/v2.28.0/docs/addBusinessDays">addBusinessDays</a>, <a href="https://date-fns.org/v2.28.0/docs/differenceInBusinessDays">differenceInBusinessDays</a> and <a href="https://date-fns.org/v2.28.0/docs/subBusinessDays">subBusinessDays</a> implementation and new functions: isNonBusinessDay, isBusinessDay,
- cache storage for a better performance

### Async implementation

```
const myDayOffsCalendar = withNonBusinessDays(({ year }) => {
  return fetch(`${MY_API_CALENDAR}?month=${month}`)
}, { serializeOptions: data => `year-${data.data}`})

const {
  addBusinessDays,
  subBusinessDays
  differenceInBusinessDays,
  isNonBusinessDay,
  isBusinessDay
} = withNonBusinessDays

const result = await addBusinessDays(new Date("2022-01-01"), 10, { year: 2022 })
```

### Sync implementation

```
const {
  addBusinessDays,
  subBusinessDays
  differenceInBusinessDays,
  isNonBusinessDay,
  isBusinessDay
} = withNonBusinessDays([
  new Date('2022-01-01'),
  new Date('2022-01-10')
])

const result = addBusinessDays(new Date("2022-01-01"), 10)
```

default:
	ts-node src/generateCalendar.ts 2023-01-09 2023-12-24 >calendar.pdf && open calendar.pdf

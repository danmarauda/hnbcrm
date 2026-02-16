import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("process overdue reminders", { minutes: 5 }, internal.tasks.processOverdueReminders);
crons.interval("process recurring tasks", { hours: 1 }, internal.tasks.processRecurringTasks);

export default crons;

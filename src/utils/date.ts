import type { ContextFn } from "date-fns";
import { addDays } from "date-fns";
type DateOptions = { in?: ContextFn<Date> };

export function sub365Days(date: Date, options?: DateOptions) {
	return addDays(date, -365, options);
}

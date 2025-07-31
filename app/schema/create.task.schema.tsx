import z from "zod";
export const taskSchema = z
  .object({
    title: z.string().min(1, { message: "Title can't be empty" }),
    description: z.string().min(1, { message: "Description can't be empty" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
  })
  .refine((data) => {
    const start = new Date(data.startTime).getTime();
    const end = new Date(data.endTime).getTime();
    return !isNaN(start) && !isNaN(end) && end >= start;
  }, {
    path: ["endTime"],
    message: "End time must be after or equal to start time",
  });


export type TaskInput = z.infer<typeof taskSchema>;

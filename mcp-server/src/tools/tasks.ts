import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HnbCrmClient } from "../client.js";
import { errorResult, successResult } from "../utils.js";

export function registerTaskTools(server: McpServer, client: HnbCrmClient) {
  server.tool(
    "crm_create_task",
    "Create a new task or reminder in the CRM. Tasks can be linked to leads or contacts, assigned to team members, and include checklists, recurrence, and due dates.",
    {
      title: z.string().describe("Task title"),
      description: z.string().optional().describe("Task description"),
      type: z
        .enum(["task", "reminder"])
        .optional()
        .describe("Type: 'task' or 'reminder'"),
      priority: z
        .enum(["low", "medium", "high", "urgent"])
        .optional()
        .describe("Task priority level"),
      activityType: z
        .string()
        .optional()
        .describe("Activity type (e.g. 'call', 'email', 'meeting', 'follow_up')"),
      dueDate: z
        .union([z.string(), z.number()])
        .optional()
        .describe("Due date as ISO string or unix milliseconds"),
      leadId: z.string().optional().describe("Link task to a lead"),
      contactId: z.string().optional().describe("Link task to a contact"),
      assignedTo: z
        .string()
        .optional()
        .describe("Team member ID to assign the task to"),
      recurrence: z
        .object({
          pattern: z.string().describe("Recurrence pattern (e.g. 'daily', 'weekly', 'monthly')"),
          endDate: z.string().optional().describe("End date for recurrence (ISO string)"),
        })
        .optional()
        .describe("Recurrence settings for repeating tasks"),
      checklist: z
        .array(z.string())
        .optional()
        .describe("Checklist items as an array of strings"),
      tags: z.array(z.string()).optional().describe("Categorization tags"),
    },
    { destructiveHint: false },
    async (args) => {
      try {
        const body: Record<string, any> = { ...args };
        if (args.checklist) {
          body.checklist = args.checklist.map((title: string, i: number) => ({
            id: `item-${i}`,
            title,
            completed: false,
          }));
        }
        const result = await client.post("/api/v1/tasks/create", body);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_list_tasks",
    "List tasks in the CRM with optional filters by status, priority, assignee, linked lead/contact, type, activity type, and due date range. Supports cursor-based pagination.",
    {
      status: z
        .string()
        .optional()
        .describe("Filter by status (e.g. 'pending', 'completed', 'overdue')"),
      priority: z
        .enum(["low", "medium", "high", "urgent"])
        .optional()
        .describe("Filter by priority"),
      assignedTo: z
        .string()
        .optional()
        .describe("Filter by assigned team member ID"),
      leadId: z.string().optional().describe("Filter by linked lead ID"),
      contactId: z.string().optional().describe("Filter by linked contact ID"),
      type: z
        .enum(["task", "reminder"])
        .optional()
        .describe("Filter by type"),
      activityType: z
        .string()
        .optional()
        .describe("Filter by activity type"),
      dueBefore: z
        .string()
        .optional()
        .describe("Filter tasks due before this date (ISO string)"),
      dueAfter: z
        .string()
        .optional()
        .describe("Filter tasks due after this date (ISO string)"),
      limit: z
        .number()
        .optional()
        .describe("Maximum number of results to return"),
      cursor: z
        .string()
        .optional()
        .describe("Pagination cursor from previous response"),
    },
    { readOnlyHint: true, destructiveHint: false },
    async (args) => {
      try {
        const params: Record<string, string> = {};
        if (args.status) params.status = args.status;
        if (args.priority) params.priority = args.priority;
        if (args.assignedTo) params.assignedTo = args.assignedTo;
        if (args.leadId) params.leadId = args.leadId;
        if (args.contactId) params.contactId = args.contactId;
        if (args.type) params.type = args.type;
        if (args.activityType) params.activityType = args.activityType;
        if (args.dueBefore) params.dueBefore = args.dueBefore;
        if (args.dueAfter) params.dueAfter = args.dueAfter;
        if (args.limit) params.limit = String(args.limit);
        if (args.cursor) params.cursor = args.cursor;
        const result = await client.get("/api/v1/tasks", params);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_get_task",
    "Get full details of a specific task by its ID, including checklist, comments, recurrence, and assignment info.",
    {
      id: z.string().describe("The task ID to retrieve"),
    },
    { readOnlyHint: true, destructiveHint: false },
    async (args) => {
      try {
        const result = await client.get("/api/v1/tasks/get", { id: args.id });
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_update_task",
    "Update properties of an existing task such as title, description, priority, activity type, due date, assignment, tags, or checklist.",
    {
      taskId: z.string().describe("ID of the task to update"),
      title: z.string().optional().describe("New task title"),
      description: z.string().optional().describe("New task description"),
      priority: z
        .enum(["low", "medium", "high", "urgent"])
        .optional()
        .describe("New priority level"),
      activityType: z
        .string()
        .optional()
        .describe("New activity type"),
      dueDate: z
        .union([z.string(), z.number()])
        .optional()
        .describe("New due date (ISO string or unix ms)"),
      assignedTo: z
        .string()
        .optional()
        .describe("New assignee team member ID"),
      tags: z.array(z.string()).optional().describe("Replace tags"),
      checklist: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            completed: z.boolean(),
          })
        )
        .optional()
        .describe("Replace checklist items"),
    },
    { destructiveHint: false },
    async (args) => {
      try {
        const result = await client.post("/api/v1/tasks/update", args);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_complete_task",
    "Mark a task as completed.",
    {
      taskId: z.string().describe("ID of the task to complete"),
    },
    { destructiveHint: false },
    async (args) => {
      try {
        const result = await client.post("/api/v1/tasks/complete", args);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_delete_task",
    "Permanently delete a task from the CRM. This action cannot be undone.",
    {
      taskId: z.string().describe("ID of the task to delete"),
    },
    { destructiveHint: true },
    async (args) => {
      try {
        const result = await client.post("/api/v1/tasks/delete", args);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_list_my_tasks",
    "Get the current agent's task queue, sorted by urgency (overdue first, then by due date). Useful for AI agents to check their pending work.",
    {
      limit: z
        .number()
        .optional()
        .describe("Maximum number of tasks to return"),
    },
    { readOnlyHint: true, destructiveHint: false },
    async (args) => {
      try {
        const params: Record<string, string> = {};
        if (args.limit) params.limit = String(args.limit);
        const result = await client.get("/api/v1/tasks/my", params);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_snooze_task",
    "Snooze/reschedule a reminder or task to a later time.",
    {
      taskId: z.string().describe("ID of the task to snooze"),
      snoozedUntil: z
        .number()
        .describe("New time to surface the task (unix milliseconds)"),
    },
    { destructiveHint: false },
    async (args) => {
      try {
        const result = await client.post("/api/v1/tasks/snooze", args);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_add_task_comment",
    "Add a comment to a task. Comments are visible to all team members with access to the task.",
    {
      taskId: z.string().describe("ID of the task to comment on"),
      content: z.string().describe("Comment text"),
    },
    { destructiveHint: false },
    async (args) => {
      try {
        const result = await client.post("/api/v1/tasks/comments/add", args);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_list_task_comments",
    "List all comments on a task in chronological order.",
    {
      taskId: z.string().describe("ID of the task to get comments for"),
    },
    { readOnlyHint: true, destructiveHint: false },
    async (args) => {
      try {
        const result = await client.get("/api/v1/tasks/comments", {
          taskId: args.taskId,
        });
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_search_tasks",
    "Search tasks by title or description text. Returns matching tasks sorted by relevance.",
    {
      query: z.string().describe("Search text to match against task fields"),
      limit: z
        .number()
        .optional()
        .describe("Maximum number of results to return"),
    },
    { readOnlyHint: true, destructiveHint: false },
    async (args) => {
      try {
        const params: Record<string, string> = { query: args.query };
        if (args.limit) params.limit = String(args.limit);
        const result = await client.get("/api/v1/tasks/search", params);
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "crm_bulk_complete_tasks",
    "Complete multiple tasks at once. Useful for batch-closing finished work items.",
    {
      taskIds: z
        .array(z.string())
        .describe("Array of task IDs to complete"),
      action: z
        .string()
        .optional()
        .describe("Bulk action to perform (default: 'complete')"),
    },
    { destructiveHint: false },
    async (args) => {
      try {
        const result = await client.post("/api/v1/tasks/bulk", {
          taskIds: args.taskIds,
          action: args.action ?? "complete",
        });
        return successResult(result);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}

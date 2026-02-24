import { internalQuery } from "./_generated/server";

export const dumpData = internalQuery({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db.query("organizations").take(5);
    const members = await ctx.db.query("teamMembers").take(5);
    // @ts-ignore
    const users = await ctx.db.query("user").take(5); // Better Auth table
    // @ts-ignore
    const oldUsers = await ctx.db.query("users").take(5); // Old auth table
    
    return {
      orgs,
      members,
      users,
      oldUsers
    };
  },
});

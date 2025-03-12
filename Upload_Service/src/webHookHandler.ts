// webhookHandler.js
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function handleOAuthSignIn(event:any) {
  // Find the GitHub external account
  const githubAccount = event.data.externalAccounts.find(
    (acc:any) => acc.provider === "github"
  );
  if (githubAccount && githubAccount.accessToken) {
    const githubToken = githubAccount.accessToken;
    // Store the token securely, e.g., in the user's metadata
    await clerkClient.users.updateUser(event.data.id, {
      publicMetadata: { githubToken },
    });
  }
}

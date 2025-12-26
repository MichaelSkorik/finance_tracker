import { getUsers } from "./auth";

export function exportEmails() {
  const emails = getUsers().map(u => u.email).join("\n");
  const blob = new Blob([emails], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "users-emails.txt";
  a.click();

  URL.revokeObjectURL(url);
}

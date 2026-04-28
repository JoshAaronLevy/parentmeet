"use server";

import { ManualReviewStatus } from "@parentmeet/shared";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "../../lib/auth";
import { reviewProposal } from "../../lib/proposals";

export async function reviewProposalAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  const notes = String(formData.get("notes") ?? "");

  if (!id) {
    throw new Error("Missing proposal id.");
  }

  const reviewStatus = getReviewStatus(action);

  await reviewProposal({
    id,
    notes,
    reviewStatus
  });

  revalidatePath("/dashboard");
  revalidatePath("/proposals");
  revalidatePath(`/proposals/${id}`);
  redirect(`/proposals/${id}`);
}

function getReviewStatus(action: string) {
  if (action === "approve") {
    return ManualReviewStatus.Approved;
  }

  if (action === "reject") {
    return ManualReviewStatus.Rejected;
  }

  if (action === "needs_changes") {
    return ManualReviewStatus.NeedsChanges;
  }

  throw new Error("Unknown review action.");
}

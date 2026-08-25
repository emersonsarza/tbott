import { expect, test } from "@playwright/test";

const pages = [
  ["/", "Good dogs."],
  ["/services", "Salon care that puts your dog first."],
  ["/mobile-services", "A full groomery, right outside your door."],
  ["/gallery", "The proof is in the poof."],
  ["/contact", "Questions? We’re all ears."],
  ["/book", "Tell us about your pup."],
] as const;

for (const [path, heading] of pages) {
  test(`${path} renders its primary heading`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
}

test("gallery opens an accessible lightbox", async ({ page }) => {
  await page.goto("/gallery");
  await page
    .getByRole("button", {
      name: /Open image: Before and after grooming/,
    })
    .first()
    .click();

  await expect(
    page.getByRole("dialog").getByRole("heading", {
      name: "Grooming transformation",
    }),
  ).toBeAttached();
});

test("booking form shows the success state", async ({ page }) => {
  await page.route("**/api/booking", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Request received. We’ll reply soon to confirm availability.",
      }),
    });
  });
  await page.goto("/book");
  await page.getByRole("button", { name: "Request appointment" }).click();
  await expect(
    page.getByRole("heading", { name: "Request received" }),
  ).toBeVisible();
});

test("booking form shows an API error", async ({ page }) => {
  await page.route("**/api/booking", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Appointment email is not configured yet.",
      }),
    });
  });
  await page.goto("/book");
  await page.getByRole("button", { name: "Request appointment" }).click();
  await expect(page.getByText("We couldn’t send this yet")).toBeVisible();
  await expect(
    page.getByText("Appointment email is not configured yet."),
  ).toBeVisible();
});

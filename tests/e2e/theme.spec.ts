import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("first visit uses light even when the OS prefers dark, and settings persist", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByText("Settings", { exact: true }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("link", { name: "Articles", exact: true })
    .first()
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByText("Settings", { exact: true }).click();
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
  await context.close();
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme} theme passes automated WCAG contrast checks`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("vst-review-theme", value),
      theme,
    );
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

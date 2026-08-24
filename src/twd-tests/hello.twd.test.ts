import { twd } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";

describe("App smoke test", () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  it("renders the home page", async () => {
    // Use the /twd skill to write actual test content
  });

  it("moves from the home page into the story", async () => {
    // Use the /twd skill to write actual test content
  });
});

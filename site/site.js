document.documentElement.classList.add("js");

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
if (menu && navigation) {
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
    menu.textContent = open ? "Close" : "Menu";
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      menu.click();
      menu.focus();
    }
  });
}

const examples = {
  launch: {
    project: "The next big thing",
    file: "Launch plan",
    title: "A good idea. A clear plan.",
    description:
      "A new collection, a small team, and everything we need to get it out into the world.",
    status: "Ready for your review",
    rows: [
      ["Shape the story", "Brand brief"],
      ["Find our people", "Audience research"],
      ["Bring it to life", "Launch checklist"],
    ],
    prompt:
      "Let's turn these ideas into a launch plan. Start with the notes in this project.",
    reply:
      "I've brought your notes together into a plan, with the story, the audience, and a checklist for launch day.",
    artifact: "Launch plan",
  },
  research: {
    project: "A little perspective",
    file: "Market research",
    title: "See the bigger picture.",
    description:
      "The research, the sources, and the questions worth asking next, all in one place.",
    status: "Sources included",
    rows: [
      ["Map the landscape", "Market overview"],
      ["Look a little closer", "Comparison table"],
      ["Find the opening", "Opportunities"],
    ],
    prompt:
      "Help me understand this market. Compare these companies and keep track of the sources.",
    reply:
      "I've organized the findings into a comparison, linked the sources, and highlighted a few gaps to explore.",
    artifact: "Market research",
  },
  operations: {
    project: "Keeping things moving",
    file: "Weekly briefing",
    title: "Less chasing. More clarity.",
    description:
      "A shared picture of what's moving, what needs attention, and where we go from here.",
    status: "Briefing prepared",
    rows: [
      ["Pull the threads together", "Team updates"],
      ["Spot what needs attention", "Open questions"],
      ["Make the next move", "This week's priorities"],
    ],
    prompt:
      "Read our project updates and prepare this week's briefing. Flag anything that needs a decision.",
    reply:
      "Here's the week in one place, with progress across the team and three questions for your next meeting.",
    artifact: "Weekly briefing",
  },
};

const picker = document.querySelector(".scenario-picker");
const preview = document.querySelector("#workspace-preview");
if (picker && preview) {
  picker.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-scenario]");
    if (!button) return;
    const example = examples[button.dataset.scenario];
    if (!example) return;
    for (const candidate of picker.querySelectorAll("button")) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }
    for (const project of preview.querySelectorAll("[data-project]")) {
      project.classList.toggle(
        "active",
        project.dataset.project === button.dataset.scenario,
      );
    }
    for (const element of preview.querySelectorAll("[data-field]")) {
      element.textContent = example[element.dataset.field];
    }
    for (const [index, row] of [
      ...preview.querySelectorAll(".doc-row"),
    ].entries()) {
      row.querySelector(".row-title").textContent = example.rows[index][0];
      row.querySelector("small").textContent = example.rows[index][1];
    }
    document.querySelector("#preview-status").textContent =
      `${example.file} example selected.`;
  });
}

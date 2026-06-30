const storageKey = "personal-task-dashboard-v1";
const quoteStorageKey = "personal-task-dashboard-daily-quote-v1";
const petStorageKey = "mishti-pet-dashboard-v1";
const userName = "Vikash";
const dailyQuotes = [
  "Small steps, clearly followed.",
  "Today, make progress visible.",
  "Focus on the next clean action.",
  "A calm list creates a calm day.",
  "Handle what matters, one follow up at a time.",
  "Clarity first. Momentum follows.",
  "Quiet consistency wins the week.",
  "Close the loop, lighten the mind.",
  "Do the useful thing next.",
  "Organized attention is personal power.",
  "Every completed follow up creates space.",
  "Keep it simple. Keep it moving.",
  "Progress begins with one honest update.",
  "Your future self loves clean records.",
  "Less noise, better action.",
  "Steady work compounds quietly.",
  "Make the next step unmistakable.",
  "Discipline can feel peaceful.",
  "Start with the task that removes weight.",
  "One clear promise to yourself is enough.",
];

const form = document.querySelector("#taskForm");
const taskId = document.querySelector("#taskId");
const taskName = document.querySelector("#taskName");
const createdDate = document.querySelector("#createdDate");
const priority = document.querySelector("#priority");
const workstream = document.querySelector("#workstream");
const locationType = document.querySelector("#locationType");
const nextFollowupDate = document.querySelector("#nextFollowupDate");
const inTouchWith = document.querySelector("#inTouchWith");
const lastFollowupVia = document.querySelector("#lastFollowupVia");
const pointOfContact = document.querySelector("#pointOfContact");
const govtInvolved = document.querySelector("#govtInvolved");
const govtFields = document.querySelector("#govtFields");
const departmentName = document.querySelector("#departmentName");
const websiteLink = document.querySelector("#websiteLink");
const ticketNumber = document.querySelector("#ticketNumber");
const officialContact = document.querySelector("#officialContact");
const notes = document.querySelector("#notes");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const taskTemplate = document.querySelector("#taskCardTemplate");
const submitButton = document.querySelector("#submitButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const formTitle = document.querySelector("#formTitle");
const searchInput = document.querySelector("#searchInput");
const priorityFilter = document.querySelector("#priorityFilter");
const workstreamFilter = document.querySelector("#workstreamFilter");
const locationFilter = document.querySelector("#locationFilter");
const totalTasks = document.querySelector("#totalTasks");
const dueSoonTasks = document.querySelector("#dueSoonTasks");
const highPriorityTasks = document.querySelector("#highPriorityTasks");
const welcomeLine = document.querySelector("#welcomeLine");
const dailyQuote = document.querySelector("#dailyQuote");
const viewToggle = document.querySelector("#viewToggle");
const personalDashboard = document.querySelector("#personalDashboard");
const petDashboard = document.querySelector("#petDashboard");
const petForm = document.querySelector("#petForm");
const lastDeworming = document.querySelector("#lastDeworming");
const nextHealthCheckup = document.querySelector("#nextHealthCheckup");
const lastCheckupDate = document.querySelector("#lastCheckupDate");
const doctorName = document.querySelector("#doctorName");
const hospitalName = document.querySelector("#hospitalName");
const medicalRecords = document.querySelector("#medicalRecords");
const medicalRecordList = document.querySelector("#medicalRecordList");
const lastGroomingDate = document.querySelector("#lastGroomingDate");
const groomingBy = document.querySelector("#groomingBy");
const groomingLocation = document.querySelector("#groomingLocation");
const lastShoppingDate = document.querySelector("#lastShoppingDate");
const shoppingCategory = document.querySelector("#shoppingCategory");
const shoppingItems = document.querySelector("#shoppingItems");
const petNextHealth = document.querySelector("#petNextHealth");
const petLastDeworming = document.querySelector("#petLastDeworming");
const petLastShopping = document.querySelector("#petLastShopping");
const petUpcomingEvent = document.querySelector("#petUpcomingEvent");
const petDewormingCountdown = document.querySelector("#petDewormingCountdown");
const petDoctorSummary = document.querySelector("#petDoctorSummary");
const petHospitalSummary = document.querySelector("#petHospitalSummary");
const petGroomingSummary = document.querySelector("#petGroomingSummary");
const petShoppingSummary = document.querySelector("#petShoppingSummary");
const petMonthFilter = document.querySelector("#petMonthFilter");
const petMonthEvents = document.querySelector("#petMonthEvents");
const petEventForm = document.querySelector("#petEventForm");
const petEventId = document.querySelector("#petEventId");
const petEventName = document.querySelector("#petEventName");
const petEventType = document.querySelector("#petEventType");
const petEventStatus = document.querySelector("#petEventStatus");
const petEventDate = document.querySelector("#petEventDate");
const petEventLocation = document.querySelector("#petEventLocation");
const petEventWith = document.querySelector("#petEventWith");
const petEventNotes = document.querySelector("#petEventNotes");
const petEventSubmit = document.querySelector("#petEventSubmit");
const petEventCancel = document.querySelector("#petEventCancel");
const petEventStatusFilter = document.querySelector("#petEventStatusFilter");
const petEventTypeFilter = document.querySelector("#petEventTypeFilter");
const petEventList = document.querySelector("#petEventList");

let tasks = loadTasks();
let activeStatus = "Open";
let activeView = "personal";
let petData = loadPetData();

function icon(name) {
  const extraClass = name === "paw" ? " paw-icon" : "";
  return `<svg class="icon${extraClass}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function renderGreeting() {
  welcomeLine.textContent = `Welcome, ${userName}.`;
  dailyQuote.textContent = getDailyQuote();
}

function getDailyQuote() {
  const today = todayIso();
  const saved = loadQuoteState();

  if (saved.date === today && dailyQuotes[saved.currentIndex]) {
    return dailyQuotes[saved.currentIndex];
  }

  const usedIndexes = new Set(Array.isArray(saved.usedIndexes) ? saved.usedIndexes : []);
  if (usedIndexes.size >= dailyQuotes.length) {
    usedIndexes.clear();
  }

  const availableIndexes = dailyQuotes
    .map((_, index) => index)
    .filter((index) => !usedIndexes.has(index));
  const nextIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  usedIndexes.add(nextIndex);

  localStorage.setItem(
    quoteStorageKey,
    JSON.stringify({
      date: today,
      currentIndex: nextIndex,
      usedIndexes: [...usedIndexes],
    }),
  );

  return dailyQuotes[nextIndex];
}

function loadQuoteState() {
  try {
    return JSON.parse(localStorage.getItem(quoteStorageKey)) || {};
  } catch {
    return {};
  }
}

function todayIso() {
  return toLocalIsoDate(new Date());
}

function currentMonthValue() {
  return todayIso().slice(0, 7);
}

function toLocalIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonthsIso(dateString, months) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  const originalDay = date.getDate();
  date.setMonth(date.getMonth() + months);

  if (date.getDate() !== originalDay) {
    date.setDate(0);
  }

  return toLocalIsoDate(date);
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function loadPetData() {
  try {
    return normalizePetData(JSON.parse(localStorage.getItem(petStorageKey)) || {});
  } catch {
    return normalizePetData({});
  }
}

function normalizePetData(data) {
  const events = Array.isArray(data.events) ? data.events : [];
  return {
    medicalRecords: [],
    events: [],
    ...data,
    medicalRecords: Array.isArray(data.medicalRecords) ? data.medicalRecords : [],
    events: events.filter((event) => !(event.name === "Pet Fair Visit Test" && event.notes === "Temporary test event")),
  };
}

function savePetData() {
  localStorage.setItem(petStorageKey, JSON.stringify(petData));
}

function switchDashboard(view) {
  activeView = view;
  const showingPet = activeView === "pet";

  personalDashboard.classList.toggle("hidden", showingPet);
  petDashboard.classList.toggle("hidden", !showingPet);
  viewToggle.setAttribute("aria-pressed", String(showingPet));
  viewToggle.setAttribute("title", showingPet ? "Open personal dashboard" : "Open Mishti dashboard");
  viewToggle.innerHTML = showingPet ? `${icon("user")}<span>Personal</span>` : `${icon("paw")}<span>Mishti</span>`;
}

function getPetFormData() {
  return {
    lastDeworming: lastDeworming.value,
    nextHealthCheckup: nextHealthCheckup.value,
    lastCheckupDate: lastCheckupDate.value,
    doctorName: doctorName.value.trim(),
    hospitalName: hospitalName.value.trim(),
    medicalRecords: Array.isArray(petData.medicalRecords) ? petData.medicalRecords : [],
    lastGroomingDate: lastGroomingDate.value,
    groomingBy: groomingBy.value.trim(),
    groomingLocation: groomingLocation.value.trim(),
    lastShoppingDate: lastShoppingDate.value,
    shoppingCategory: shoppingCategory.value,
    shoppingItems: shoppingItems.value.trim(),
    events: Array.isArray(petData.events) ? petData.events : [],
    updatedAt: new Date().toISOString(),
  };
}

function fillPetForm() {
  lastDeworming.value = petData.lastDeworming || "";
  nextHealthCheckup.value = petData.nextHealthCheckup || "";
  lastCheckupDate.value = petData.lastCheckupDate || "";
  doctorName.value = petData.doctorName || "";
  hospitalName.value = petData.hospitalName || "";
  lastGroomingDate.value = petData.lastGroomingDate || "";
  groomingBy.value = petData.groomingBy || "";
  groomingLocation.value = petData.groomingLocation || "";
  lastShoppingDate.value = petData.lastShoppingDate || "";
  shoppingCategory.value = petData.shoppingCategory || "Toys";
  shoppingItems.value = petData.shoppingItems || "";
  petMonthFilter.value = petData.selectedMonth || currentMonthValue();
  renderPetDashboard();
}

function renderPetDashboard() {
  const nextDewormingDate = addMonthsIso(petData.lastDeworming, 3);
  petNextHealth.textContent = petData.nextHealthCheckup ? formatDate(petData.nextHealthCheckup) : "Not set";
  petLastDeworming.textContent = nextDewormingDate ? formatDate(nextDewormingDate) : "Not set";
  petDewormingCountdown.textContent = getDewormingCountdown(nextDewormingDate);
  petLastShopping.textContent = petData.lastShoppingDate ? formatDate(petData.lastShoppingDate) : "Not set";
  petUpcomingEvent.textContent = getNextPetEvent()?.name || "Not set";
  petDoctorSummary.textContent = summaryWithMonth(petData.doctorName, petData.lastCheckupDate);
  petHospitalSummary.textContent = summaryWithMonth(petData.hospitalName, petData.lastCheckupDate);
  petGroomingSummary.textContent = summaryWithMonth([petData.groomingBy, petData.groomingLocation].filter(Boolean).join(" · "), petData.lastGroomingDate);
  petShoppingSummary.textContent = summaryWithMonth(petData.shoppingItems, petData.lastShoppingDate);
  renderMedicalRecords();
  renderPetMonthEvents();
  renderPetEvents();
}

function getDewormingCountdown(nextDewormingDate) {
  if (!nextDewormingDate) return "Add last deworming date";

  const diff = daysUntil(nextDewormingDate);
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} overdue`;
  if (diff === 0) return "Due today";
  return `${diff} day${diff === 1 ? "" : "s"} to go`;
}

function getNextPetEvent() {
  const today = todayIso();
  return [...(petData.events || [])]
    .filter((event) => event.status === "Upcoming" && event.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
}

function getPetEvents() {
  return [
    {
      type: "Deworming",
      date: petData.lastDeworming,
      detail: "Deworming completed",
      iconName: "heart",
    },
    {
      type: "Hospital Visit",
      date: petData.lastCheckupDate,
      detail: [petData.doctorName, petData.hospitalName].filter(Boolean).join(" · ") || "Checkup completed",
      iconName: "building",
    },
    {
      type: "Grooming",
      date: petData.lastGroomingDate,
      detail: [petData.groomingBy, petData.groomingLocation].filter(Boolean).join(" · ") || "Grooming completed",
      iconName: "paw",
    },
    {
      type: "Shopping",
      date: petData.lastShoppingDate,
      detail: [petData.shoppingCategory, petData.shoppingItems].filter(Boolean).join(" · ") || "Shopping completed",
      iconName: "bag",
    },
    ...(petData.events || [])
      .filter((event) => event.status === "Attended")
      .map((event) => ({
        type: event.type,
        date: event.date,
        detail: [event.name, event.location, event.withWhom].filter(Boolean).join(" · ") || "Pet event attended",
        iconName: event.type === "Shopping" ? "bag" : event.type === "Vet Visit" ? "heart" : "paw",
      })),
  ].filter((event) => event.date);
}

function renderPetMonthEvents() {
  const selectedMonth = petMonthFilter.value || currentMonthValue();
  const events = getPetEvents()
    .filter((event) => event.date.slice(0, 7) === selectedMonth)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  petMonthEvents.innerHTML = "";

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "month-empty";
    empty.textContent = "No grooming, shopping, deworming, or hospital visit recorded for this month.";
    petMonthEvents.append(empty);
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("article");
    const detail = document.createElement("p");
    item.className = "month-event-card";
    item.innerHTML = `
      ${icon(event.iconName)}
      <div>
        <span>${event.type}</span>
        <strong>${formatDate(event.date)}</strong>
      </div>
    `;
    detail.textContent = event.detail;
    item.querySelector("div").append(detail);
    petMonthEvents.append(item);
  });
}

function renderMedicalRecords() {
  const records = Array.isArray(petData.medicalRecords) ? petData.medicalRecords : [];
  medicalRecordList.innerHTML = "";

  if (!records.length) {
    medicalRecordList.innerHTML = `<p>No medical records uploaded</p>`;
    return;
  }

  records.forEach((record) => {
    const item = document.createElement("div");
    const name = document.createElement("span");
    const date = document.createElement("small");
    item.className = "record-item";
    item.innerHTML = icon("file");
    name.textContent = record.name;
    date.textContent = formatDate(record.addedOn);
    item.append(name, date);
    medicalRecordList.append(item);
  });
}

function getPetEventFormData() {
  return {
    id: petEventId.value || crypto.randomUUID(),
    name: petEventName.value.trim(),
    type: petEventType.value,
    status: petEventStatus.value,
    date: petEventDate.value,
    location: petEventLocation.value.trim(),
    withWhom: petEventWith.value.trim(),
    notes: petEventNotes.value.trim(),
    updatedAt: new Date().toISOString(),
  };
}

function resetPetEventForm() {
  petEventForm.reset();
  petEventId.value = "";
  petEventStatus.value = "Upcoming";
  petEventSubmit.innerHTML = `${icon("plus")}<span>Add Event</span>`;
  petEventCancel.classList.add("hidden");
}

function fillPetEventForm(event) {
  petEventId.value = event.id;
  petEventName.value = event.name;
  petEventType.value = event.type;
  petEventStatus.value = event.status;
  petEventDate.value = event.date;
  petEventLocation.value = event.location || "";
  petEventWith.value = event.withWhom || "";
  petEventNotes.value = event.notes || "";
  petEventSubmit.innerHTML = `${icon("edit")}<span>Update Event</span>`;
  petEventCancel.classList.remove("hidden");
  petEventName.focus();
}

function renderPetEvents() {
  const status = petEventStatusFilter.value;
  const type = petEventTypeFilter.value;
  const events = [...(petData.events || [])]
    .filter((event) => status === "All" || event.status === status)
    .filter((event) => type === "All" || event.type === type)
    .sort((a, b) => {
      const direction = a.status === "Upcoming" && b.status !== "Upcoming" ? -1 : a.status !== "Upcoming" && b.status === "Upcoming" ? 1 : 0;
      return direction || new Date(a.date) - new Date(b.date);
    });

  petEventList.innerHTML = "";

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "month-empty";
    empty.textContent = "No pet events match this selection.";
    petEventList.append(empty);
    return;
  }

  events.forEach((event) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const details = document.createElement("p");
    card.className = `pet-event-card event-${event.status.toLowerCase()}`;
    card.innerHTML = `
      <div class="card-topline">
        <span class="priority-pill">${event.status}</span>
        <span class="followup-pill">${event.type}</span>
      </div>
      <dl class="task-meta">
        <div><dt>Date</dt><dd></dd></div>
        <div><dt>Location</dt><dd></dd></div>
        <div><dt>With</dt><dd></dd></div>
      </dl>
      <div class="card-actions"></div>
    `;
    title.className = "task-title";
    title.textContent = event.name;
    card.insertBefore(title, card.querySelector(".task-meta"));
    const values = card.querySelectorAll(".task-meta dd");
    values[0].textContent = formatDate(event.date);
    values[1].textContent = event.location || "Not added";
    values[2].textContent = event.withWhom || "Not added";
    details.className = "task-notes";
    details.textContent = event.notes || "No notes added";
    card.insertBefore(details, card.querySelector(".card-actions"));

    const actions = card.querySelector(".card-actions");
    if (event.status === "Upcoming") {
      const attended = document.createElement("button");
      attended.className = "secondary-button";
      attended.type = "button";
      attended.innerHTML = `${icon("check")}<span>Mark Attended</span>`;
      attended.addEventListener("click", () => markPetEventAttended(event.id));
      actions.append(attended);
    }

    const edit = document.createElement("button");
    edit.className = "secondary-button";
    edit.type = "button";
    edit.innerHTML = `${icon("edit")}<span>Edit</span>`;
    edit.addEventListener("click", () => fillPetEventForm(event));
    actions.append(edit);

    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.innerHTML = `${icon("trash")}<span>Delete</span>`;
    remove.addEventListener("click", () => deletePetEvent(event.id));
    actions.append(remove);

    petEventList.append(card);
  });
}

function savePetEvents(nextEvents) {
  petData = {
    ...petData,
    events: nextEvents,
  };
  savePetData();
  renderPetDashboard();
}

function markPetEventAttended(id) {
  savePetEvents((petData.events || []).map((event) => (event.id === id ? { ...event, status: "Attended" } : event)));
}

function deletePetEvent(id) {
  savePetEvents((petData.events || []).filter((item) => item.id !== id));
  if (petEventId.value === id) resetPetEventForm();
}

function formatMonthYear(dateString) {
  if (!dateString) return "date not set";
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function summaryWithMonth(value, dateString) {
  const cleanValue = typeof value === "string" ? value.trim() : "";
  if (!cleanValue) return "Not added";
  return `${cleanValue} (${formatMonthYear(dateString)})`;
}

function formatDate(dateString) {
  if (!dateString) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function daysUntil(dateString) {
  const today = new Date(`${todayIso()}T00:00:00`);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

function followupInfo(task) {
  if (task.status === "Done") {
    return { label: "Completed", className: "followup-done" };
  }

  const diff = daysUntil(task.nextFollowupDate);
  if (diff < 0) return { label: `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} overdue`, className: "followup-overdue" };
  if (diff === 0) return { label: "Due today", className: "followup-today" };
  if (diff <= 3) return { label: `Due in ${diff} day${diff === 1 ? "" : "s"}`, className: "followup-today" };
  return { label: `Follow-up ${formatDate(task.nextFollowupDate)}`, className: "followup-upcoming" };
}

function getFormTask() {
  return {
    id: taskId.value || crypto.randomUUID(),
    taskName: taskName.value.trim(),
    createdDate: createdDate.value,
    priority: priority.value,
    workstream: workstream.value,
    locationType: locationType.value,
    nextFollowupDate: nextFollowupDate.value,
    inTouchWith: inTouchWith.value.trim(),
    lastFollowupVia: lastFollowupVia.value,
    pointOfContact: pointOfContact.value.trim(),
    govtInvolved: govtInvolved.checked,
    departmentName: departmentName.value.trim(),
    websiteLink: websiteLink.value.trim(),
    ticketNumber: ticketNumber.value.trim(),
    officialContact: officialContact.value.trim(),
    notes: notes.value.trim(),
    status: tasks.find((task) => task.id === taskId.value)?.status || "Open",
    updatedAt: new Date().toISOString(),
  };
}

function resetForm() {
  form.reset();
  taskId.value = "";
  createdDate.value = todayIso();
  nextFollowupDate.value = todayIso();
  priority.value = "Medium";
  workstream.value = "Personal";
  locationType.value = "Current City";
  lastFollowupVia.value = "Call";
  govtFields.classList.remove("visible");
  submitButton.innerHTML = `${icon("plus")}<span>Save Task</span>`;
  formTitle.textContent = "Add Task";
  cancelEditButton.classList.add("hidden");
}

function fillForm(task) {
  taskId.value = task.id;
  taskName.value = task.taskName;
  createdDate.value = task.createdDate;
  priority.value = task.priority;
  workstream.value = task.workstream || "Personal";
  locationType.value = task.locationType;
  nextFollowupDate.value = task.nextFollowupDate;
  inTouchWith.value = task.inTouchWith;
  lastFollowupVia.value = task.lastFollowupVia;
  pointOfContact.value = task.pointOfContact;
  govtInvolved.checked = task.govtInvolved;
  departmentName.value = task.departmentName;
  websiteLink.value = task.websiteLink;
  ticketNumber.value = task.ticketNumber;
  officialContact.value = task.officialContact;
  notes.value = task.notes;
  govtFields.classList.toggle("visible", task.govtInvolved);
  submitButton.innerHTML = `${icon("edit")}<span>Update Task</span>`;
  formTitle.textContent = "Edit Task";
  cancelEditButton.classList.remove("hidden");
  taskName.focus();
}

function priorityRank(value) {
  return { High: 0, Medium: 1, Low: 2 }[value] ?? 3;
}

function filteredTasks() {
  const query = searchInput.value.trim().toLowerCase();

  return tasks
    .filter((task) => activeStatus === "All" || task.status === activeStatus)
    .filter((task) => priorityFilter.value === "All" || task.priority === priorityFilter.value)
    .filter((task) => workstreamFilter.value === "All" || (task.workstream || "Personal") === workstreamFilter.value)
    .filter((task) => locationFilter.value === "All" || task.locationType === locationFilter.value)
    .filter((task) => {
      if (!query) return true;
      return [
        task.taskName,
        task.workstream,
        task.inTouchWith,
        task.pointOfContact,
        task.departmentName,
        task.ticketNumber,
        task.officialContact,
        task.notes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "Open" ? -1 : 1;
      const byDate = new Date(a.nextFollowupDate) - new Date(b.nextFollowupDate);
      return byDate || priorityRank(a.priority) - priorityRank(b.priority);
    });
}

function addMeta(dl, label, value) {
  const item = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = value || "Not added";
  item.append(dt, dd);
  dl.append(item);
}

function renderTasks() {
  const visibleTasks = filteredTasks();
  taskList.innerHTML = "";
  emptyState.classList.toggle("hidden", visibleTasks.length > 0);

  visibleTasks.forEach((task) => {
    const card = taskTemplate.content.firstElementChild.cloneNode(true);
    const followup = followupInfo(task);
    const priorityPill = card.querySelector(".priority-pill");
    const followupPill = card.querySelector(".followup-pill");
    const meta = card.querySelector(".task-meta");
    const govtSummary = card.querySelector(".govt-summary");
    const taskNotes = card.querySelector(".task-notes");
    const doneButton = card.querySelector(".done-button");
    const taskWorkstream = task.workstream || "Personal";

    card.classList.toggle("done", task.status === "Done");
    card.classList.add(`workstream-${taskWorkstream.toLowerCase()}`);
    priorityPill.textContent = `${task.priority} priority`;
    priorityPill.classList.add(`priority-${task.priority.toLowerCase()}`);
    followupPill.textContent = followup.label;
    followupPill.classList.add(followup.className);
    card.querySelector(".task-title").textContent = task.taskName;

    addMeta(meta, "Created", formatDate(task.createdDate));
    addMeta(meta, "Workstream", taskWorkstream);
    addMeta(meta, "Location", task.locationType);
    addMeta(meta, "In Touch With", task.inTouchWith);
    addMeta(meta, "Last Via", task.lastFollowupVia);
    addMeta(meta, "POC", task.pointOfContact);
    addMeta(meta, "Next Follow-up", formatDate(task.nextFollowupDate));

    if (task.govtInvolved) {
      govtSummary.classList.remove("hidden");
      const website = task.websiteLink
        ? `<a href="${task.websiteLink}" target="_blank" rel="noreferrer">Website</a>`
        : "No website";
      govtSummary.innerHTML = `
        <strong>Official process:</strong>
        ${task.departmentName || "Department not added"} ·
        ${task.ticketNumber || "No ticket number"} ·
        ${task.officialContact || "No official contact"} ·
        ${website}
      `;
    }

    if (task.notes) {
      taskNotes.classList.remove("hidden");
      taskNotes.textContent = task.notes;
    }

    doneButton.innerHTML =
      task.status === "Done" ? `${icon("circle")}<span>Reopen</span>` : `${icon("check")}<span>Done</span>`;
    doneButton.addEventListener("click", () => toggleDone(task.id));
    card.querySelector(".edit-button").addEventListener("click", () => fillForm(task));
    card.querySelector(".delete-button").addEventListener("click", () => deleteTask(task.id));

    taskList.append(card);
  });

  renderSummary();
}

function renderSummary() {
  totalTasks.textContent = tasks.length;
  dueSoonTasks.textContent = tasks.filter((task) => task.status === "Open" && daysUntil(task.nextFollowupDate) <= 3).length;
  highPriorityTasks.textContent = tasks.filter((task) => task.status === "Open" && task.priority === "High").length;
}

function toggleDone(id) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, status: task.status === "Done" ? "Open" : "Done" } : task));
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task || !confirm(`Delete "${task.taskName}"?`)) return;
  tasks = tasks.filter((item) => item.id !== id);
  if (taskId.value === id) resetForm();
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextTask = getFormTask();

  if (taskId.value) {
    tasks = tasks.map((task) => (task.id === nextTask.id ? nextTask : task));
  } else {
    tasks = [...tasks, nextTask];
  }

  saveTasks();
  resetForm();
  renderTasks();
});

govtInvolved.addEventListener("change", () => {
  govtFields.classList.toggle("visible", govtInvolved.checked);
});

cancelEditButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderTasks);
priorityFilter.addEventListener("change", renderTasks);
workstreamFilter.addEventListener("change", renderTasks);
locationFilter.addEventListener("change", renderTasks);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    activeStatus = tab.dataset.status;
    renderTasks();
  });
});

viewToggle.addEventListener("click", () => {
  switchDashboard(activeView === "personal" ? "pet" : "personal");
});

petForm.addEventListener("submit", (event) => {
  event.preventDefault();
  petData = getPetFormData();
  petData.selectedMonth = petMonthFilter.value || currentMonthValue();
  savePetData();
  renderPetDashboard();
});

petMonthFilter.addEventListener("change", () => {
  petData = {
    ...petData,
    selectedMonth: petMonthFilter.value,
  };
  savePetData();
  renderPetMonthEvents();
});

petEventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextEvent = getPetEventFormData();
  const events = petData.events || [];

  savePetEvents(
    petEventId.value
      ? events.map((item) => (item.id === nextEvent.id ? nextEvent : item))
      : [...events, nextEvent],
  );
  resetPetEventForm();
});

petEventCancel.addEventListener("click", resetPetEventForm);
petEventStatusFilter.addEventListener("change", renderPetEvents);
petEventTypeFilter.addEventListener("change", renderPetEvents);

medicalRecords.addEventListener("change", () => {
  const existingRecords = Array.isArray(petData.medicalRecords) ? petData.medicalRecords : [];
  const newRecords = [...medicalRecords.files].map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type || "Unknown",
    addedOn: todayIso(),
  }));

  petData = {
    ...getPetFormData(),
    selectedMonth: petMonthFilter.value || currentMonthValue(),
    medicalRecords: [...existingRecords, ...newRecords],
  };
  savePetData();
  renderPetDashboard();
  medicalRecords.value = "";
});

resetForm();
resetPetEventForm();
renderGreeting();
fillPetForm();
switchDashboard("personal");
renderTasks();

// Notes & Paws live Supabase layer
const cloudConfig = {
  supabaseUrl: "https://jnqolhzluloqsehvfdqx.supabase.co",
  supabaseAnonKey: "sb_publishable_N3RR5NcVyUNNbkFmcqQExA_ueAtT9ug",
};

let supabaseClient = null;
let cloudReady = false;
let currentUser = null;
let adminMode = false;
let authButton = null;
let syncStatus = null;
let masterAdminPanel = null;
let masterAdminList = null;
let masterAdminStats = null;
const originalRenderTasks = renderTasks;

function injectLiveStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .topbar-actions { display: inline-flex; align-items: center; gap: 10px; }
    .auth-toggle { min-width: 0; }
    .system-pill.is-live .icon { color: var(--green); fill: currentColor; stroke: none; }
    .system-pill.is-admin .icon { color: var(--blue); fill: currentColor; stroke: none; }
    .system-pill.is-error .icon { color: var(--red); fill: currentColor; stroke: none; }
    .read-only .task-form-panel, .read-only .pet-board, .read-only .pet-events-panel form { display: none; }
    .read-only .workspace, .read-only .pet-workspace, .admin-quick .workspace { grid-template-columns: 1fr; }
    .read-only .task-board, .read-only .pet-events-panel, .read-only .pet-month-panel, .admin-quick .task-board { min-width: 0; }
    .read-only .card-actions { display: none; }
    .admin-quick .task-form-panel, .admin-quick .edit-button, .admin-quick .delete-button { display: none; }
    .quick-followup-panel { display: grid; grid-template-columns: repeat(4, minmax(150px, 1fr)); gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); }
    .quick-followup-panel label { display: grid; gap: 6px; color: var(--muted); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .quick-followup-panel input, .quick-followup-panel select { width: 100%; min-height: 40px; border: 1px solid var(--line); border-radius: 999px; background: rgba(255,255,255,0.84); color: var(--ink); padding: 0 12px; }
    .quick-followup-save { align-self: end; min-height: 40px; justify-content: center; }
    .master-admin-panel { display: none; margin: 0 0 18px; padding: 20px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: rgba(255,255,255,0.82); box-shadow: var(--shadow-soft); }
    .master-admin-panel.visible { display: block; }
    .master-admin-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
    .master-admin-grid { display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: 10px; margin-bottom: 14px; }
    .master-stat { padding: 13px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: rgba(255,255,255,0.7); }
    .master-stat span { display: block; color: var(--muted); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .master-stat strong { display: block; margin-top: 5px; font-size: 1.35rem; }
    .master-admin-list { display: grid; gap: 8px; }
    .master-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: rgba(255,255,255,0.68); }
    .master-row strong, .master-row span { min-width: 0; overflow-wrap: anywhere; }
    .master-row span, .master-row small { color: var(--muted); }
    @media (max-width: 920px) { .master-admin-grid { grid-template-columns: repeat(2, minmax(120px, 1fr)); } .master-row { grid-template-columns: 1fr; } }
    @media (max-width: 860px) { .quick-followup-panel { grid-template-columns: 1fr; } }
    @media (max-width: 760px) { .topbar { align-items: flex-start; gap: 10px; } .topbar-actions { flex-wrap: wrap; justify-content: flex-end; } }
  `;
  document.head.append(style);
}

function setupLiveControls() {
  const topbar = document.querySelector(".topbar");
  const actions = document.createElement("div");
  actions.className = "topbar-actions";

  syncStatus = document.createElement("span");
  syncStatus.className = "system-pill";
  syncStatus.innerHTML = `${icon("circle")} View only`;

  authButton = document.createElement("button");
  authButton.className = "view-toggle auth-toggle";
  authButton.type = "button";
  authButton.innerHTML = `${icon("user")}<span>Admin Login</span>`;
  authButton.addEventListener("click", handleAuthClick);

  topbar.append(actions);
  actions.append(syncStatus, authButton, viewToggle);
  setupMasterAdminPanel(topbar);
}

function setupMasterAdminPanel(topbar) {
  masterAdminPanel = document.createElement("section");
  masterAdminPanel.className = "master-admin-panel";
  masterAdminPanel.innerHTML = [
    '<div class="master-admin-head">',
    '<div><p class="eyebrow">Master Admin</p><h2>Platform Overview</h2></div>',
    '<button class="secondary-button" type="button" id="masterRefreshButton">' + icon("clock") + '<span>Refresh</span></button>',
    '</div>',
    '<div class="master-admin-grid" id="masterAdminStats"></div>',
    '<div class="master-admin-list" id="masterAdminList"></div>',
  ].join("");
  topbar.insertAdjacentElement("afterend", masterAdminPanel);
  masterAdminStats = masterAdminPanel.querySelector("#masterAdminStats");
  masterAdminList = masterAdminPanel.querySelector("#masterAdminList");
  masterAdminPanel.querySelector("#masterRefreshButton").addEventListener("click", loadMasterAdminDashboard);
}

function loadSupabaseLibrary() {
  if (window.supabase?.createClient) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

function setSyncStatus(label, state = "live") {
  if (!syncStatus) return;
  syncStatus.className = `system-pill is-${state}`;
  syncStatus.innerHTML = `${icon(state === "error" ? "x" : state === "admin" ? "check" : "circle")} ${label}`;
}

async function initializeCloud() {
  injectLiveStyles();
  setupLiveControls();

  try {
    await loadSupabaseLibrary();
    supabaseClient = window.supabase.createClient(cloudConfig.supabaseUrl, cloudConfig.supabaseAnonKey);
    cloudReady = true;
    const { data } = await supabaseClient.auth.getSession();
    currentUser = data.session?.user || null;
    await refreshAdminMode();
    await loadCloudData();
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      currentUser = session?.user || null;
      await refreshAdminMode();
      await loadCloudData();
    });
  } catch (error) {
    console.error(error);
    setSyncStatus("Offline local", "error");
  }
}

async function refreshAdminMode() {
  adminMode = false;
  if (currentUser && supabaseClient) {
    const { data, error } = await supabaseClient.rpc("is_admin");
    adminMode = !error && data === true;
  }

  document.body.classList.toggle("read-only", !adminMode);
  document.body.classList.toggle("admin-quick", adminMode);
  if (authButton) {
    authButton.innerHTML = currentUser ? `${icon("user")}<span>Logout</span>` : `${icon("user")}<span>Admin Login</span>`;
  }

  if (masterAdminPanel) masterAdminPanel.classList.toggle("visible", adminMode);

  if (adminMode) setSyncStatus("Live admin", "admin");
  else if (currentUser) setSyncStatus("Signed in, view only", "live");
  else setSyncStatus("Live view only", "live");
}

async function handleAuthClick() {
  if (!supabaseClient) return;
  if (currentUser) {
    await supabaseClient.auth.signOut();
    return;
  }

  const email = prompt("Enter your email");
  if (!email) return;
  const password = prompt("Enter your password");
  if (!password) return;

  setSyncStatus("Signing in...", "live");
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    setSyncStatus("Login failed", "error");
    alert(error.message);
    return;
  }

  currentUser = data.user || data.session?.user || null;
  await refreshAdminMode();
  await loadCloudData();
  alert(adminMode ? "Workspace access enabled." : "Login successful, but this email is not in the admin list.");
}

function requireAdmin() {
  if (adminMode) return true;
  alert("This live dashboard is view-only until you sign in as admin.");
  return false;
}

function fromDbTask(row) {
  return {
    id: row.id,
    taskName: row.title,
    createdDate: row.created_date,
    priority: row.priority,
    workstream: row.workstream,
    locationType: row.location_type,
    nextFollowupDate: row.next_followup_date,
    inTouchWith: row.in_touch_with || "",
    lastFollowupVia: row.last_followup_via || "Not Done",
    pointOfContact: row.point_of_contact || "",
    govtInvolved: Boolean(row.govt_involved),
    departmentName: row.department_name || "",
    websiteLink: row.website_link || "",
    ticketNumber: row.ticket_number || "",
    officialContact: row.official_contact || "",
    notes: row.notes || "",
    status: row.status || "Open",
    updatedAt: row.updated_at,
  };
}

function toDbTask(task) {
  return {
    id: task.id,
    title: task.taskName,
    created_date: task.createdDate,
    priority: task.priority,
    workstream: task.workstream,
    location_type: task.locationType,
    next_followup_date: task.nextFollowupDate || null,
    in_touch_with: task.inTouchWith || null,
    last_followup_via: task.lastFollowupVia || "Not Done",
    point_of_contact: task.pointOfContact || null,
    govt_involved: Boolean(task.govtInvolved),
    department_name: task.departmentName || null,
    website_link: task.websiteLink || null,
    ticket_number: task.ticketNumber || null,
    official_contact: task.officialContact || null,
    notes: task.notes || null,
    status: task.status || "Open",
    is_public: true,
  };
}

async function loadCloudData() {
  if (!cloudReady) return;
  await Promise.all([loadCloudTasks(), loadCloudPetData()]);
  if (adminMode) await loadMasterAdminDashboard();
  renderTasks();
  fillPetForm();
}

async function getTableCount(table) {
  const { count, error } = await supabaseClient.from(table).select("id", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

function renderMasterStat(label, value) {
  return '<article class="master-stat"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></article>';
}

function renderMasterRow(title, detail, badge) {
  return [
    '<article class="master-row">',
    '<div><strong>' + escapeHtml(title) + '</strong><br><span>' + escapeHtml(detail) + '</span></div>',
    '<small>' + escapeHtml(badge) + '</small>',
    '</article>',
  ].join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadMasterAdminDashboard() {
  if (!adminMode || !masterAdminPanel) return;
  masterAdminStats.innerHTML = renderMasterStat("Loading", "...");
  masterAdminList.innerHTML = "";

  try {
    const [taskCount, petCount, eventCount, recordCount, openTasks, recentTasks, recentPets, recentEvents] = await Promise.all([
      getTableCount("tasks"),
      getTableCount("pets"),
      getTableCount("pet_events"),
      getTableCount("medical_records"),
      supabaseClient.from("tasks").select("id", { count: "exact", head: true }).eq("status", "Open"),
      supabaseClient.from("tasks").select("title,status,priority,workstream,next_followup_date,updated_at").order("updated_at", { ascending: false }).limit(5),
      supabaseClient.from("pets").select("name,breed,updated_at,created_at").order("updated_at", { ascending: false, nullsFirst: false }).limit(5),
      supabaseClient.from("pet_events").select("name,status,type,event_date,updated_at").order("event_date", { ascending: false }).limit(5),
    ]);

    if (openTasks.error || recentTasks.error || recentPets.error || recentEvents.error) {
      throw openTasks.error || recentTasks.error || recentPets.error || recentEvents.error;
    }

    masterAdminStats.innerHTML = [
      renderMasterStat("Tasks", taskCount),
      renderMasterStat("Open", openTasks.count || 0),
      renderMasterStat("Pets", petCount),
      renderMasterStat("Events", eventCount),
      renderMasterStat("Records", recordCount),
    ].join("");

    const rows = [
      ...(recentTasks.data || []).map((task) => renderMasterRow(
        task.title,
        [task.workstream, task.priority, task.next_followup_date ? "Follow-up " + formatDate(task.next_followup_date) : "No follow-up"].filter(Boolean).join(" · "),
        "Task · " + task.status,
      )),
      ...(recentPets.data || []).map((pet) => renderMasterRow(
        pet.name,
        pet.breed || "Breed not set",
        "Pet",
      )),
      ...(recentEvents.data || []).map((event) => renderMasterRow(
        event.name,
        [event.type, event.event_date ? formatDate(event.event_date) : "No date"].filter(Boolean).join(" · "),
        "Event · " + event.status,
      )),
    ];

    masterAdminList.innerHTML = rows.length ? rows.join("") : '<p class="month-empty">No platform activity yet.</p>';
  } catch (error) {
    console.error(error);
    masterAdminStats.innerHTML = renderMasterStat("Error", "!");
    masterAdminList.innerHTML = '<p class="month-empty">Master admin data could not be loaded.</p>';
  }
}
async function loadCloudTasks() {
  const table = adminMode ? "tasks" : "public_tasks";
  const { data, error } = await supabaseClient.from(table).select("*").order("next_followup_date", { ascending: true, nullsFirst: false });
  if (error) {
    console.error(error);
    setSyncStatus("Sync issue", "error");
    return;
  }
  tasks = (data || []).map(fromDbTask);
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

async function ensureMishtiPet() {
  const { data } = await supabaseClient.from("pets").select("id").eq("name", "Mishti").limit(1).maybeSingle();
  if (data?.id) return data.id;
  if (!adminMode) return null;
  const { data: inserted, error } = await supabaseClient.from("pets").insert({ name: "Mishti", breed: "Shih Tzu", is_public: true }).select("id").single();
  if (error) throw error;
  return inserted.id;
}

async function loadCloudPetData() {
  const petId = await ensureMishtiPet();
  if (!petId) return;
  const [health, grooming, shopping, records, events] = await Promise.all([
    supabaseClient.from("pet_health").select("*").eq("pet_id", petId).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabaseClient.from("pet_grooming").select("*").eq("pet_id", petId).order("grooming_date", { ascending: false }).limit(1).maybeSingle(),
    supabaseClient.from("pet_shopping").select("*").eq("pet_id", petId).order("shopping_date", { ascending: false }).limit(1).maybeSingle(),
    supabaseClient.from("medical_records").select("*").eq("pet_id", petId).order("created_at", { ascending: false }),
    supabaseClient.from("pet_events").select("*").eq("pet_id", petId).order("event_date", { ascending: true }),
  ]);

  petData = normalizePetData({
    petId,
    healthId: health.data?.id,
    groomingId: grooming.data?.id,
    shoppingId: shopping.data?.id,
    lastDeworming: health.data?.last_deworming || "",
    nextHealthCheckup: health.data?.next_health_checkup || "",
    lastCheckupDate: health.data?.last_checkup_date || "",
    doctorName: health.data?.doctor_name || "",
    hospitalName: health.data?.hospital_name || "",
    lastGroomingDate: grooming.data?.grooming_date || "",
    groomingBy: grooming.data?.groomer_name || "",
    groomingLocation: grooming.data?.location_name || "",
    lastShoppingDate: shopping.data?.shopping_date || "",
    shoppingCategory: shopping.data?.category || "Toys",
    shoppingItems: shopping.data?.items || "",
    medicalRecords: (records.data || []).map((record) => ({
      id: record.id,
      name: record.display_name,
      size: record.file_size,
      type: record.mime_type,
      addedOn: record.record_date || record.created_at?.slice(0, 10),
      storagePath: record.storage_path,
    })),
    events: (events.data || []).map((event) => ({
      id: event.id,
      name: event.name,
      type: event.type,
      status: event.status,
      date: event.event_date,
      location: event.location || "",
      withWhom: event.with_whom || "",
      notes: event.notes || "",
    })),
    selectedMonth: petData.selectedMonth || currentMonthValue(),
  });
  localStorage.setItem(petStorageKey, JSON.stringify(petData));
}

async function saveCloudTask(task) {
  const { data, error } = await supabaseClient.from("tasks").upsert(toDbTask(task)).select("*").single();
  if (error) throw error;
  return fromDbTask(data);
}

saveTasks = function saveTasksLive() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
};

renderTasks = function renderTasksLive() {
  originalRenderTasks();
  document.body.classList.toggle("read-only", !adminMode);
  document.body.classList.toggle("admin-quick", adminMode);
  renderQuickTaskControls();
};

function renderQuickTaskControls() {
  if (!adminMode) return;

  const visibleTasks = filteredTasks();
  taskList.querySelectorAll(".task-card").forEach((card, index) => {
    const task = visibleTasks[index];
    if (!task) return;

    const panel = document.createElement("div");
    panel.className = "quick-followup-panel";
    panel.innerHTML = [
      '<label>',
      '<span>Status</span>',
      '<select data-quick-field="status">',
      '<option value="Open">Open</option>',
      '<option value="Done">Done</option>',
      '</select>',
      '</label>',
      '<label>',
      '<span>Next Follow-up</span>',
      '<input data-quick-field="nextFollowupDate" type="date" />',
      '</label>',
      '<label>',
      '<span>Last Via</span>',
      '<select data-quick-field="lastFollowupVia">',
      '<option value="Call">Call</option>',
      '<option value="Message">Message</option>',
      '<option value="Email">Email</option>',
      '<option value="Not Done">Not Done</option>',
      '</select>',
      '</label>',
      '<button class="secondary-button quick-followup-save" type="button">' + icon("check") + '<span>Update</span></button>',
    ].join("");

    panel.querySelector('[data-quick-field="status"]').value = task.status || "Open";
    panel.querySelector('[data-quick-field="nextFollowupDate"]').value = task.nextFollowupDate || "";
    panel.querySelector('[data-quick-field="lastFollowupVia"]').value = task.lastFollowupVia || "Not Done";
    panel.querySelector(".quick-followup-save").addEventListener("click", () => saveQuickTaskUpdate(task.id, panel));
    card.append(panel);
  });
}

async function saveQuickTaskUpdate(id, panel) {
  if (!requireAdmin()) return;
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  const updatedTask = {
    ...task,
    status: panel.querySelector('[data-quick-field="status"]').value,
    nextFollowupDate: panel.querySelector('[data-quick-field="nextFollowupDate"]').value,
    lastFollowupVia: panel.querySelector('[data-quick-field="lastFollowupVia"]').value,
    updatedAt: new Date().toISOString(),
  };

  try {
    const saved = await saveCloudTask(updatedTask);
    tasks = tasks.map((item) => (item.id === id ? saved : item));
    saveTasks();
    renderTasks();
    setSyncStatus("Task updated", "admin");
  } catch (error) {
    alert(error.message);
  }
}

toggleDone = async function toggleDoneLive(id) {
  if (!requireAdmin()) return;
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  const saved = await saveCloudTask({ ...task, status: task.status === "Done" ? "Open" : "Done" });
  tasks = tasks.map((item) => (item.id === id ? saved : item));
  saveTasks();
  renderTasks();
};

deleteTask = async function deleteTaskLive(id) {
  if (!requireAdmin()) return;
  const task = tasks.find((item) => item.id === id);
  if (!task || !confirm(`Delete "${task.taskName}"?`)) return;
  const { error } = await supabaseClient.from("tasks").delete().eq("id", id);
  if (error) return alert(error.message);
  tasks = tasks.filter((item) => item.id !== id);
  if (taskId.value === id) resetForm();
  saveTasks();
  renderTasks();
};

form.addEventListener("submit", async (event) => {
  if (!cloudReady) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!requireAdmin()) return;
  try {
    const saved = await saveCloudTask(getFormTask());
    tasks = taskId.value ? tasks.map((task) => (task.id === saved.id ? saved : task)) : [...tasks, saved];
    saveTasks();
    resetForm();
    renderTasks();
  } catch (error) {
    alert(error.message);
  }
}, true);

async function saveCloudPetDetails() {
  const petId = petData.petId || await ensureMishtiPet();
  const details = getPetFormData();
  const healthPayload = {
    id: petData.healthId,
    pet_id: petId,
    last_deworming: details.lastDeworming || null,
    next_health_checkup: details.nextHealthCheckup || null,
    last_checkup_date: details.lastCheckupDate || null,
    doctor_name: details.doctorName || null,
    hospital_name: details.hospitalName || null,
    notes: null,
    is_public: true,
  };
  const groomingPayload = details.lastGroomingDate ? {
    id: petData.groomingId,
    pet_id: petId,
    grooming_date: details.lastGroomingDate,
    groomer_name: details.groomingBy || null,
    location_name: details.groomingLocation || null,
    is_public: true,
  } : null;
  const shoppingPayload = details.lastShoppingDate ? {
    id: petData.shoppingId,
    pet_id: petId,
    shopping_date: details.lastShoppingDate,
    category: details.shoppingCategory || "Misc",
    items: details.shoppingItems || null,
    is_public: true,
  } : null;

  await supabaseClient.from("pet_health").upsert(healthPayload).throwOnError();
  if (groomingPayload) await supabaseClient.from("pet_grooming").upsert(groomingPayload).throwOnError();
  if (shoppingPayload) await supabaseClient.from("pet_shopping").upsert(shoppingPayload).throwOnError();
  await loadCloudPetData();
}

petForm.addEventListener("submit", async (event) => {
  if (!cloudReady) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!requireAdmin()) return;
  try {
    await saveCloudPetDetails();
  } catch (error) {
    alert(error.message);
  }
}, true);

function toDbPetEvent(event, petId) {
  return {
    id: event.id,
    pet_id: petId,
    name: event.name,
    type: event.type,
    status: event.status,
    event_date: event.date,
    location: event.location || null,
    with_whom: event.withWhom || null,
    notes: event.notes || null,
    is_public: true,
  };
}

async function saveCloudPetEvent(event) {
  const petId = petData.petId || await ensureMishtiPet();
  const { error } = await supabaseClient.from("pet_events").upsert(toDbPetEvent(event, petId));
  if (error) throw error;
  await loadCloudPetData();
}

petEventForm.addEventListener("submit", async (event) => {
  if (!cloudReady) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!requireAdmin()) return;
  try {
    await saveCloudPetEvent(getPetEventFormData());
    resetPetEventForm();
  } catch (error) {
    alert(error.message);
  }
}, true);

markPetEventAttended = async function markPetEventAttendedLive(id) {
  if (!requireAdmin()) return;
  const { error } = await supabaseClient.from("pet_events").update({ status: "Attended" }).eq("id", id);
  if (error) return alert(error.message);
  await loadCloudPetData();
  renderPetDashboard();
};

deletePetEvent = async function deletePetEventLive(id) {
  if (!requireAdmin()) return;
  const { error } = await supabaseClient.from("pet_events").delete().eq("id", id);
  if (error) return alert(error.message);
  if (petEventId.value === id) resetPetEventForm();
  await loadCloudPetData();
  renderPetDashboard();
};

medicalRecords.addEventListener("change", async (event) => {
  if (!cloudReady) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!requireAdmin()) {
    medicalRecords.value = "";
    return;
  }
  try {
    const petId = petData.petId || await ensureMishtiPet();
    for (const file of [...medicalRecords.files]) {
      const safeName = file.name.replace(/[^a-z0-9.\-_]+/gi, "-");
      const storagePath = `${petId}/${Date.now()}-${safeName}`;
      const upload = await supabaseClient.storage.from("medical-records").upload(storagePath, file, { upsert: false });
      if (upload.error) throw upload.error;
      await supabaseClient.from("medical_records").insert({
        pet_id: petId,
        display_name: file.name,
        storage_path: storagePath,
        mime_type: file.type || null,
        file_size: file.size,
        record_date: todayIso(),
        is_public: false,
      }).throwOnError();
    }
    medicalRecords.value = "";
    await loadCloudPetData();
    renderPetDashboard();
  } catch (error) {
    alert(error.message);
  }
}, true);

initializeCloud();

// Multi-user product layer: accounts, owner workspaces, multi-pet selector, and private share links.
let productLayerReady = false;
let ownerMode = false;
let manageMode = false;
let currentProfile = null;
let signupButton = null;
let manageButton = null;
let shareButton = null;
let petSwitcherPanel = null;
let petSelector = null;
let addPetButton = null;

const baseRefreshAdminMode = refreshAdminMode;
const baseLoadCloudData = loadCloudData;
const baseFromDbTask = fromDbTask;
const baseToDbTask = toDbTask;

function setupProductLayer() {
  if (productLayerReady) return;
  productLayerReady = true;
  injectProductLayerStyles();
  setupProductAccountControls();
  setupProductPetSwitcher();
}

function injectProductLayerStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .account-action.hidden { display: none; }
    .owner-mode .delete-button { display: none; }
    .pet-switcher-panel { display: none; align-items: center; justify-content: space-between; gap: 12px; margin: 18px 0; padding: 14px 16px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: rgba(255,255,255,0.78); box-shadow: var(--shadow-soft); }
    .owner-mode .pet-switcher-panel, .read-only .pet-switcher-panel { display: flex; }
    .pet-switcher-panel label { display: inline-flex; align-items: center; gap: 8px; color: var(--muted); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .pet-switcher-panel select { min-height: 38px; border: 1px solid var(--line); border-radius: 999px; background: rgba(255,255,255,0.88); padding: 0 12px; }
    .read-only .pet-switcher-panel button { display: none; }
  `;
  document.head.append(style);
}

function setupProductAccountControls() {
  const actions = document.querySelector(".topbar-actions");
  if (!actions || signupButton) return;

  signupButton = document.createElement("button");
  signupButton.className = "view-toggle account-action";
  signupButton.type = "button";
  signupButton.innerHTML = `${icon("plus")}<span>Create Account</span>`;
  signupButton.addEventListener("click", handleSignupClick);

  manageButton = document.createElement("button");
  manageButton.className = "view-toggle account-action hidden";
  manageButton.type = "button";
  manageButton.innerHTML = `${icon("edit")}<span>Manage</span>`;
  manageButton.addEventListener("click", toggleManageMode);

  shareButton = document.createElement("button");
  shareButton.className = "view-toggle account-action hidden";
  shareButton.type = "button";
  shareButton.innerHTML = `${icon("layers")}<span>Share</span>`;
  shareButton.addEventListener("click", createShareLink);

  actions.insertBefore(signupButton, authButton);
  actions.insertBefore(manageButton, authButton);
  actions.insertBefore(shareButton, authButton);
}

function setupProductPetSwitcher() {
  const petHero = document.querySelector(".pet-hero");
  if (!petHero || petSwitcherPanel) return;
  petSwitcherPanel = document.createElement("section");
  petSwitcherPanel.className = "pet-switcher-panel";
  petSwitcherPanel.innerHTML = [
    '<label><span>Pet</span><select id="petSelector"></select></label>',
    '<button class="secondary-button" type="button" id="addPetButton">' + icon("plus") + '<span>Add Pet</span></button>',
  ].join("");
  petHero.insertAdjacentElement("afterend", petSwitcherPanel);
  petSelector = petSwitcherPanel.querySelector("#petSelector");
  addPetButton = petSwitcherPanel.querySelector("#addPetButton");
  petSelector.addEventListener("change", async () => {
    petData = normalizePetData({ ...petData, petId: petSelector.value });
    await loadCloudPetData();
    fillPetForm();
  });
  addPetButton.addEventListener("click", addPetForCurrentUser);
}

refreshAdminMode = async function refreshAdminModeProduct() {
  setupProductLayer();
  adminMode = false;
  ownerMode = Boolean(currentUser);

  if (currentUser && supabaseClient) {
    await ensureProfile();
    const { data, error } = await supabaseClient.rpc("is_admin");
    adminMode = !error && data === true;
  } else {
    currentProfile = null;
    manageMode = false;
  }

  document.body.classList.toggle("owner-mode", ownerMode);
  document.body.classList.toggle("read-only", !ownerMode);
  document.body.classList.toggle("admin-quick", ownerMode && !manageMode);
  document.body.classList.toggle("manage-mode", ownerMode && manageMode);

  if (authButton) {
    authButton.innerHTML = currentUser ? `${icon("user")}<span>Logout</span>` : `${icon("user")}<span>Login</span>`;
  }
  if (signupButton) signupButton.classList.toggle("hidden", ownerMode);
  if (manageButton) {
    manageButton.classList.toggle("hidden", !ownerMode);
    manageButton.innerHTML = manageMode ? `${icon("check")}<span>Quick View</span>` : `${icon("edit")}<span>Manage</span>`;
  }
  if (shareButton) shareButton.classList.toggle("hidden", !ownerMode);
  if (masterAdminPanel) masterAdminPanel.classList.toggle("visible", adminMode);

  if (adminMode) setSyncStatus("Master admin", "admin");
  else if (ownerMode) setSyncStatus("My workspace", "admin");
  else setSyncStatus("Private by default", "live");
};

loadCloudData = async function loadCloudDataProduct() {
  if (!cloudReady) return;
  setupProductLayer();
  if (currentUser) await ensureProfile();
  await Promise.all([loadCloudTasks(), loadCloudPetData()]);
  if (adminMode) await loadMasterAdminDashboard();
  renderTasks();
  fillPetForm();
};

fromDbTask = function fromDbTaskProduct(row) {
  return {
    ...baseFromDbTask(row),
    ownerId: row.owner_id,
  };
};

toDbTask = function toDbTaskProduct(task) {
  return {
    ...baseToDbTask(task),
    owner_id: task.ownerId || currentUser?.id || null,
  };
};

const baseHandleAuthClick = handleAuthClick;
handleAuthClick = async function handleAuthClickProduct() {
  if (!supabaseClient) return;
  if (currentUser) {
    await supabaseClient.auth.signOut();
    return;
  }

  const email = prompt("Enter your email");
  if (!email) return;
  const password = prompt("Enter your password");
  if (!password) return;

  setSyncStatus("Signing in...", "live");
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    setSyncStatus("Login failed", "error");
    alert(error.message);
    return;
  }

  currentUser = data.user || data.session?.user || null;
  await refreshAdminMode();
  await loadCloudData();
  alert(adminMode ? "Master admin access enabled." : "Your workspace is ready.");
};

function requireAdmin() {
  if (ownerMode) return true;
  alert("Please log in to manage your Notes & Paws workspace.");
  return false;
}

async function handleSignupClick() {
  if (!supabaseClient || currentUser) return;
  const email = prompt("Enter email for the new Notes & Paws account");
  if (!email) return;
  const password = prompt("Create a password with at least 6 characters");
  if (!password) return;
  const displayName = prompt("Display name") || email.split("@")[0];

  setSyncStatus("Creating account...", "live");
  const { data, error } = await supabaseClient.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { display_name: displayName.trim() } },
  });

  if (error) {
    setSyncStatus("Signup failed", "error");
    alert(error.message);
    return;
  }

  currentUser = data.user || data.session?.user || null;
  if (!currentUser) {
    alert("Account created. If Supabase asks for email confirmation, confirm once and then log in.");
    setSyncStatus("Check email", "live");
    return;
  }

  await ensureProfile(displayName.trim());
  await refreshAdminMode();
  await loadCloudData();
  alert("Your Notes & Paws workspace is ready.");
}

function toggleManageMode() {
  if (!ownerMode) return;
  manageMode = !manageMode;
  refreshAdminMode();
  renderTasks();
}

async function ensureProfile(displayName = "") {
  if (!currentUser || !supabaseClient) return null;
  const { data: existing } = await supabaseClient.from("profiles").select("*").eq("user_id", currentUser.id).maybeSingle();
  if (existing) {
    currentProfile = existing;
    return existing;
  }

  const baseName = displayName || currentUser.user_metadata?.display_name || currentUser.email?.split("@")[0] || "User";
  const slugBase = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "user";
  const { data, error } = await supabaseClient.from("profiles").insert({
    user_id: currentUser.id,
    email: currentUser.email,
    display_name: baseName,
    public_slug: `${slugBase}-${currentUser.id.slice(0, 6)}`,
  }).select("*").single();
  if (error) throw error;
  currentProfile = data;
  return data;
}

async function createShareLink() {
  if (!requireAdmin()) return;
  const scope = prompt("Share what? Type: all, personal, or pet", "all");
  if (!scope || !["all", "personal", "pet"].includes(scope)) return alert("Use all, personal, or pet.");
  const daysValue = Number(prompt("Expire after how many days?", "7"));
  const days = Number.isFinite(daysValue) && daysValue > 0 ? daysValue : 7;
  const token = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().slice(0, 8);
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();
  const { error } = await supabaseClient.from("share_links").insert({
    owner_id: currentUser.id,
    token,
    scope,
    pet_id: scope === "pet" ? (petData.petId || null) : null,
    label: scope === "pet" ? "Pet dashboard" : scope === "personal" ? "Personal dashboard" : "Full dashboard",
    expires_at: expiresAt,
  });
  if (error) return alert(error.message);
  const link = `${location.origin}${location.pathname}?share=${token}`;
  await navigator.clipboard?.writeText(link).catch(() => {});
  alert(`Private share link copied/created. It expires in ${days} day(s):\n${link}`);
}

loadCloudTasks = async function loadCloudTasksProduct() {
  const table = currentUser ? "tasks" : "public_tasks";
  const { data, error } = await supabaseClient.from(table).select("*").order("next_followup_date", { ascending: true, nullsFirst: false });
  if (error) {
    console.error(error);
    setSyncStatus("Sync issue", "error");
    return;
  }
  tasks = (data || []).map(fromDbTask);
  localStorage.setItem(storageKey, JSON.stringify(tasks));
};

async function loadPetsForCurrentContext() {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient.from("pets").select("id,name,breed,species,is_public,owner_id,created_at").order("created_at", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

function renderPetSelector(pets) {
  if (!petSelector) return;
  petSelector.innerHTML = "";
  pets.forEach((pet) => {
    const option = document.createElement("option");
    option.value = pet.id;
    option.textContent = [pet.name, pet.species].filter(Boolean).join(" · ");
    petSelector.append(option);
  });
  if (petData.petId) petSelector.value = petData.petId;
}

ensureMishtiPet = async function ensureActivePetProduct() {
  let pets = await loadPetsForCurrentContext();
  if (!pets.length && ownerMode) {
    const { data: inserted, error } = await supabaseClient.from("pets").insert({
      name: currentUser.email === "vikash.mohanta@rediffmail.com" ? "Mishti" : "My Pet",
      breed: currentUser.email === "vikash.mohanta@rediffmail.com" ? "Shih Tzu" : null,
      species: "Dog",
      owner_id: currentUser.id,
      is_public: true,
    }).select("id,name,breed,species,is_public,owner_id,created_at").single();
    if (error) throw error;
    pets = [inserted];
  }

  if (!pets.length) return null;
  const selected = pets.find((pet) => pet.id === petData.petId) || pets[0];
  petData = normalizePetData({ ...petData, petId: selected.id });
  renderPetSelector(pets);
  return selected.id;
};

async function addPetForCurrentUser() {
  if (!requireAdmin()) return;
  const name = prompt("Pet name");
  if (!name) return;
  const speciesInput = prompt("Species: Dog, Cat, or Other", "Dog") || "Dog";
  const species = ["Dog", "Cat", "Other"].includes(speciesInput) ? speciesInput : "Other";
  const breed = prompt("Breed (optional)") || "";
  const { data, error } = await supabaseClient.from("pets").insert({
    name: name.trim(),
    species,
    breed: breed.trim() || null,
    owner_id: currentUser.id,
    is_public: true,
  }).select("id").single();
  if (error) return alert(error.message);
  petData = normalizePetData({ petId: data.id, selectedMonth: currentMonthValue(), events: [], medicalRecords: [] });
  await loadCloudPetData();
  fillPetForm();
}

setupProductLayer();

// Private share-link viewer layer.
let activeShareToken = new URLSearchParams(location.search).get("share");
const productLoadCloudData = loadCloudData;

loadCloudData = async function loadCloudDataWithShare() {
  if (activeShareToken && !currentUser) {
    await loadSharedDashboard(activeShareToken);
    return;
  }
  await productLoadCloudData();
};

async function loadSharedDashboard(token) {
  if (!cloudReady || !supabaseClient) return;
  setupProductLayer();
  const { data, error } = await supabaseClient.rpc("share_payload", { share_token: token });
  if (error || !data?.valid) {
    tasks = [];
    petData = normalizePetData({ events: [], medicalRecords: [] });
    setSyncStatus("Share expired", "error");
    renderTasks();
    fillPetForm();
    return;
  }

  ownerMode = false;
  adminMode = false;
  manageMode = false;
  document.body.classList.add("read-only");
  document.body.classList.remove("owner-mode", "admin-quick", "manage-mode");
  setSyncStatus("Private shared view", "live");

  tasks = (data.tasks || []).map(fromDbTask);
  const pets = data.pets || [];
  renderPetSelector(pets);
  const selectedPet = pets[0];
  const health = (data.pet_health || []).find((item) => item.pet_id === selectedPet?.id) || {};
  const grooming = (data.pet_grooming || []).filter((item) => item.pet_id === selectedPet?.id).sort((a, b) => new Date(b.grooming_date) - new Date(a.grooming_date))[0] || {};
  const shopping = (data.pet_shopping || []).filter((item) => item.pet_id === selectedPet?.id).sort((a, b) => new Date(b.shopping_date) - new Date(a.shopping_date))[0] || {};

  petData = normalizePetData({
    petId: selectedPet?.id,
    lastDeworming: health.last_deworming || "",
    nextHealthCheckup: health.next_health_checkup || "",
    lastCheckupDate: health.last_checkup_date || "",
    doctorName: health.doctor_name || "",
    hospitalName: health.hospital_name || "",
    lastGroomingDate: grooming.grooming_date || "",
    groomingBy: grooming.groomer_name || "",
    groomingLocation: grooming.location_name || "",
    lastShoppingDate: shopping.shopping_date || "",
    shoppingCategory: shopping.category || "Toys",
    shoppingItems: shopping.items || "",
    events: (data.pet_events || []).map((event) => ({
      id: event.id,
      name: event.name,
      type: event.type,
      status: event.status,
      date: event.event_date,
      location: event.location || "",
      withWhom: event.with_whom || "",
      notes: event.notes || "",
    })),
    medicalRecords: [],
    selectedMonth: currentMonthValue(),
  });

  renderTasks();
  fillPetForm();
}

var semesters = [];
var currentSemesterIndex = 0;
var futureSemesters = [];
var currentFutureSemesterIndex = 0;
var gradeLabels = {
  "10": "S",
  "9": "A",
  "8": "B",
  "7": "C",
  "6": "D",
  "5": "E",
  "0": "F"
};
window.onload = function () {
  addNewSemester();
  addNewFutureSemester();
  setupEventListeners();
  updateDisplay();
};
function setupEventListeners() {
  document.getElementById("subjectForm").onsubmit = function (e) {
    e.preventDefault();
    addSubject(false);
  };
  document.getElementById("futureSubjectForm").onsubmit = function (e) {
    e.preventDefault();
    addSubject(true);
  };
  document.getElementById("addSemesterBtn").onclick = function () {
    addNewSemester();
    updateDisplay();
  };
  document.getElementById("addFutureSemesterBtn").onclick = function () {
    addNewFutureSemester();
    updateDisplay();
  };
  document.getElementById("whatIfMode").onchange = function () {
    var panel = document.getElementById("whatIfPanel");
    if (this.checked) {
      panel.style.display = "block";
    } else {
      panel.style.display = "none";
    }
    updateDisplay();
  };
}
function addNewSemester() {
  var semester = {
    name: "Semester " + (semesters.length + 1),
    subjects: []
  };
  semesters.push(semester);
  currentSemesterIndex = semesters.length - 1;
}
function addNewFutureSemester() {
  var semester = {
    name: "Future Semester " + (futureSemesters.length + 1),
    subjects: []
  };
  futureSemesters.push(semester);
  currentFutureSemesterIndex = futureSemesters.length - 1;
}
function addSubject(isFuture) {
  var nameInput, creditsInput, gradeInput;
  if (isFuture) {
    nameInput = document.getElementById("futureSubjectName");
    creditsInput = document.getElementById("futureSubjectCredits");
    gradeInput = document.getElementById("futureSubjectGrade");
  } else {
    nameInput = document.getElementById("subjectName");
    creditsInput = document.getElementById("subjectCredits");
    gradeInput = document.getElementById("subjectGrade");
  }
  var name = nameInput.value.trim();
  var credits = parseFloat(creditsInput.value);
  var gradePoints = parseFloat(gradeInput.value);
  if (name === "" || isNaN(credits) || credits <= 0 || isNaN(gradePoints)) {
    alert("Please fill all fields correctly. Credits must be greater than 0.");
    return;
  }
  var subject = {
    name: name,
    credits: credits,
    gradePoints: gradePoints,
    gradeLabel: gradeLabels[String(gradePoints)]
  };
  if (isFuture) {
    futureSemesters[currentFutureSemesterIndex].subjects.push(subject);
    document.getElementById("futureSubjectForm").reset();
  } else {
    semesters[currentSemesterIndex].subjects.push(subject);
    document.getElementById("subjectForm").reset();
  }
  updateDisplay();
}
function removeSubject(isFuture, semesterIndex, subjectIndex) {
  if (isFuture) {
    futureSemesters[semesterIndex].subjects.splice(subjectIndex, 1);
  } else {
    semesters[semesterIndex].subjects.splice(subjectIndex, 1);
  }
  updateDisplay();
}
function switchSemester(index, isFuture) {
  if (isFuture) {
    currentFutureSemesterIndex = index;
  } else {
    currentSemesterIndex = index;
  }
  updateDisplay();
}
function deleteSemester(index, isFuture) {
  if (isFuture) {
    if (futureSemesters.length <= 1) {
      alert("You need at least one future semester.");
      return;
    }
    futureSemesters.splice(index, 1);
    if (currentFutureSemesterIndex >= futureSemesters.length) {
      currentFutureSemesterIndex = futureSemesters.length - 1;
    }
  } else {
    if (semesters.length <= 1) {
      alert("You need at least one semester.");
      return;
    }
    semesters.splice(index, 1);
    if (currentSemesterIndex >= semesters.length) {
      currentSemesterIndex = semesters.length - 1;
    }
  }
  updateDisplay();
}

function formatCredits(credits) {
  if (credits % 1 === 0) {
    return credits.toString();
  }
  return credits.toFixed(1);
}

function calculateGPA(subjects) {
  if (subjects.length === 0) {
    return 0;
  }
  var totalPoints = 0;
  var totalCredits = 0;
  var i;
  for (i = 0; i < subjects.length; i++) {
    totalPoints = totalPoints + (subjects[i].gradePoints * subjects[i].credits);
    totalCredits = totalCredits + subjects[i].credits;
  }
  if (totalCredits === 0) {
    return 0;
  }
  return totalPoints / totalCredits;
}
function calculateCGPA(semesterList) {
  var allSubjects = [];
  var i;
  for (i = 0; i < semesterList.length; i++) {
    var j;
    for (j = 0; j < semesterList[i].subjects.length; j++) {
      allSubjects.push(semesterList[i].subjects[j]);
    }
  }
  return calculateGPA(allSubjects);
}
function getTotalCredits(semesterList) {
  var total = 0;
  var i, j;
  for (i = 0; i < semesterList.length; i++) {
    for (j = 0; j < semesterList[i].subjects.length; j++) {
      total = total + semesterList[i].subjects[j].credits;
    }
  }
  return total;
}
function updateDisplay() {
  var currentSem = semesters[currentSemesterIndex];
  var currentFutureSem = futureSemesters[currentFutureSemesterIndex];
  document.getElementById("currentSemesterTitle").textContent = currentSem.name;
  document.getElementById("futureSemesterTitle").textContent = currentFutureSem.name;
  renderSubjectTable("subjectList", currentSem.subjects, false, currentSemesterIndex);
  renderSubjectTable("futureSubjectList", currentFutureSem.subjects, true, currentFutureSemesterIndex);
  var semesterGPA = calculateGPA(currentSem.subjects);
  var runningCGPA = calculateCGPA(semesters);
  var whatIfEnabled = document.getElementById("whatIfMode").checked;
  var projectedCGPA = runningCGPA;
  if (whatIfEnabled) {
    var combined = [];
    var i;
    for (i = 0; i < semesters.length; i++) {
      combined.push(semesters[i]);
    }
    for (i = 0; i < futureSemesters.length; i++) {
      combined.push(futureSemesters[i]);
    }
    projectedCGPA = calculateCGPA(combined);
  }
  document.getElementById("semesterGpa").textContent = semesterGPA.toFixed(2);
  document.getElementById("runningCgpa").textContent = runningCGPA.toFixed(2);
  document.getElementById("projectedCgpa").textContent = projectedCGPA.toFixed(2);
  document.getElementById("currentSemGpa").textContent = semesterGPA.toFixed(2);
  renderSemestersOverview();
}
function renderSubjectTable(tableId, subjects, isFuture, semesterIndex) {
  var tbody = document.getElementById(tableId);
  tbody.innerHTML = "";
  var i;
  for (i = 0; i < subjects.length; i++) {
    var subject = subjects[i];
    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" + subject.name + "</td>" +
      "<td>" + formatCredits(subject.credits) + "</td>" +
      "<td>" + subject.gradeLabel + " (" + subject.gradePoints + ")</td>" +
      "<td>" + (subject.gradePoints * subject.credits).toFixed(1) + "</td>" +
      "<td><button class='btn btn-danger' onclick='removeSubject(" + isFuture + ", " + semesterIndex + ", " + i + ")'>Remove</button></td>";
    tbody.appendChild(row);
  }
}
function renderSemestersOverview() {
  var container = document.getElementById("semestersOverview");
  container.innerHTML = "";
  var i;
  for (i = 0; i < semesters.length; i++) {
    var sem = semesters[i];
    var gpa = calculateGPA(sem.subjects);
    var credits = getTotalCredits([sem]);
    var isActive = (i === currentSemesterIndex);
    var card = createSemesterCard(sem.name, gpa, credits, sem.subjects.length, false, i, isActive);
    container.appendChild(card);
  }
  var whatIfEnabled = document.getElementById("whatIfMode").checked;
  if (whatIfEnabled) {
    for (i = 0; i < futureSemesters.length; i++) {
      var fSem = futureSemesters[i];
      var fGpa = calculateGPA(fSem.subjects);
      var fCredits = getTotalCredits([fSem]);
      var fIsActive = (i === currentFutureSemesterIndex);
      var fCard = createSemesterCard(fSem.name, fGpa, fCredits, fSem.subjects.length, true, i, fIsActive);
      container.appendChild(fCard);
    }
  }
}
function createSemesterCard(name, gpa, credits, subjectCount, isFuture, index, isActive) {
  var card = document.createElement("div");
  card.className = "semester-card";
  if (isFuture) {
    card.className = card.className + " future";
  }
  if (isActive) {
    card.style.borderColor = "#3182ce";
    card.style.borderWidth = "2px";
  }
  var info = document.createElement("div");
  info.className = "semester-card-info";
  info.innerHTML =
    "<h4>" + name + (isFuture ? " (What-If)" : "") + "</h4>" +
    "<p>" + subjectCount + " subjects | " + formatCredits(credits) + " credits | GPA: " + gpa.toFixed(2) + "</p>";
  var actions = document.createElement("div");
  actions.className = "semester-card-actions";
  var selectBtn = document.createElement("button");
  selectBtn.className = "btn btn-secondary";
  selectBtn.textContent = "Edit";
  selectBtn.onclick = function () {
    switchSemester(index, isFuture);
  };
  var deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = function () {
    deleteSemester(index, isFuture);
  };
  actions.appendChild(selectBtn);
  actions.appendChild(deleteBtn);
  card.appendChild(info);
  card.appendChild(actions);
  return card;
}
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  document.getElementById("addForm").addEventListener("submit", addEntry);
});

function loadData() {
  const stored = localStorage.getItem("busData");
  const data = stored ? JSON.parse(stored) : getDefaultData();
  const tbody = document.querySelector("#busTable tbody");
  tbody.innerHTML = "";

  data.forEach(entry => {
    const row = createRow(entry.time, entry.date, entry.route);
    tbody.appendChild(row);
  });

  fillDays();
}

function getDefaultData() {
  return [
    { time: "11:58 AM", date: "2025-03-15", route: "ILOILO" },
    { time: "12:50 PM", date: "2025-03-30", route: "ILOILO" },
    { time: "01:44 PM", date: "2025-03-15", route: "San Dionisio" },
    { time: "03:23 PM", date: "2025-03-15", route: "San Dionisio" },
    { time: "05:13 PM", date: "2025-03-16", route: "San Dionisio" },
    { time: "06:44 PM", date: "2025-03-15", route: "San Dionisio" },
    { time: "08:00 PM", date: "2025-03-15", route: "San Dionisio" },
    { time: "08:59 PM", date: "2025-03-15", route: "San Dionisio" },
    { time: "06:20 AM", date: "2025-03-29", route: "ILOILO" },
    { time: "06:40 AM", date: "2025-03-16", route: "ILOILO" },
    { time: "07:12 AM", date: "2025-03-29", route: "ILOILO" },
    { time: "07:45 AM", date: "2025-03-16", route: "San Dionisio" },
    { time: "07:57 AM", date: "2025-03-16", route: "San Dionisio" },
    { time: "08:09 AM", date: "2025-03-16", route: "ILOILO" },
    { time: "10:07 AM", date: "2025-03-30", route: "San Dionisio" },
    { time: "10:34 AM", date: "2025-03-30", route: "ILOILO" },
    { time: "10:48 AM", date: "2025-03-30", route: "San Dionisio" },
  ];
}

function createRow(time, date, route) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${time}</td>
    <td>${date}</td>
    <td></td>
    <td>${route}</td>
  `;
  return row;
}

function fillDays() {
  const rows = document.querySelectorAll("#busTable tbody tr");
  rows.forEach(row => {
    const dateStr = row.cells[1].innerText.trim();
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("en-US", { weekday: 'long' });
    row.cells[2].innerText = dayName;
  });
}

function sortByCurrentTime() {
  const tbody = document.querySelector("#busTable tbody");
  const rows = Array.from(tbody.rows);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  rows.sort((a, b) => {
    const aMinutes = convertToMinutes(a.cells[0].innerText);
    const bMinutes = convertToMinutes(b.cells[0].innerText);

    return Math.abs(aMinutes - currentMinutes) - Math.abs(bMinutes - currentMinutes);
  });

  rows.forEach(row => tbody.appendChild(row));
}

function convertToMinutes(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function addEntry(e) {
  e.preventDefault();

  const timeInput = document.getElementById("time").value;
  const dateInput = document.getElementById("date").value;
  const route = document.getElementById("route").value;

  const time = formatTo12Hour(timeInput);

  const newData = { time, date: dateInput, route };
  const stored = localStorage.getItem("busData");
  const data = stored ? JSON.parse(stored) : getDefaultData();

  data.push(newData);
  localStorage.setItem("busData", JSON.stringify(data));

  loadData();
  document.getElementById("addForm").reset();
}

function formatTo12Hour(timeStr) {
  let [hours, minutes] = timeStr.split(":");
  hours = parseInt(hours);
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${modifier}`;
}

const firebaseConfig = {
    apiKey: "AIzaSyA-vpCqoRWojDdP_mm7qE-g8HID2d7s_6o",
    authDomain: "fir-project-a0d0f.firebaseapp.com",
    databaseURL: "https://fir-project-a0d0f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fir-project-a0d0f",
    storageBucket: "fir-project-a0d0f.appspot.com",
    messagingSenderId: "763768662098",
    appId: "1:763768662098:web:b07fb413ad198282f9578b",
    measurementId: "G-2J0TB5ZT1V"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
function executeCommand() {
    const command = document.getElementById("commandInput").value;
    if (!command) return;
    db.ref("commands").push({ type: "execute_command", command });
    alert("Command Executed");
}
function uploadFile() {
    const file = document.getElementById("uploadFile").files[0];
    const fileName = document.getElementById("uploadFileName").value;
    const filePath = document.getElementById("uploadPath").value || "";
    if (!file || !fileName) return alert("Provide file + filename");
    const reader = new FileReader();
    reader.onload = function () {
        const base64 = reader.result.split(",")[1];
        db.ref("commands").push({
            type: "upload_file",
            fileName,
            filePath,
            fileContent: base64,
        });
    };
    reader.readAsDataURL(file);
    alert("File Uploaded");
}
function downloadGithubFile() {
    const url = document.getElementById("githubURL").value;
    const fileName = document.getElementById("githubFileName").value;
    if (!url || !fileName) return;
    db.ref("commands").push({ type: "download_github_file", url, fileName });
    alert("File downloaded");
}
function renamePlugin(originalKey, oldPath) {
    const newName = prompt("Enter new file name:", oldPath);
    if (!newName || newName === oldPath) return;
    db.ref("commands").push({ type: "rename_file", oldPath, newPath: newName });
    alert("Plugin renamed");
}
function deletePlugin(pluginPath) {
    if (confirm("Are you sure you want to delete this plugin?")) {
        db.ref("commands").push({ type: "delete_file", filePath: pluginPath });
    }
}
function loadPlugin(fileName) {
    db.ref("commands").push({ type: "load_plugin", fileName });
    alert("Plugin loaded");
}
function refreshPluginList() {
    const container = document.getElementById("pluginList");
    container.innerHTML = "Loading...";
    db.ref("plugins").once("value", snap => {
        container.innerHTML = "";
        snap.forEach(child => {
            const data = child.val();
            const actualName = child.key.replace(/,/g, ".");
            const div = document.createElement("div");
            div.className = "plugin";
            div.innerHTML = `
                <span><strong>${actualName}</strong> (${data.status})</span>
                <div class="plugin-actions">
                    <button onclick="loadPlugin('${actualName}')">Load</button>
                    <button onclick="renamePlugin('${child.key}', '${actualName}')">Rename</button>
                    <button onclick="deletePlugin('${actualName}')">Delete</button>
                </div>
            `;
            container.appendChild(div);
        });
    });
}
setInterval(refreshPluginList, 5000);
refreshPluginList();
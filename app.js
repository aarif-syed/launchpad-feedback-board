const STORAGE_KEY = "launchpad-feedback-v1";
const starterIssues = [
  {id:1,title:"Add keyboard shortcuts",description:"Power users need faster ways to navigate between views.",priority:"High",status:"Open",created:"Today"},
  {id:2,title:"Improve mobile table layout",description:"Keep important columns readable on smaller screens.",priority:"Medium",status:"In progress",created:"Yesterday"},
  {id:3,title:"Show a helpful empty state",description:"Explain the next action when a search returns no results.",priority:"Low",status:"Done",created:"Oct 16"},
  {id:4,title:"Add export to CSV",description:"Let workspace owners export feedback for reporting.",priority:"Medium",status:"Open",created:"Oct 15"}
];
let issues = loadIssues();
let currentView = "all";
const $ = (id) => document.getElementById(id);
const dialog = $("issue-dialog");

function loadIssues(){
  try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) : starterIssues; }
  catch { return starterIssues; }
}
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(issues)); }
function safeText(value=""){return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function slug(value){return value.toLowerCase().replace(/\s+/g,"-");}
function render(){
  $("stat-total").textContent = issues.length;
  $("stat-open").textContent = issues.filter(x=>x.status==="Open").length;
  $("stat-progress").textContent = issues.filter(x=>x.status==="In progress").length;
  $("stat-done").textContent = issues.filter(x=>x.status==="Done").length;
  const search = $("search-input").value.trim().toLowerCase();
  const priority = $("priority-filter").value;
  const visible = issues.filter(item => {
    const viewMatch = currentView==="all" || (currentView==="open" && item.status==="Open") || (currentView==="progress" && item.status==="In progress") || (currentView==="done" && item.status==="Done");
    return viewMatch && (priority==="all" || item.priority===priority) && `${item.title} ${item.description}`.toLowerCase().includes(search);
  });
  $("issue-rows").innerHTML = visible.map(item=>`<tr>
    <td><div class="issue-title">${safeText(item.title)}</div><div class="issue-description">${safeText(item.description || "No description provided")}</div></td>
    <td><span class="priority ${safeText(item.priority)}">${safeText(item.priority)}</span></td>
    <td><span class="status ${slug(item.status)}">${safeText(item.status)}</span></td>
    <td>${safeText(item.created)}</td>
    <td><button class="row-menu" data-cycle="${item.id}" aria-label="Change status for ${safeText(item.title)}" title="Click to advance status">···</button></td>
  </tr>`).join("");
  $("empty-state").hidden = visible.length !== 0;
  $("issue-rows").parentElement.style.display = visible.length ? "" : "none";
  $("results-count").textContent = `${visible.length} ${visible.length===1?"item":"items"}`;
  const names={all:"Overview",open:"Open issues",progress:"In progress",done:"Completed"};
  $("crumb-current").textContent=names[currentView];
  $("page-title").textContent=currentView==="all"?"Feedback overview":names[currentView];
}
function toast(message){const node=$("toast");node.textContent=message;node.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove("show"),2400);}
function openDialog(){ $("issue-form").reset(); dialog.showModal(); $("issue-title").focus(); }
function closeDialog(){dialog.close();}
$("new-issue-btn").addEventListener("click",openDialog);
$("empty-new-btn").addEventListener("click",openDialog);
$("close-dialog").addEventListener("click",closeDialog);
$("cancel-dialog").addEventListener("click",closeDialog);
$("search-input").addEventListener("input",render);
$("priority-filter").addEventListener("change",render);
document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>{
  currentView=button.dataset.view;
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item===button));
  render();
}));
$("issue-rows").addEventListener("click",event=>{
  const button=event.target.closest("[data-cycle]");
  if(!button)return;
  const item=issues.find(x=>x.id===Number(button.dataset.cycle));
  if(!item)return;
  const order=["Open","In progress","Done"];
  item.status=order[(order.indexOf(item.status)+1)%order.length];
  persist();render();toast(`Status updated to ${item.status}`);
});
$("issue-form").addEventListener("submit",event=>{
  event.preventDefault();
  const form=new FormData(event.currentTarget);
  const title=String(form.get("title")||"").trim();
  if(!title){$("issue-title").focus();return;}
  issues.unshift({id:Date.now(),title,description:String(form.get("description")||"").trim(),priority:String(form.get("priority")),status:String(form.get("status")),created:new Date().toLocaleDateString(undefined,{month:"short",day:"numeric"})});
  persist();currentView="all";
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item.dataset.view==="all"));
  $("search-input").value="";$("priority-filter").value="all";
  closeDialog();render();toast("Feedback created successfully");
});
render();
